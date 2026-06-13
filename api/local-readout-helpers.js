const SOIL_LABELS = {
  clay: 'clay-heavy',
  sandy: 'sandy',
  silty: 'silty',
  loamy: 'loamy',
  chalky: 'chalky',
  peaty: 'peaty',
};

const SOIL_LINES = {
  clay: 'The soil model reads this area as likely clay-heavy: rich, but slow to drain after wet spells.',
  sandy: 'The soil model reads this area as likely sandy: quick to drain, quick to dry out in warm weather.',
  silty: 'The soil model reads this area as likely silty: fertile, but easily compacted when it is wet.',
  loamy: 'The soil model reads this area as likely loamy: the good middle ground most plants prefer.',
  chalky: 'The soil model reads this area as likely chalky or alkaline: worth knowing before choosing acid-loving plants.',
  peaty: 'The soil model reads this area as likely peaty or organic-rich: moisture can linger longer than it looks.',
};

function formatDisplayName(input) {
  const first = String(input || '').trim().split(/\s+/)[0] || '';
  const cleaned = first.replace(/[^A-Za-z'-]/g, '').replace(/^[-']+|[-']+$/g, '');
  if (!/[A-Za-z]/.test(cleaned)) return 'there';

  return cleaned
    .toLowerCase()
    .split(/([-'])/)
    .map((part) => {
      if (part === '-' || part === "'") return part;
      return part ? part[0].toUpperCase() + part.slice(1) : part;
    })
    .join('');
}

function normalizeUkPostcode(input) {
  const compact = String(input || '').replace(/\s+/g, '').toUpperCase();
  const valid = /^(GIR0AA|[A-PR-UWYZ][A-HK-Y]?\d[\dABEHMNPRVWXY]?\d[ABD-HJLNP-UW-Z]{2})$/.test(compact);
  if (!valid) return null;

  const outcode = compact.slice(0, -3);
  return {
    compact,
    display: `${outcode} ${compact.slice(-3)}`,
    outcode,
  };
}

function classifySoilBucket(properties) {
  if (properties.socGkg != null && properties.socGkg >= 150) return 'peaty';
  if (properties.phH2o != null && properties.phH2o >= 7.5) return 'chalky';
  if (properties.clayPct >= 40) return 'clay';
  if (properties.siltPct >= 50) return 'silty';
  if (properties.sandPct >= 50) return 'sandy';
  return 'loamy';
}

function readLayer(layers, name) {
  const layer = layers.find((item) => item && item.name === name);
  if (!layer) return null;
  const raw = layer.depths && layer.depths[0] && layer.depths[0].values
    ? layer.depths[0].values.mean
    : null;
  if (raw == null || !Number.isFinite(raw)) return null;
  const factor = layer.unit_measure && Number.isFinite(layer.unit_measure.d_factor)
    ? layer.unit_measure.d_factor
    : null;
  return factor && factor !== 0 ? raw / factor : raw;
}

function extractSoilProperties(response) {
  const layers = response && response.properties && Array.isArray(response.properties.layers)
    ? response.properties.layers
    : [];
  const clayPct = readLayer(layers, 'clay');
  const sandPct = readLayer(layers, 'sand');
  const siltPct = readLayer(layers, 'silt');
  if (clayPct == null || sandPct == null || siltPct == null) return null;

  return {
    clayPct,
    sandPct,
    siltPct,
    phH2o: readLayer(layers, 'phh2o'),
    socGkg: readLayer(layers, 'soc'),
  };
}

function roundOne(value) {
  return Math.round(value * 10) / 10;
}

function formatMm(value) {
  const rounded = Math.round(value);
  return `${rounded} mm`;
}

function formatTemperatureRange(min, max) {
  if (!Number.isFinite(min) || !Number.isFinite(max)) return null;
  return `Today looks around ${Math.round(min)}-${Math.round(max)}°C.`;
}

function summarizeWeather({ daily, today }) {
  const dates = Array.isArray(daily && daily.time) ? daily.time : [];
  const precip = Array.isArray(daily && daily.precipitation_sum) ? daily.precipitation_sum : [];
  const minTemps = Array.isArray(daily && daily.temperature_2m_min) ? daily.temperature_2m_min : [];
  const maxTemps = Array.isArray(daily && daily.temperature_2m_max) ? daily.temperature_2m_max : [];
  const todayIndex = dates.indexOf(today);
  const index = todayIndex >= 0 ? todayIndex : Math.min(7, Math.max(0, dates.length - 1));

  let rainfallLast7DaysMm = 0;
  for (let i = Math.max(0, index - 7); i < index; i += 1) {
    const value = precip[i];
    if (Number.isFinite(value)) rainfallLast7DaysMm += value;
  }
  rainfallLast7DaysMm = roundOne(rainfallLast7DaysMm);

  let rainNext3DaysMm = 0;
  for (let i = index + 1; i <= Math.min(precip.length - 1, index + 3); i += 1) {
    const value = precip[i];
    if (Number.isFinite(value)) rainNext3DaysMm += value;
  }
  rainNext3DaysMm = roundOne(rainNext3DaysMm);

  const rainfallLine = rainfallLast7DaysMm > 0
    ? `About ${formatMm(rainfallLast7DaysMm)} of rain has fallen around you in the last seven days.`
    : 'There has been very little rain around you in the last seven days.';
  const forecastLine = rainNext3DaysMm > 0
    ? `Another ${formatMm(rainNext3DaysMm)} is forecast over the next three days.`
    : 'The next three days look mostly dry.';
  const temperatureLine = formatTemperatureRange(minTemps[index], maxTemps[index]);

  return {
    rainfallLast7DaysMm,
    rainNext3DaysMm,
    rainfallLine,
    forecastLine,
    temperatureLine,
  };
}

function buildSoilFact(soilProperties, { soilSource, place } = {}) {
  if (!soilProperties) {
    return {
      label: 'Soil',
      value: 'Not clear',
      body: "The public soil model couldn't read the soil clearly for this point. Gardn will ask you what your garden is actually like once you open the app.",
    };
  }

  const bucket = classifySoilBucket(soilProperties);
  const safePlace = String(place || '').trim();
  if (soilSource === 'launch_area' && safePlace) {
    return {
      label: 'Soil',
      value: SOIL_LABELS[bucket],
      body: `Gardn's ${safePlace} launch read puts this area on likely ${SOIL_LABELS[bucket]} soil: rich, but slow to drain after wet spells.`,
    };
  }
  if (soilSource === 'nearby_soilgrids') {
    return {
      label: 'Soil',
      value: SOIL_LABELS[bucket],
      body: `A nearby public soil read around ${safePlace || 'your postcode'} puts this area on likely ${SOIL_LABELS[bucket]} soil. Soil varies street by street, but this is a stronger first read than leaving it blank.`,
    };
  }

  return {
    label: 'Soil',
    value: SOIL_LABELS[bucket],
    body: SOIL_LINES[bucket],
  };
}

function buildReadoutPayload({ name, postcode, place, soilProperties, soilSource, weatherSummary }) {
  const normalized = normalizeUkPostcode(postcode);
  const outcode = normalized ? normalized.outcode : String(postcode || '').trim().split(/\s+/)[0].toUpperCase();
  const displayName = formatDisplayName(name);
  const safePlace = String(place || '').trim();
  const soilFact = buildSoilFact(soilProperties, { soilSource, place: safePlace });
  const locationLine = safePlace ? `Around ${outcode}, ${safePlace}.` : `Around ${outcode}.`;
  const facts = [
    {
      label: 'Rain',
      value: weatherSummary && Number.isFinite(weatherSummary.rainfallLast7DaysMm)
        ? formatMm(weatherSummary.rainfallLast7DaysMm)
        : 'Local',
      body: weatherSummary && weatherSummary.rainfallLine
        ? weatherSummary.rainfallLine
        : 'Gardn could not read the recent rainfall clearly, but the app will keep checking once your garden exists.',
    },
    soilFact,
  ];

  if (weatherSummary && weatherSummary.forecastLine) {
    facts.push({
      label: 'Next',
      value: Number.isFinite(weatherSummary.rainNext3DaysMm) ? formatMm(weatherSummary.rainNext3DaysMm) : 'Soon',
      body: weatherSummary.forecastLine,
    });
  }

  if (weatherSummary && weatherSummary.temperatureLine) {
    facts.push({
      label: 'Today',
      value: 'Weather',
      body: weatherSummary.temperatureLine,
    });
  }

  return {
    greeting: `Hi ${displayName}.`,
    locationLine,
    intro: 'This is the kind of local context Gardn starts with before it knows a single plant in your garden.',
    facts,
    cta: 'Gardn gets sharper once it knows your actual borders, plants and pots.',
    caveat: 'A first read, not a lab test. Soil varies from garden to garden, and weather is modelled locally.',
  };
}

module.exports = {
  buildReadoutPayload,
  classifySoilBucket,
  extractSoilProperties,
  formatDisplayName,
  normalizeUkPostcode,
  summarizeWeather,
};
