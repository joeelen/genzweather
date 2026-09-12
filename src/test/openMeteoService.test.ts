import { describe, it, expect } from 'vitest';
import {
  getWmoInfo,
  formatDayOfWeek,
  transformOpenMeteoResponse,
  WMO_CODE_MAP
} from '../services/openMeteoService';
import { LocationInfo, OpenMeteoRawForecastResponse } from '../types/weather';

describe('Open-Meteo Weather Service & WMO Interpreter (M1)', () => {
  it('maps standard and extreme WMO codes accurately to Gen-Z descriptors', () => {
    // 0: Clear Sky
    expect(getWmoInfo(0).label).toBe('Clear Sky');
    expect(getWmoInfo(0).emoji).toBe('☀️');
    expect(getWmoInfo(0).category).toBe('clear');

    // 63: Moderate Rain
    expect(getWmoInfo(63).label).toBe('Moderate Rain');
    expect(getWmoInfo(63).category).toBe('rain');

    // 75: Heavy Snow
    expect(getWmoInfo(75).label).toBe('Heavy Snow');
    expect(getWmoInfo(75).category).toBe('heavy-snow');

    // 95: Thunderstorm
    expect(getWmoInfo(95).label).toBe('Thunderstorm');
    expect(getWmoInfo(95).category).toBe('thunderstorm');

    // Fallback on unknown code
    const unknown = getWmoInfo(999);
    expect(unknown.label).toBe('Mainly Clear');
    expect(unknown.category).toBe('clear');
  });

  it('contains comprehensive coverage of WMO codes', () => {
    const codes = Object.keys(WMO_CODE_MAP).map(Number);
    expect(codes.length).toBeGreaterThanOrEqual(28);
    expect(codes).toContain(0);
    expect(codes).toContain(1);
    expect(codes).toContain(2);
    expect(codes).toContain(3);
    expect(codes).toContain(45);
    expect(codes).toContain(51);
    expect(codes).toContain(61);
    expect(codes).toContain(65);
    expect(codes).toContain(71);
    expect(codes).toContain(75);
    expect(codes).toContain(80);
    expect(codes).toContain(82);
    expect(codes).toContain(95);
    expect(codes).toContain(99);
  });

  it('correctly calculates human-friendly day names', () => {
    expect(formatDayOfWeek('2026-09-11', 0)).toBe('Today');
    expect(formatDayOfWeek('2026-09-12', 1)).toBe('Tomorrow');
    // Day 2+ produces weekday string
    const result = formatDayOfWeek('2026-09-13', 2);
    expect(['Sun', 'Sunday', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']).toContain(result);
  });

  it('transforms raw Open-Meteo JSON into NormalizedForecastDay[]', () => {
    const mockRaw: OpenMeteoRawForecastResponse = {
      latitude: 40.71,
      longitude: -74.01,
      generationtime_ms: 0.5,
      utc_offset_seconds: -14400,
      timezone: 'America/New_York',
      timezone_abbreviation: 'EDT',
      elevation: 10,
      current: {
        time: '2026-09-11T12:00',
        temperature_2m: 23.5,
        relative_humidity_2m: 55,
        apparent_temperature: 23.0,
        is_day: 1,
        precipitation: 0.0,
        weather_code: 1,
        wind_speed_10m: 12.0
      },
      daily: {
        time: ['2026-09-11', '2026-09-12'],
        weather_code: [1, 63],
        temperature_2m_max: [24.0, 19.5],
        temperature_2m_min: [15.0, 14.0],
        apparent_temperature_max: [23.5, 18.5],
        apparent_temperature_min: [14.5, 13.5],
        precipitation_sum: [0.0, 8.5],
        precipitation_probability_max: [10, 85],
        wind_speed_10m_max: [13.0, 24.0],
        uv_index_max: [6.0, 2.0]
      }
    };

    const location: LocationInfo = {
      name: 'New York',
      region: 'New York',
      country: 'United States',
      latitude: 40.71,
      longitude: -74.01,
      timezone: 'America/New_York'
    };

    const dataset = transformOpenMeteoResponse(mockRaw, location);
    expect(dataset.isPreset).toBe(false);
    expect(dataset.location.name).toBe('New York');
    expect(dataset.current.temperature).toBe(23.5);
    expect(dataset.current.conditionLabel).toBe('Mainly Clear');
    expect(dataset.daily).toHaveLength(2);

    const day0 = dataset.daily[0];
    expect(day0.dayOfWeek).toBe('Today');
    expect(day0.temperatureMax).toBe(24.0);
    expect(day0.weatherCode).toBe(1);
    expect(day0.conditionCategory).toBe('clear');

    const day1 = dataset.daily[1];
    expect(day1.dayOfWeek).toBe('Tomorrow');
    expect(day1.temperatureMax).toBe(19.5);
    expect(day1.weatherCode).toBe(63);
    expect(day1.conditionCategory).toBe('rain');
    expect(day1.precipitationProbability).toBe(85);
  });

  it('defensively falls back to preset dataset when raw.daily.time is empty or invalid', () => {
    const emptyRaw = {
      latitude: 0,
      longitude: 0,
      daily: {
        time: []
      }
    } as unknown as OpenMeteoRawForecastResponse;

    const location: LocationInfo = {
      name: 'Test City',
      country: 'Test Country',
      latitude: 0,
      longitude: 0,
      timezone: 'UTC'
    };

    const dataset = transformOpenMeteoResponse(emptyRaw, location);
    expect(dataset.isPreset).toBe(true);
    expect(dataset.daily.length).toBeGreaterThanOrEqual(5);
    expect(dataset.location.name).toContain('Test City');
  });
});