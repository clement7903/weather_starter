import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import request from 'supertest';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { logger } from './logger.js';
import type { WeatherSnapshot } from './weather.js';

const weather: WeatherSnapshot = {
  condition: 'Cloudy',
  observed_at: '2026-05-04T00:00:00Z',
  source: 'test',
  area: 'Bishan',
  valid_period_text: 'Now',
  temperature_c: 29,
  humidity_percent: 80,
  rainfall_mm: 0,
  wind_speed_knots: 4,
  wind_direction_degrees: 180,
  forecast_low_c: 25,
  forecast_high_c: 32,
  uv_index: 7,
  psi_twenty_four_hourly: 42,
  pm25_one_hourly: 9,
  air_quality_region: 'central',
  forecast_periods: [{ label: 'Now', forecast: 'Cloudy' }],
  daily_forecast: [
    { date: '2026-05-04', forecast: 'Cloudy', temperature_low_c: 25, temperature_high_c: 32 },
  ],
};

describe('backend APIs', () => {
  let tempDir: string;
  let app: Awaited<ReturnType<typeof import('./server.js').createApp>>;
  let getCurrentWeather: ReturnType<typeof vi.fn>;

  beforeAll(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'weather-starter-server-test-'));
    process.env.DATABASE_PATH = join(tempDir, 'weather.db');
    process.env.LOG_LEVEL = 'silent';

    getCurrentWeather = vi.fn(async () => weather);

    const { createApp } = await import('./server.js');
    app = await createApp({
      serveFrontend: false,
      enableRequestLogging: false,
      weatherClient: {
        getCurrentWeather,
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  afterAll(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  it('returns health status', async () => {
    const response = await request(app).get('/health').expect(200);

    expect(response.body).toEqual({ status: 'healthy' });
  });

  it('accepts frontend logs and forwards them to the logger', async () => {
    const infoSpy = vi.spyOn(logger, 'info').mockImplementation(() => logger);

    await request(app)
      .post('/api/logs')
      .send({
        event: 'sidebar_opened',
        page: 'dashboard',
        metadata: { source: 'test' },
      })
      .expect(204);

    expect(infoSpy).toHaveBeenCalledWith(
      {
        source: 'frontend',
        event: 'sidebar_opened',
        metadata: { source: 'test' },
        page: 'dashboard',
      },
      'frontend interaction',
    );
  });

  it('rejects malformed frontend log events', async () => {
    const infoSpy = vi.spyOn(logger, 'info');

    const response = await request(app).post('/api/logs').send({ event: 'Bad' }).expect(422);

    expect(response.body).toEqual({ detail: 'event is required' });
    expect(infoSpy).not.toHaveBeenCalled();
  });

  it('refreshes a saved location on demand', async () => {
    const createResponse = await request(app)
      .post('/api/locations')
      .send({ latitude: 1.35, longitude: 103.85 })
      .expect(201);

    expect(createResponse.body.weather.condition).toBe('Cloudy');

    const refreshedWeather: WeatherSnapshot = {
      ...weather,
      condition: 'Passing showers',
      observed_at: '2026-05-04T01:00:00Z',
      temperature_c: 30,
      forecast_periods: [{ label: 'Now', forecast: 'Passing showers' }],
    };

    getCurrentWeather.mockResolvedValueOnce(refreshedWeather);

    const refreshResponse = await request(app)
      .post(`/api/locations/${createResponse.body.id}/refresh`)
      .expect(200);

    expect(refreshResponse.body.weather.condition).toBe('Passing showers');
    expect(refreshResponse.body.weather.temperature_c).toBe(30);
  });
});