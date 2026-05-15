import { afterEach, describe, expect, it, vi } from 'vitest';
import { SingaporeWeatherClient } from './weather.js';

function jsonResponse(body: unknown, ok = true, status = 200) {
  return {
    ok,
    status,
    json: async () => body,
  } as Response;
}

describe('SingaporeWeatherClient', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('merges two-hour forecast with air quality readings', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);
        if (url.includes('/two-hr-forecast')) {
          return jsonResponse({
            code: 0,
            data: {
              area_metadata: [
                {
                  name: 'Bishan',
                  label_location: { latitude: 1.35, longitude: 103.82 },
                },
              ],
              items: [
                {
                  update_timestamp: '2026-05-15T10:00:00Z',
                  valid_period: { text: '10 am to 12 pm' },
                  forecasts: [{ area: 'Bishan', forecast: 'Cloudy' }],
                },
              ],
            },
          });
        }

        if (url.includes('/psi')) {
          return jsonResponse({
            code: 0,
            data: {
              regionMetadata: [
                {
                  name: 'central',
                  labelLocation: { latitude: 1.35, longitude: 103.82 },
                },
              ],
              items: [
                {
                  updatedTimestamp: '2026-05-15T10:05:00Z',
                  readings: {
                    psi_twenty_four_hourly: {
                      central: 42,
                    },
                  },
                },
              ],
            },
          });
        }

        if (url.includes('/pm25')) {
          return jsonResponse({
            code: 0,
            data: {
              regionMetadata: [
                {
                  name: 'central',
                  labelLocation: { latitude: 1.35, longitude: 103.82 },
                },
              ],
              items: [
                {
                  updatedTimestamp: '2026-05-15T10:06:00Z',
                  readings: {
                    pm25_one_hourly: {
                      central: 9,
                    },
                  },
                },
              ],
            },
          });
        }

        if (url.includes('/air-temperature')) {
          return jsonResponse({
            code: 0,
            data: {
              stations: [
                {
                  id: 'S1',
                  location: { latitude: 1.35, longitude: 103.82 },
                },
              ],
              readings: [
                {
                  timestamp: '2026-05-15T10:07:00Z',
                  data: [{ stationId: 'S1', value: 29.4 }],
                },
              ],
            },
          });
        }

        if (url.includes('/relative-humidity')) {
          return jsonResponse({
            code: 0,
            data: {
              stations: [
                {
                  id: 'S1',
                  location: { latitude: 1.35, longitude: 103.82 },
                },
              ],
              readings: [
                {
                  timestamp: '2026-05-15T10:08:00Z',
                  data: [{ stationId: 'S1', value: 81 }],
                },
              ],
            },
          });
        }

        if (url.includes('/rainfall')) {
          return jsonResponse({
            code: 0,
            data: {
              stations: [
                {
                  id: 'S1',
                  location: { latitude: 1.35, longitude: 103.82 },
                },
              ],
              readings: [
                {
                  timestamp: '2026-05-15T10:04:00Z',
                  data: [{ stationId: 'S1', value: 0.6 }],
                },
              ],
            },
          });
        }

        if (url.includes('/wind-speed')) {
          return jsonResponse({
            code: 0,
            data: {
              stations: [
                {
                  id: 'S1',
                  location: { latitude: 1.35, longitude: 103.82 },
                },
              ],
              readings: [
                {
                  timestamp: '2026-05-15T10:03:00Z',
                  data: [{ stationId: 'S1', value: 4.5 }],
                },
              ],
            },
          });
        }

        if (url.includes('/wind-direction')) {
          return jsonResponse({
            code: 0,
            data: {
              stations: [
                {
                  id: 'S1',
                  location: { latitude: 1.35, longitude: 103.82 },
                },
              ],
              readings: [
                {
                  timestamp: '2026-05-15T10:02:00Z',
                  data: [{ stationId: 'S1', value: 180 }],
                },
              ],
            },
          });
        }

        if (url.includes('/uv')) {
          return jsonResponse({
            code: 0,
            data: {
              records: [
                {
                  updatedTimestamp: '2026-05-15T10:09:00Z',
                  index: [{ hour: '2026-05-15T10:00:00Z', value: 7 }],
                },
              ],
            },
          });
        }

        if (url.includes('/twenty-four-hr-forecast')) {
          return jsonResponse({
            code: 0,
            data: {
              records: [
                {
                  updatedTimestamp: '2026-05-15T10:10:00Z',
                  general: {
                    temperature: {
                      low: 26,
                      high: 32,
                    },
                  },
                  periods: [
                    {
                      timePeriod: { text: 'Now' },
                      regions: { central: { text: 'Cloudy' } },
                    },
                    {
                      timePeriod: { text: '1 pm to 4 pm' },
                      regions: { central: { text: 'Passing showers' } },
                    },
                  ],
                },
              ],
            },
          });
        }

        if (url.includes('/4-day-weather-forecast')) {
          return jsonResponse({
            items: [
              {
                update_timestamp: '2026-05-15T10:11:00Z',
                forecasts: [
                  {
                    date: '2026-05-15',
                    forecast: 'Cloudy',
                    temperature: { low: 25, high: 32 },
                  },
                  {
                    date: '2026-05-16',
                    forecast: 'Thundery showers',
                    temperature: { low: 24, high: 31 },
                  },
                ],
              },
            ],
          });
        }

        throw new Error(`Unexpected url: ${url}`);
      }),
    );

    const client = new SingaporeWeatherClient();
    const snapshot = await client.getCurrentWeather(1.35, 103.82);

    expect(snapshot).toMatchObject({
      condition: 'Cloudy',
      area: 'Bishan',
      valid_period_text: '10 am to 12 pm',
      temperature_c: 29.4,
      humidity_percent: 81,
      rainfall_mm: 0.6,
      wind_speed_knots: 4.5,
      wind_direction_degrees: 180,
      uv_index: 7,
      forecast_low_c: 26,
      forecast_high_c: 32,
      psi_twenty_four_hourly: 42,
      pm25_one_hourly: 9,
      air_quality_region: 'central',
      forecast_periods: [
        { label: 'Now', forecast: 'Cloudy' },
        { label: '1 pm to 4 pm', forecast: 'Passing showers' },
      ],
      daily_forecast: [
        {
          date: '2026-05-15',
          forecast: 'Cloudy',
          temperature_low_c: 25,
          temperature_high_c: 32,
        },
        {
          date: '2026-05-16',
          forecast: 'Thundery showers',
          temperature_low_c: 24,
          temperature_high_c: 31,
        },
      ],
    });
    expect(snapshot.observed_at).toBe('2026-05-15T10:11:00Z');
  });

  it('keeps the forecast snapshot when air quality is unavailable', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);
        if (url.includes('/two-hr-forecast')) {
          return jsonResponse({
            code: 0,
            data: {
              area_metadata: [
                {
                  name: 'Bishan',
                  label_location: { latitude: 1.35, longitude: 103.82 },
                },
              ],
              items: [
                {
                  update_timestamp: '2026-05-15T10:00:00Z',
                  valid_period: { text: '10 am to 12 pm' },
                  forecasts: [{ area: 'Bishan', forecast: 'Cloudy' }],
                },
              ],
            },
          });
        }

        if (
          url.includes('/psi') ||
          url.includes('/pm25') ||
          url.includes('/air-temperature') ||
          url.includes('/relative-humidity') ||
          url.includes('/rainfall') ||
          url.includes('/wind-speed') ||
          url.includes('/wind-direction') ||
          url.includes('/uv') ||
          url.includes('/twenty-four-hr-forecast') ||
          url.includes('/4-day-weather-forecast')
        ) {
          return jsonResponse({ message: 'failed' }, false, 500);
        }

        throw new Error(`Unexpected url: ${url}`);
      }),
    );

    const client = new SingaporeWeatherClient();
    const snapshot = await client.getCurrentWeather(1.35, 103.82);

    expect(snapshot).toMatchObject({
      condition: 'Cloudy',
      area: 'Bishan',
      valid_period_text: '10 am to 12 pm',
      temperature_c: null,
      humidity_percent: null,
      rainfall_mm: null,
      wind_speed_knots: null,
      wind_direction_degrees: null,
      uv_index: null,
      forecast_low_c: null,
      forecast_high_c: null,
      psi_twenty_four_hourly: null,
      pm25_one_hourly: null,
      air_quality_region: null,
      forecast_periods: [],
      daily_forecast: [],
    });
    expect(snapshot.observed_at).toBe('2026-05-15T10:00:00Z');
  });
});
