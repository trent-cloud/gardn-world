const test = require('node:test');
const assert = require('node:assert/strict');

const { createLocalReadoutHandler } = require('../api/local-readout.js');

function makeResponse() {
  return {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

test('rejects invalid UK postcodes before calling providers', async () => {
  const calls = [];
  const handler = createLocalReadoutHandler({
    fetchImpl: async (url) => {
      calls.push(String(url));
      throw new Error('fetch should not be called');
    },
    today: () => '2026-06-13',
  });
  const res = makeResponse();

  await handler({ method: 'POST', body: { name: 'Sarah', postcode: 'not a postcode' } }, res);

  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, { ok: false, error: 'invalid_postcode' });
  assert.deepEqual(calls, []);
});

test('accepts valid two-digit outward UK postcodes before provider lookup', async () => {
  const calls = [];
  const handler = createLocalReadoutHandler({
    fetchImpl: async (url) => {
      const href = String(url);
      calls.push(href);
      if (href.includes('api.postcodes.io')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            status: 200,
            result: {
              postcode: 'NG13 9HG',
              outcode: 'NG13',
              latitude: 52.904319,
              longitude: -0.927572,
              admin_district: 'Rushcliffe',
            },
          }),
        };
      }
      if (href.includes('api.open-meteo.com')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            daily: {
              time: ['2026-06-12', '2026-06-13', '2026-06-14'],
              precipitation_sum: [4, 0, 1],
              temperature_2m_min: [11, 12, 12],
              temperature_2m_max: [18, 19, 20],
            },
          }),
        };
      }
      if (href.includes('rest.isric.org')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            properties: {
              layers: [
                { name: 'clay', unit_measure: { d_factor: 10 }, depths: [{ values: { mean: 410 } }] },
                { name: 'sand', unit_measure: { d_factor: 10 }, depths: [{ values: { mean: 300 } }] },
                { name: 'silt', unit_measure: { d_factor: 10 }, depths: [{ values: { mean: 290 } }] },
                { name: 'phh2o', unit_measure: { d_factor: 10 }, depths: [{ values: { mean: 62 } }] },
                { name: 'soc', unit_measure: { d_factor: 10 }, depths: [{ values: { mean: 500 } }] },
              ],
            },
          }),
        };
      }
      throw new Error(`Unexpected URL ${href}`);
    },
    today: () => '2026-06-13',
  });
  const res = makeResponse();

  await handler({ method: 'POST', body: { name: 'Richard', postcode: 'ng139hg' } }, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.ok, true);
  assert.equal(res.body.readout.greeting, 'Hi Richard.');
  assert.equal(res.body.readout.locationLine, undefined);
  assert.equal(res.body.readout.facts[1].value, 'Clay Heavy');
  assert.doesNotMatch(res.body.readout.facts[1].body, /soil model|launch read|Rushcliffe/i);
  assert.match(calls[0], /NG139HG/);
});

test('returns a local readout from postcode, weather and soil providers', async () => {
  const calls = [];
  const handler = createLocalReadoutHandler({
    fetchImpl: async (url) => {
      const href = String(url);
      calls.push(href);
      if (href.includes('api.postcodes.io')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            status: 200,
            result: {
              postcode: 'NG5 4JL',
              outcode: 'NG5',
              latitude: 52.984,
              longitude: -1.141,
              admin_district: 'Nottingham',
            },
          }),
        };
      }
      if (href.includes('api.open-meteo.com')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
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
          }),
        };
      }
      if (href.includes('rest.isric.org')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            properties: {
              layers: [
                { name: 'clay', unit_measure: { d_factor: 10 }, depths: [{ values: { mean: 280 } }] },
                { name: 'sand', unit_measure: { d_factor: 10 }, depths: [{ values: { mean: 330 } }] },
                { name: 'silt', unit_measure: { d_factor: 10 }, depths: [{ values: { mean: 390 } }] },
                { name: 'phh2o', unit_measure: { d_factor: 10 }, depths: [{ values: { mean: 64 } }] },
                { name: 'soc', unit_measure: { d_factor: 10 }, depths: [{ values: { mean: 420 } }] },
              ],
            },
          }),
        };
      }
      throw new Error(`Unexpected URL ${href}`);
    },
    today: () => '2026-06-13',
  });
  const res = makeResponse();

  await handler({ method: 'POST', body: { name: 'Sarah', postcode: 'NG5 4JL' } }, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.ok, true);
  assert.equal(res.body.readout.greeting, 'Hi Sarah.');
  assert.equal(res.body.readout.locationLine, undefined);
  assert.equal(res.body.readout.facts[0].value, '26 mm');
  assert.equal(res.body.readout.facts[1].value, 'Loamy');
  assert.equal(calls.length, 3);
});

test('uses Gardn launch-area soil fallback when SoilGrids has no urban data for Nottingham', async () => {
  const handler = createLocalReadoutHandler({
    fetchImpl: async (url) => {
      const href = String(url);
      if (href.includes('api.postcodes.io')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            status: 200,
            result: {
              postcode: 'NG1 1AA',
              outcode: 'NG1',
              latitude: 52.955073,
              longitude: -1.141027,
              admin_district: 'Nottingham',
            },
          }),
        };
      }
      if (href.includes('api.open-meteo.com')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            daily: {
              time: ['2026-06-12', '2026-06-13', '2026-06-14', '2026-06-15', '2026-06-16'],
              precipitation_sum: [12, 0, 1, 1, 0],
              temperature_2m_min: [12, 13, 13, 13, 13],
              temperature_2m_max: [18, 18, 18, 18, 18],
            },
          }),
        };
      }
      if (href.includes('rest.isric.org')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            properties: {
              layers: [
                { name: 'clay', unit_measure: { d_factor: 10 }, depths: [{ values: { mean: null } }] },
                { name: 'sand', unit_measure: { d_factor: 10 }, depths: [{ values: { mean: null } }] },
                { name: 'silt', unit_measure: { d_factor: 10 }, depths: [{ values: { mean: null } }] },
              ],
            },
          }),
        };
      }
      throw new Error(`Unexpected URL ${href}`);
    },
    today: () => '2026-06-13',
  });
  const res = makeResponse();

  await handler({ method: 'POST', body: { name: 'Alex', postcode: 'NG1 1AA' } }, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.ok, true);
  assert.equal(res.body.readout.locationLine, undefined);
  assert.equal(res.body.readout.facts[1].label, 'Soil');
  assert.equal(res.body.readout.facts[1].value, 'Clay Heavy');
  assert.doesNotMatch(res.body.readout.facts[1].body, /couldn't read/i);
  assert.doesNotMatch(res.body.readout.facts[1].body, /soil model|launch read|Nottingham/i);
  assert.match(res.body.readout.facts[1].body, /first clue/i);
});

test('uses a nearby public soil read when an urban postcode point has no texture data', async () => {
  let soilCalls = 0;
  const handler = createLocalReadoutHandler({
    fetchImpl: async (url) => {
      const href = String(url);
      if (href.includes('api.postcodes.io')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            status: 200,
            result: {
              postcode: 'NE1 5DL',
              outcode: 'NE1',
              latitude: 54.968856,
              longitude: -1.617163,
              admin_district: 'Newcastle upon Tyne',
            },
          }),
        };
      }
      if (href.includes('api.open-meteo.com')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            daily: {
              time: ['2026-06-12', '2026-06-13', '2026-06-14'],
              precipitation_sum: [2, 0, 1],
              temperature_2m_min: [10, 11, 12],
              temperature_2m_max: [17, 18, 19],
            },
          }),
        };
      }
      if (href.includes('rest.isric.org')) {
        soilCalls += 1;
        if (soilCalls === 1) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              properties: {
                layers: [
                  { name: 'clay', unit_measure: { d_factor: 10 }, depths: [{ values: { mean: null } }] },
                  { name: 'sand', unit_measure: { d_factor: 10 }, depths: [{ values: { mean: null } }] },
                  { name: 'silt', unit_measure: { d_factor: 10 }, depths: [{ values: { mean: null } }] },
                ],
              },
            }),
          };
        }
        return {
          ok: true,
          status: 200,
          json: async () => ({
            properties: {
              layers: [
                { name: 'clay', unit_measure: { d_factor: 10 }, depths: [{ values: { mean: 289 } }] },
                { name: 'sand', unit_measure: { d_factor: 10 }, depths: [{ values: { mean: 362 } }] },
                { name: 'silt', unit_measure: { d_factor: 10 }, depths: [{ values: { mean: 349 } }] },
                { name: 'phh2o', unit_measure: { d_factor: 10 }, depths: [{ values: { mean: 61 } }] },
                { name: 'soc', unit_measure: { d_factor: 10 }, depths: [{ values: { mean: 1236 } }] },
              ],
            },
          }),
        };
      }
      throw new Error(`Unexpected URL ${href}`);
    },
    today: () => '2026-06-13',
  });
  const res = makeResponse();

  await handler({ method: 'POST', body: { name: 'Alex', postcode: 'NE1 5DL' } }, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.ok, true);
  assert.equal(res.body.readout.locationLine, undefined);
  assert.equal(res.body.readout.facts[1].label, 'Soil');
  assert.equal(res.body.readout.facts[1].value, 'Loamy');
  assert.match(res.body.readout.facts[1].body, /nearby read/i);
  assert.doesNotMatch(res.body.readout.facts[1].body, /couldn't read/i);
  assert.ok(soilCalls > 1);
});
