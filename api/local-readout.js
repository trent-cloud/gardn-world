const {
  buildReadoutPayload,
  extractSoilProperties,
  normalizeUkPostcode,
  summarizeWeather,
} = require('./local-readout-helpers.js');

const CACHE_TTL_MS = 60 * 60 * 1000;
const cache = new Map();

function readBody(req) {
  const body = req.body;
  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  return body && typeof body === 'object' ? body : {};
}

function londonToday() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());
  const get = (type) => parts.find((part) => part.type === type)?.value;
  return `${get('year')}-${get('month')}-${get('day')}`;
}

async function fetchJson(fetchImpl, url, timeoutMs = 8000) {
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
  try {
    const response = await fetchImpl(url, controller ? { signal: controller.signal } : undefined);
    if (!response || !response.ok) return null;
    return await response.json();
  } catch {
    return null;
  } finally {
    if (timer) clearTimeout(timer);
  }
}

async function lookupPostcode(fetchImpl, normalized) {
  const url = `https://api.postcodes.io/postcodes/${encodeURIComponent(normalized.compact)}`;
  const data = await fetchJson(fetchImpl, url, 6000);
  if (!data || data.status !== 200 || !data.result) return null;
  const lat = Number(data.result.latitude);
  const lng = Number(data.result.longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return {
    lat,
    lng,
    outcode: data.result.outcode || normalized.outcode,
    place: data.result.admin_district || data.result.region || '',
  };
}

async function lookupWeather(fetchImpl, lat, lng) {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lng),
    daily: [
      'precipitation_sum',
      'temperature_2m_min',
      'temperature_2m_max',
    ].join(','),
    timezone: 'Europe/London',
    past_days: '7',
    forecast_days: '4',
  });
  return fetchJson(fetchImpl, `https://api.open-meteo.com/v1/forecast?${params.toString()}`, 7000);
}

async function lookupSoil(fetchImpl, lat, lng) {
  const params = new URLSearchParams();
  params.set('lon', String(lng));
  params.set('lat', String(lat));
  for (const property of ['clay', 'sand', 'silt', 'phh2o', 'soc']) {
    params.append('property', property);
  }
  params.set('depth', '0-5cm');
  params.set('value', 'mean');
  const data = await fetchJson(
    fetchImpl,
    `https://rest.isric.org/soilgrids/v2.0/properties/query?${params.toString()}`,
    9000
  );
  return data ? extractSoilProperties(data) : null;
}

function offsetCoordinate(lat, lng, distanceKm, bearingDeg) {
  const bearing = (bearingDeg * Math.PI) / 180;
  const latOffset = (distanceKm / 111.32) * Math.cos(bearing);
  const lngOffset = (distanceKm / (111.32 * Math.cos((lat * Math.PI) / 180))) * Math.sin(bearing);
  return {
    lat: lat + latOffset,
    lng: lng + lngOffset,
  };
}

async function lookupNearbySoil(fetchImpl, lat, lng) {
  const distancesKm = [1, 2, 4, 6];
  const bearingsDeg = [0, 90, 180, 270, 45, 135, 225, 315];

  for (const distanceKm of distancesKm) {
    const ring = bearingsDeg.map((bearingDeg) => {
      const point = offsetCoordinate(lat, lng, distanceKm, bearingDeg);
      return lookupSoil(fetchImpl, point.lat, point.lng);
    });
    const results = await Promise.all(ring);
    const soilProperties = results.find(Boolean);
    if (soilProperties) return soilProperties;
  }

  return null;
}

function launchAreaSoilFallback(outcode, place) {
  const normalizedOutcode = String(outcode || '').trim().toUpperCase();
  const normalizedPlace = String(place || '').trim().toLowerCase();
  const isNottinghamLaunchArea = normalizedOutcode.startsWith('NG') ||
    normalizedPlace.includes('nottingham') ||
    normalizedPlace.includes('gedling') ||
    normalizedPlace.includes('rushcliffe') ||
    normalizedPlace.includes('broxtowe');

  if (!isNottinghamLaunchArea) return null;

  return {
    clayPct: 42,
    sandPct: 24,
    siltPct: 34,
    phH2o: 6.2,
    socGkg: 35,
  };
}

function createLocalReadoutHandler({ fetchImpl = fetch, today = londonToday } = {}) {
  return async function localReadoutHandler(req, res) {
    if (req.method !== 'POST') {
      res.status(405).json({ ok: false, error: 'method' });
      return;
    }

    const body = readBody(req);
    const normalized = normalizeUkPostcode(body.postcode);
    if (!normalized) {
      res.status(200).json({ ok: false, error: 'invalid_postcode' });
      return;
    }

    const cacheKey = normalized.compact;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.storedAt < CACHE_TTL_MS) {
      res.status(200).json({
        ok: true,
        readout: buildReadoutPayload({
          ...cached.value,
          name: body.name,
          postcode: normalized.display,
        }),
      });
      return;
    }

    const location = await lookupPostcode(fetchImpl, normalized);
    if (!location) {
      res.status(200).json({ ok: false, error: 'postcode_lookup_failed' });
      return;
    }

    const [weather, publicSoilProperties] = await Promise.all([
      lookupWeather(fetchImpl, location.lat, location.lng),
      lookupSoil(fetchImpl, location.lat, location.lng),
    ]);
    const launchSoilProperties = publicSoilProperties
      ? null
      : launchAreaSoilFallback(location.outcode, location.place);
    const nearbySoilProperties = publicSoilProperties || launchSoilProperties
      ? null
      : await lookupNearbySoil(fetchImpl, location.lat, location.lng);
    const soilProperties = publicSoilProperties || launchSoilProperties || nearbySoilProperties;
    const soilSource = publicSoilProperties
      ? 'soilgrids'
      : launchSoilProperties
        ? 'launch_area'
        : nearbySoilProperties
          ? 'nearby_soilgrids'
          : 'none';

    const weatherSummary = weather && weather.daily
      ? summarizeWeather({ daily: weather.daily, today: today() })
      : {
          rainfallLast7DaysMm: null,
          rainNext3DaysMm: null,
          rainfallLine: null,
          forecastLine: null,
          temperatureLine: null,
        };

    const value = {
      postcode: normalized.display,
      place: location.place,
      soilProperties,
      soilSource,
      weatherSummary,
    };
    cache.set(cacheKey, { storedAt: Date.now(), value });

    res.status(200).json({
      ok: true,
      readout: buildReadoutPayload({
        ...value,
        name: body.name,
      }),
    });
  };
}

const handler = createLocalReadoutHandler();

module.exports = handler;
module.exports.createLocalReadoutHandler = createLocalReadoutHandler;
