const test = require('node:test');
const assert = require('node:assert/strict');

const {
  buildReadoutPayload,
  classifySoilBucket,
  extractSoilProperties,
  formatDisplayName,
  normalizeUkPostcode,
  summarizeWeather,
} = require('../api/local-readout-helpers.js');

test('formats a first-name greeting without trusting raw input', () => {
  assert.equal(formatDisplayName(' sarah jane '), 'Sarah');
  assert.equal(formatDisplayName("MARY-JANE"), 'Mary-Jane');
  assert.equal(formatDisplayName(''), 'there');
  assert.equal(formatDisplayName('1234'), 'there');
});

test('normalizes UK postcode input for lookup and display', () => {
  const cases = [
    ['ng54jl', { compact: 'NG54JL', display: 'NG5 4JL', outcode: 'NG5' }],
    ['ng139hg', { compact: 'NG139HG', display: 'NG13 9HG', outcode: 'NG13' }],
    ['ng22 9aa', { compact: 'NG229AA', display: 'NG22 9AA', outcode: 'NG22' }],
    ['m1 1ae', { compact: 'M11AE', display: 'M1 1AE', outcode: 'M1' }],
    ['b33 8th', { compact: 'B338TH', display: 'B33 8TH', outcode: 'B33' }],
    ['cr2 6xh', { compact: 'CR26XH', display: 'CR2 6XH', outcode: 'CR2' }],
    ['dn55 1pt', { compact: 'DN551PT', display: 'DN55 1PT', outcode: 'DN55' }],
    ['n1c 4ax', { compact: 'N1C4AX', display: 'N1C 4AX', outcode: 'N1C' }],
    ['w1a 1hq', { compact: 'W1A1HQ', display: 'W1A 1HQ', outcode: 'W1A' }],
    ['e20 2st', { compact: 'E202ST', display: 'E20 2ST', outcode: 'E20' }],
    ['ec1a 1bb', { compact: 'EC1A1BB', display: 'EC1A 1BB', outcode: 'EC1A' }],
    [' SW1A 1AA ', { compact: 'SW1A1AA', display: 'SW1A 1AA', outcode: 'SW1A' }],
  ];

  for (const [input, expected] of cases) {
    assert.deepEqual(normalizeUkPostcode(input), expected);
  }
  assert.equal(normalizeUkPostcode('not a postcode'), null);
});

test('classifies SoilGrids properties into Gardn soil buckets', () => {
  assert.equal(classifySoilBucket({ clayPct: 42, sandPct: 20, siltPct: 38, phH2o: 6.4, socGkg: 30 }), 'clay');
  assert.equal(classifySoilBucket({ clayPct: 20, sandPct: 56, siltPct: 24, phH2o: 6.4, socGkg: 30 }), 'sandy');
  assert.equal(classifySoilBucket({ clayPct: 20, sandPct: 20, siltPct: 60, phH2o: 6.4, socGkg: 30 }), 'silty');
  assert.equal(classifySoilBucket({ clayPct: 20, sandPct: 40, siltPct: 40, phH2o: 7.7, socGkg: 30 }), 'chalky');
  assert.equal(classifySoilBucket({ clayPct: 20, sandPct: 40, siltPct: 40, phH2o: 6.4, socGkg: 180 }), 'peaty');
  assert.equal(classifySoilBucket({ clayPct: 25, sandPct: 35, siltPct: 40, phH2o: 6.4, socGkg: 30 }), 'loamy');
});

test('extracts SoilGrids scaled values from the top depth only', () => {
  const response = {
    properties: {
      layers: [
        { name: 'clay', unit_measure: { d_factor: 10 }, depths: [{ values: { mean: 280 } }] },
        { name: 'sand', unit_measure: { d_factor: 10 }, depths: [{ values: { mean: 330 } }] },
        { name: 'silt', unit_measure: { d_factor: 10 }, depths: [{ values: { mean: 390 } }] },
        { name: 'phh2o', unit_measure: { d_factor: 10 }, depths: [{ values: { mean: 64 } }] },
        { name: 'soc', unit_measure: { d_factor: 10 }, depths: [{ values: { mean: 420 } }] },
      ],
    },
  };

  assert.deepEqual(extractSoilProperties(response), {
    clayPct: 28,
    sandPct: 33,
    siltPct: 39,
    phH2o: 6.4,
    socGkg: 42,
  });
});

test('summarizes recent and upcoming rainfall from daily weather rows', () => {
  const summary = summarizeWeather({
    today: '2026-06-13',
    daily: {
      time: [
        '2026-06-06',
        '2026-06-07',
        '2026-06-08',
        '2026-06-09',
        '2026-06-10',
        '2026-06-11',
        '2026-06-12',
        '2026-06-13',
        '2026-06-14',
        '2026-06-15',
        '2026-06-16',
      ],
      precipitation_sum: [6.2, 0, 7.4, 1.1, 3.4, 7.4, 0, 0, 1.2, 4.4, 0],
      temperature_2m_min: [13, 11, 13, 10, 10, 10, 16, 13, 12, 12, 12],
      temperature_2m_max: [15, 19, 17, 19, 17, 17, 22, 22, 18, 18, 20],
      sunshine_duration: [7200, 0, 1800, 3600, 2400, 5400, 1200, 3600, 19800, 7200, 3600],
      wind_speed_10m_max: [18, 16, 22, 24, 18, 20, 22, 17, 24, 28, 21],
      wind_gusts_10m_max: [32, 30, 36, 38, 33, 35, 39, 28, 42, 58, 34],
    },
  });

  assert.equal(summary.rainfallLast7DaysMm, 25.5);
  assert.equal(summary.rainNext3DaysMm, 5.6);
  assert.equal(summary.sunshineTomorrowHours, 5.5);
  assert.equal(summary.maxWindNext3DaysKph, 28);
  assert.equal(summary.maxWindGustNext3DaysKph, 58);
  assert.equal(summary.rainfallLine, 'About 26 mm of rain has fallen around you in the last seven days.');
  assert.equal(summary.forecastLine, 'Another 6 mm is forecast over the next three days.');
});

test('builds a short adaptive prose readout instead of fact blocks', () => {
  const payload = buildReadoutPayload({
    name: ' Sarah ',
    postcode: 'NG5 4JL',
    place: 'Nottingham',
    soilProperties: null,
    weatherSummary: {
      rainfallLast7DaysMm: 25.5,
      rainNext3DaysMm: 5.6,
      rainfallLine: 'About 26 mm of rain has fallen around you in the last seven days.',
      forecastLine: 'Another 6 mm is forecast over the next three days.',
      temperatureLine: 'Today looks around 13-22°C.',
      sunshineTomorrowHours: 5.5,
      maxWindNext3DaysKph: 28,
      maxWindGustNext3DaysKph: 58,
    },
  });

  assert.equal(payload.greeting, 'Hi Sarah.');
  assert.equal(payload.locationLine, undefined);
  assert.equal(payload.facts, undefined);
  assert.equal(payload.intro, undefined);
  assert.equal(payload.noteLines.length, 4);
  assert.match(payload.noteLines[0], /can't prune/i);
  assert.match(payload.noteLines[1], /public soil data/i);
  assert.doesNotMatch(payload.noteLines.join(' '), /Nottingham|NG5|postcode|local area/i);
  assert.match(payload.noteLines[2], /26 mm/i);
  assert.match(payload.noteLines[2], /decent drink/i);
  assert.match(payload.noteLines[3], /Strong winds/i);
  assert.doesNotMatch(payload.noteLines.join(' '), /soil model|launch read|prescription/i);
  assert.ok(payload.noteLines.every((line) => line.length < 150));
  assert.match(payload.cta, /Download Gardn/i);
  assert.ok(payload.cta.length < 80);
});

test('adapts water and weather prose for dry bright conditions', () => {
  const payload = buildReadoutPayload({
    name: 'Alex',
    place: 'Devon',
    soilProperties: { clayPct: 18, sandPct: 58, siltPct: 24, phH2o: 6.3, socGkg: 20 },
    soilSource: 'soilgrids',
    weatherSummary: {
      rainfallLast7DaysMm: 2.2,
      rainNext3DaysMm: 0.4,
      rainfallLine: 'About 2 mm of rain has fallen around you in the last seven days.',
      forecastLine: 'The next three days look mostly dry.',
      sunshineTomorrowHours: 7.2,
      maxWindNext3DaysKph: 18,
      maxWindGustNext3DaysKph: 28,
    },
  });

  const note = payload.noteLines.join(' ');
  assert.match(note, /Sandy soil/);
  assert.match(note, /drain quickly/i);
  assert.match(note, /2 mm/);
  assert.match(note, /thirsty side/i);
  assert.match(note, /bright enough/i);
  assert.doesNotMatch(note, /Devon|postcode|local area/i);
});
