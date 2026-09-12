import {
  CurrentConditions,
  LocationInfo,
  NormalizedForecastDay,
  OpenMeteoRawForecastResponse,
  WeatherDataset
} from '../types/weather';
import { DEFAULT_PRESET } from '../presets/presetData';

const OPEN_METEO_FORECAST_API = 'https://api.open-meteo.com/v1/forecast';

export interface WMOInfo {
  label: string;
  emoji: string;
  category: 'clear' | 'cloudy' | 'fog' | 'drizzle' | 'rain' | 'freezing-rain' | 'snow' | 'heavy-snow' | 'thunderstorm' | 'heavy-rain';
  genZDescriptor: string;
}

export const WMO_CODE_MAP: Record<number, WMOInfo> = {
  0: { label: 'Clear Sky', emoji: '☀️', category: 'clear', genZDescriptor: 'Clean Slate / Mainly Sunny' },
  1: { label: 'Mainly Clear', emoji: '🌤️', category: 'clear', genZDescriptor: 'Soft Glare / Mainly Clear' },
  2: { label: 'Partly Cloudy', emoji: '⛅', category: 'cloudy', genZDescriptor: 'Mid Skies / Partly Cloudy' },
  3: { label: 'Overcast', emoji: '☁️', category: 'cloudy', genZDescriptor: 'Lowkey Moody / Cloud Ceiling' },
  45: { label: 'Fog', emoji: '🌫️', category: 'fog', genZDescriptor: 'Mystical Fog / Silent Hill Vibes' },
  48: { label: 'Depositing Rime Fog', emoji: '🌫️❄️', category: 'fog', genZDescriptor: 'Frost Glaze / Cyberpunk Chill' },
  51: { label: 'Light Drizzle', emoji: '🌦️', category: 'drizzle', genZDescriptor: 'Mist Mode / Low Sizzle' },
  53: { label: 'Moderate Drizzle', emoji: '🌧️', category: 'drizzle', genZDescriptor: 'Drizzle Drama / Frizzy Hair Alert' },
  55: { label: 'Dense Drizzle', emoji: '🌧️', category: 'drizzle', genZDescriptor: 'Soaking Drizzle / Stay Inside SZN' },
  56: { label: 'Light Freezing Drizzle', emoji: '🌧️🧊', category: 'freezing-rain', genZDescriptor: 'Black Ice Hazard / Watch Your Step' },
  57: { label: 'Dense Freezing Drizzle', emoji: '🌧️🧊', category: 'freezing-rain', genZDescriptor: 'Glaze Ice Alert / Stay Indoors' },
  61: { label: 'Slight Rain', emoji: '🌧️', category: 'rain', genZDescriptor: 'Gentle Rain / Lo-Fi Playlist Day' },
  63: { label: 'Moderate Rain', emoji: '🌧️', category: 'rain', genZDescriptor: 'Rain on Glass / Main Character Energy' },
  65: { label: 'Heavy Rain', emoji: '🌧️🌊', category: 'heavy-rain', genZDescriptor: 'Total Downpour / Hydrated Chaos' },
  66: { label: 'Light Freezing Rain', emoji: '🌧️🧊', category: 'freezing-rain', genZDescriptor: 'Slushy Nightmare / Icy Slush' },
  67: { label: 'Heavy Freezing Rain', emoji: '🌧️⚡', category: 'freezing-rain', genZDescriptor: 'Ice Storm Status / Severe Chill' },
  71: { label: 'Slight Snow', emoji: '🌨️', category: 'snow', genZDescriptor: 'Snow Globe Aesthetic / Powder Dusting' },
  73: { label: 'Moderate Snow', emoji: '❄️', category: 'snow', genZDescriptor: 'Winter Wonderland / Cozy Core' },
  75: { label: 'Heavy Snow', emoji: '❄️💨', category: 'heavy-snow', genZDescriptor: 'Blizzard Lite / Puffer SZN' },
  77: { label: 'Snow Grains', emoji: '❄️', category: 'snow', genZDescriptor: 'Crunchy Chill / Snow Grains' },
  80: { label: 'Slight Showers', emoji: '🌦️', category: 'rain', genZDescriptor: 'Plot Twist Showers / Spotty Drip' },
  81: { label: 'Moderate Showers', emoji: '🌧️', category: 'rain', genZDescriptor: 'Sudden Splash / Fast Clouds' },
  82: { label: 'Violent Showers', emoji: '⛈️', category: 'heavy-rain', genZDescriptor: 'Monsoon Energy / Chaos Drip' },
  85: { label: 'Slight Snow Showers', emoji: '🌨️', category: 'snow', genZDescriptor: 'Flurry Frenzy / Winter Chic' },
  86: { label: 'Heavy Snow Showers', emoji: '❄️🌪️', category: 'heavy-snow', genZDescriptor: 'Whiteout Gusts / Arctic Expedition' },
  95: { label: 'Thunderstorm', emoji: '⛈️', category: 'thunderstorm', genZDescriptor: 'Dark Academia Thunder / Sky Drama' },
  96: { label: 'Thunderstorm with Slight Hail', emoji: '⛈️🧊', category: 'thunderstorm', genZDescriptor: 'Ice Pellet Havoc / Hail Chaos' },
  99: { label: 'Thunderstorm with Heavy Hail', emoji: '⛈️⚡', category: 'thunderstorm', genZDescriptor: 'Apocalyptic Rumble / Boss Level Storm' }
};

export const DEFAULT_WMO_INFO: WMOInfo = {
  label: 'Mainly Clear',
  emoji: '🌤️',
  category: 'clear',
  genZDescriptor: 'Chill Skies / Soft Daylight'
};

/**
 * Maps any WMO weather code (0-99) to label, emoji, category, and Gen-Z description.
 */
export function getWmoInfo(code: number): WMOInfo {
  return WMO_CODE_MAP[code] ?? DEFAULT_WMO_INFO;
}

export const mapWeatherCode = getWmoInfo;

/**
 * Calculates friendly day names ('Today', 'Tomorrow', 'Wed', etc.)
 */
export function formatDayOfWeek(isoDateStr: string, index: number): string {
  if (index === 0) return 'Today';
  if (index === 1) return 'Tomorrow';
  const parts = isoDateStr.split('-').map(Number);
  if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
    const date = new Date(parts[0], parts[1] - 1, parts[2]);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }
  return isoDateStr;
}

export interface FetchWeatherOptions {
  timeoutMs?: number;
  useFallbackOnFailure?: boolean;
}

/**
 * Fetches 7-day weather forecast from Open-Meteo API, normalizes the response,
 * and falls back gracefully to preset data if network or API limits fail.
 */
export async function fetchWeatherForecast(
  location: LocationInfo,
  options: FetchWeatherOptions = {}
): Promise<WeatherDataset> {
  const { timeoutMs = 8000, useFallbackOnFailure = true } = options;

  const url = new URL(OPEN_METEO_FORECAST_API);
  url.searchParams.set('latitude', location.latitude.toFixed(4));
  url.searchParams.set('longitude', location.longitude.toFixed(4));
  url.searchParams.set(
    'daily',
    'weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,uv_index_max'
  );
  url.searchParams.set(
    'current',
    'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m'
  );
  url.searchParams.set('timezone', location.timezone || 'auto');
  url.searchParams.set('forecast_days', '7');

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
      throw new Error(`Open-Meteo returned status ${response.status}: ${response.statusText}`);
    }

    const data = (await response.json()) as OpenMeteoRawForecastResponse;
    return transformOpenMeteoResponse(data, location);
  } catch (error: unknown) {
    console.warn('Weather forecast fetch error:', error);
    if (useFallbackOnFailure) {
      console.info('Using default scenario preset fallback.');
      return {
        ...DEFAULT_PRESET.dataset,
        location: {
          ...DEFAULT_PRESET.dataset.location,
          name: `${location.name} (Offline Vibe)`
        }
      };
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Transforms raw Open-Meteo API response into strict NormalizedForecastDay[]
 * and CurrentConditions adhering to interface contracts.
 */
export function transformOpenMeteoResponse(
  raw: OpenMeteoRawForecastResponse,
  location: LocationInfo
): WeatherDataset {
  const dailyData = raw?.daily;
  const timeArray = dailyData?.time ?? [];

  if (!timeArray || timeArray.length === 0) {
    console.warn('Open-Meteo returned empty or invalid daily forecast data, falling back to preset.');
    return {
      ...DEFAULT_PRESET.dataset,
      location: {
        ...location,
        name: `${location.name} (Offline Fallback)`
      }
    };
  }

  const daily: NormalizedForecastDay[] = timeArray.map((dateStr, index) => {
    const weatherCode = dailyData?.weather_code?.[index] ?? 0;
    const wmo = getWmoInfo(weatherCode);

    const tempMax = dailyData?.temperature_2m_max?.[index] ?? 20;
    const tempMin = dailyData?.temperature_2m_min?.[index] ?? 12;
    const apparentMax = dailyData?.apparent_temperature_max?.[index] ?? tempMax;
    const apparentMin = dailyData?.apparent_temperature_min?.[index] ?? tempMin;
    const precipSum = dailyData?.precipitation_sum?.[index] ?? 0;
    const precipProb = dailyData?.precipitation_probability_max?.[index] ?? 0;
    const windMax = dailyData?.wind_speed_10m_max?.[index] ?? 10;
    const uvMax = dailyData?.uv_index_max?.[index] ?? 4;

    const dayName = formatDayOfWeek(dateStr, index);

    return {
      date: dateStr,
      dayOfWeek: dayName,
      dayName,
      temperatureMax: tempMax,
      tempMax,
      temperatureMin: tempMin,
      tempMin,
      apparentTemperatureMax: apparentMax,
      apparentTempMax: apparentMax,
      apparentTemperatureMin: apparentMin,
      apparentTempMin: apparentMin,
      precipitationSum: precipSum,
      precipitationProbability: precipProb,
      precipitationProbabilityMax: precipProb,
      windSpeedMax: windMax,
      uvIndexMax: uvMax,
      weatherCode,
      conditionCategory: wmo.category,
      conditionLabel: wmo.label,
      conditionEmoji: wmo.emoji,
      emoji: wmo.emoji,
      isDay: true
    };
  });

  const rawCurrent = raw.current;
  const currentWeatherCode = rawCurrent?.weather_code ?? (daily[0]?.weatherCode ?? 0);
  const currentWmo = getWmoInfo(currentWeatherCode);

  const current: CurrentConditions = {
    temperature: rawCurrent?.temperature_2m ?? (daily[0]?.temperatureMax ?? 20),
    apparentTemperature: rawCurrent?.apparent_temperature ?? (daily[0]?.apparentTemperatureMax ?? 20),
    weatherCode: currentWeatherCode,
    conditionLabel: currentWmo.label,
    conditionEmoji: currentWmo.emoji,
    emoji: currentWmo.emoji,
    relativeHumidity: rawCurrent?.relative_humidity_2m ?? 50,
    windSpeed: rawCurrent?.wind_speed_10m ?? (daily[0]?.windSpeedMax ?? 10),
    isDay: rawCurrent ? rawCurrent.is_day === 1 : true,
    precipitation: rawCurrent?.precipitation ?? 0
  };

  return {
    isPreset: false,
    lastUpdated: new Date().toISOString(),
    location,
    current,
    daily
  };
}
