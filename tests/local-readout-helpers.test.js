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
    },
  });

  assert.equal(summary.rainfallLast7DaysMm, 25.5);
  assert.equal(summary.rainNext3DaysMm, 5.6);
  assert.equal(summary.rainfallLine, 'About 26 mm of rain has fallen around you in the last seven days.');
  assert.equal(summary.forecastLine, 'Another 6 mm is forecast over the next three days.');
});

test('builds a warm readout with soil fallback when the public soil service has no data', () => {
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
    },
  });

  assert.equal(payload.greeting, 'Hi Sarah.');
  assert.equal(payload.locationLine, undefined);
  assert.match(payload.intro, /local clues/i);
  assert.equal(payload.facts[0].label, 'Rain');
  assert.equal(payload.facts[1].label, 'Soil');
  assert.match(payload.facts[1].body, /public soil data is not clear/i);
  assert.doesNotMatch(payload.facts[1].body, /soil model|launch read/i);
  assert.equal(payload.cta, 'Download Gardn and those small clues can start living alongside your own beds, borders and pots.');
});
