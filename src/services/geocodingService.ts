import { GeocodedCity, LocationInfo, OpenMeteoRawGeocodingResponse } from '../types/weather';

const GEOCODING_API_BASE = 'https://geocoding-api.open-meteo.com/v1/search';

export interface SearchCityOptions {
  count?: number;
  language?: string;
  timeoutMs?: number;
}

/**
 * Formats a GeocodedCity into a human-readable display string.
 * Example: 'London, England, United Kingdom' or 'Tokyo, Japan'
 */
export function formatLocationName(city: GeocodedCity): string {
  const parts: string[] = [city.name];
  if (city.admin1 && city.admin1.toLowerCase() !== city.name.toLowerCase()) {
    parts.push(city.admin1);
  }
  if (city.country) {
    parts.push(city.country);
  }
  return parts.join(', ');
}

/**
 * Queries Open-Meteo Geocoding API to search for cities matching the name query.
 * Safely handles 0-match responses where 'results' property is absent.
 */
export async function searchCities(
  query: string,
  options: SearchCityOptions = {}
): Promise<GeocodedCity[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) {
    return [];
  }

  const { count = 5, language = 'en', timeoutMs = 7000 } = options;
  const clampedCount = Math.min(Math.max(count, 1), 100);

  const url = new URL(GEOCODING_API_BASE);
  url.searchParams.set('name', trimmed);
  url.searchParams.set('count', clampedCount.toString());
  url.searchParams.set('language', language);
  url.searchParams.set('format', 'json');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      signal: controller.signal
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.warn('Geocoding rate limit reached (HTTP 429).');
      }
      return [];
    }

    const data = (await response.json()) as OpenMeteoRawGeocodingResponse;
    // Open-Meteo returns { generationtime_ms: ... } with no results key when no match
    return data.results ?? [];
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.warn(`Geocoding search timed out after ${timeoutMs}ms.`);
    } else {
      console.warn('Geocoding search error:', error);
    }
    return [];
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Looks up coordinates for a city name, returning the top match as LocationInfo.
 */
export async function getCityCoordinates(cityName: string): Promise<LocationInfo | null> {
  const results = await searchCities(cityName, { count: 1 });
  if (!results.length) {
    return null;
  }

  const topMatch = results[0];
  return {
    name: topMatch.name,
    region: topMatch.admin1,
    country: topMatch.country,
    latitude: topMatch.latitude,
    longitude: topMatch.longitude,
    timezone: topMatch.timezone ?? 'auto'
  };
}
