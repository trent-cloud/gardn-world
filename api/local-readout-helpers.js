const SOIL_NOTE_LINES = {
  clay: 'Your soil is likely to be Clay Heavy soil, so it can hold on to rain for longer.',
  sandy: 'Your soil is likely to be Sandy soil, so it may drain quickly when the weather turns dry.',
  silty: 'Your soil is likely to be Silty soil, which can be fertile but prefers a gentle touch when wet.',
  loamy: 'Your soil is likely to be Loamy soil, a forgiving mix that holds some water without staying too heavy.',
  chalky: 'Your soil is likely to be Chalky soil, useful to know when choosing plants that dislike alkaline ground.',
  peaty: 'Your soil is likely to be Peaty soil, so it can stay damp for longer than the surface suggests.',
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

function maxFinite(values, start, end) {
  let max = null;
  for (let i = start; i <= end; i += 1) {
    const value = values[i];
    if (Number.isFinite(value)) max = max == null ? value : Math.max(max, value);
  }
  return max == null ? null : roundOne(max);
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
  const sunshineSeconds = Array.isArray(daily && daily.sunshine_duration) ? daily.sunshine_duration : [];
  const maxWindSpeeds = Array.isArray(daily && daily.wind_speed_10m_max) ? daily.wind_speed_10m_max : [];
  const maxWindGusts = Array.isArray(daily && daily.wind_gusts_10m_max) ? daily.wind_gusts_10m_max : [];
  const todayIndex = dates.indexOf(today);
  const index = todayIndex >= 0 ? todayIndex : Math.min(7, Math.max(0, dates.length - 1));
  const tomorrowIndex = index + 1;

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
  const sunshineTomorrowHours = Number.isFinite(sunshineSeconds[tomorrowIndex])
    ? roundOne(sunshineSeconds[tomorrowIndex] / 3600)
    : null;
  const maxWindNext3DaysKph = maxFinite(
    maxWindSpeeds,
    tomorrowIndex,
    Math.min(maxWindSpeeds.length - 1, index + 3)
  );
  const maxWindGustNext3DaysKph = maxFinite(
    maxWindGusts,
    tomorrowIndex,
    Math.min(maxWindGusts.length - 1, index + 3)
  );
  const maxTemperatureTomorrowC = Number.isFinite(maxTemps[tomorrowIndex])
    ? roundOne(maxTemps[tomorrowIndex])
    : null;

  return {
    rainfallLast7DaysMm,
    rainNext3DaysMm,
    sunshineTomorrowHours,
    maxWindNext3DaysKph,
    maxWindGustNext3DaysKph,
    maxTemperatureTomorrowC,
    rainfallLine,
    forecastLine,
    temperatureLine,
  };
}

function buildSoilLine(soilProperties) {
  if (!soilProperties) {
    return 'The public soil data is not clear enough yet, so Gardn would ask what your soil feels like once you add your garden.';
  }

  const bucket = classifySoilBucket(soilProperties);
  return SOIL_NOTE_LINES[bucket];
}

function buildWaterLine(weatherSummary) {
  const rain = weatherSummary && weatherSummary.rainfallLast7DaysMm;
  if (!Number.isFinite(rain)) {
    return 'The recent rain read is not clear enough yet, but Gardn will keep checking once your garden is added.';
  }

  if (rain >= 20) {
    return `It has rained about ${formatMm(rain)} in the last seven days, so your borders have probably had a decent drink. Pots are still worth a quick check.`;
  }

  if (rain >= 8) {
    return `It has rained about ${formatMm(rain)} in the last seven days, enough to help borders, though pots can still dry out faster than the ground around them.`;
  }

  return `It has rained about ${formatMm(rain)} in the last seven days, so borders and pots may be on the thirsty side.`;
}

function buildWeatherLine(weatherSummary) {
  if (!weatherSummary) {
    return 'The next few days are worth checking in the app before you choose what to do outside.';
  }

  const wind = weatherSummary.maxWindNext3DaysKph;
  const gusts = weatherSummary.maxWindGustNext3DaysKph;
  if ((Number.isFinite(gusts) && gusts >= 50) || (Number.isFinite(wind) && wind >= 36)) {
    return 'Strong winds are due over the next few days, so it is worth checking tall or leggy plants are secure.';
  }

  const rainNext = weatherSummary.rainNext3DaysMm;
  if (Number.isFinite(rainNext) && rainNext >= 10) {
    return 'More rain is on the way, so this may be a better week for gentle jobs under cover than planting out.';
  }

  const tomorrowMax = weatherSummary.maxTemperatureTomorrowC;
  if (Number.isFinite(tomorrowMax) && tomorrowMax >= 24) {
    return 'Tomorrow looks warm, so early morning or evening will be kinder for watering and small jobs.';
  }

  const sunshine = weatherSummary.sunshineTomorrowHours;
  if (
    Number.isFinite(sunshine) &&
    sunshine >= 4 &&
    (!Number.isFinite(rainNext) || rainNext <= 3)
  ) {
    return 'Tomorrow looks bright enough for a gentle hour or two outside.';
  }

  return 'The next few days look fairly settled, which is often the best weather for small jobs.';
}

function buildReadoutPayload({ name, soilProperties, weatherSummary }) {
  const displayName = formatDisplayName(name);

  return {
    greeting: `Hi ${displayName}.`,
    noteLines: [
      "Gardn can't prune for you, but it can help you get more from the garden you already have.",
      buildSoilLine(soilProperties),
      buildWaterLine(weatherSummary),
      buildWeatherLine(weatherSummary),
    ],
    cta: 'Download Gardn and it can keep an eye on your own garden from day one.',
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
