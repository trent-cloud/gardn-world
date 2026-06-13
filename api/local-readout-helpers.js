const SOIL_LABELS = {
  clay: 'Clay Heavy',
  sandy: 'Sandy',
  silty: 'Silty',
  loamy: 'Loamy',
  chalky: 'Chalky',
  peaty: 'Peaty',
};

const SOIL_LINES = {
  clay: 'This soil is likely to hold onto water after rain. That can be helpful in dry spells, and a reason to wait before working it when the ground is wet.',
  sandy: 'This soil is likely to drain quickly and warm up early. Useful for getting going in spring, but it can ask for steadier watering in dry spells.',
  silty: 'This soil is likely to be fertile and smooth-textured. It can be generous, but it is worth treating gently when wet so it does not compact.',
  loamy: 'This soil is likely to sit in the easy middle ground: holding some moisture, draining fairly well, and giving many plants a decent start.',
  chalky: 'This soil is likely to lean alkaline. That is useful to know before choosing plants that prefer acid soil.',
  peaty: 'This soil is likely to be organic-rich and good at holding moisture. It may stay damp for longer than the surface suggests.',
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
  const valid = /^(GIR0AA|[A-Z]{1,2}[0-9R][0-9A-Z]?[0-9][ABDEFGHJLNPQRSTUWXYZ]{2})$/.test(compact);
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

function buildSoilFact(soilProperties, { soilSource } = {}) {
  if (!soilProperties) {
    return {
      label: 'Soil',
      value: 'Not clear',
      body: 'The public soil data is not clear at this exact point. Gardn will ask what your soil feels like once you open the app, because a real garden always gets the final say.',
    };
  }

  const bucket = classifySoilBucket(soilProperties);
  if (soilSource === 'launch_area') {
    return {
      label: 'Soil',
      value: SOIL_LABELS[bucket],
      body: `${SOIL_LINES[bucket]} Treat it as a useful first clue, then let your own beds and borders confirm it.`,
    };
  }
  if (soilSource === 'nearby_soilgrids') {
    return {
      label: 'Soil',
      value: SOIL_LABELS[bucket],
      body: `The public soil data is patchy at the exact point, so Gardn checks a nearby read instead. ${SOIL_LINES[bucket]}`,
    };
  }

  return {
    label: 'Soil',
    value: SOIL_LABELS[bucket],
    body: SOIL_LINES[bucket],
  };
}

function buildReadoutPayload({ name, soilProperties, soilSource, weatherSummary }) {
  const displayName = formatDisplayName(name);
  const soilFact = buildSoilFact(soilProperties, { soilSource });
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
    intro: 'Before you add a single plant, Gardn can already pick up a few local clues: how wet the week has been, what the soil may be doing, and what the weather might ask of you next.',
    facts,
    cta: 'Download Gardn and those small clues can start living alongside your own beds, borders and pots.',
    caveat: 'These are local clues, not a lab test. Soil changes from garden to garden, and the weather read will keep moving with the week.',
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
