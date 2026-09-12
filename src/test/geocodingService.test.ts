import { describe, it, expect, vi, beforeEach } from 'vitest';
import { formatLocationName, searchCities } from '../services/geocodingService';
import { GeocodedCity } from '../types/weather';

describe('Geocoding Service & Location Resolver (M1)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('formats location names cleanly avoiding duplicates', () => {
    const city1: GeocodedCity = {
      id: 1,
      name: 'London',
      admin1: 'England',
      country: 'United Kingdom',
      latitude: 51.5,
      longitude: -0.12
    };
    expect(formatLocationName(city1)).toBe('London, England, United Kingdom');

    // Case where admin1 equals city name (e.g. New York, New York)
    const city2: GeocodedCity = {
      id: 2,
      name: 'New York',
      admin1: 'New York',
      country: 'United States',
      latitude: 40.71,
      longitude: -74.0
    };
    expect(formatLocationName(city2)).toBe('New York, United States');

    // Case with no admin1
    const city3: GeocodedCity = {
      id: 3,
      name: 'Singapore',
      country: 'Singapore',
      latitude: 1.35,
      longitude: 103.8
    };
    expect(formatLocationName(city3)).toBe('Singapore, Singapore');
  });

  it('safely handles empty queries without triggering network fetch', async () => {
    const spy = vi.spyOn(globalThis, 'fetch');
    const emptyResult = await searchCities('');
    expect(emptyResult).toEqual([]);
    expect(spy).not.toHaveBeenCalled();

    const shortResult = await searchCities('a');
    expect(shortResult).toEqual([]);
    expect(spy).not.toHaveBeenCalled();
  });

  it('handles 0-match responses where results key is absent', async () => {
    // Open-Meteo returns { generationtime_ms: 0.71 } when no results match
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ generationtime_ms: 0.7170439 })
    } as Response);

    const results = await searchCities('NonExistentCityXYZ123');
    expect(results).toEqual([]);
  });

  it('handles HTTP 429 rate limits gracefully', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 429,
      statusText: 'Too Many Requests'
    } as Response);

    const results = await searchCities('Tokyo');
    expect(results).toEqual([]);
  });
});