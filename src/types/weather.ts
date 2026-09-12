/**
 * Gen-Z Weather Type Definitions & Interface Contracts
 */

export type TemperatureUnit = 'celsius' | 'fahrenheit';

/**
 * Geographical identification for a forecast target.
 */
export interface LocationInfo {
  name: string;             // e.g., 'New York', 'Tokyo', 'Woodstock'
  region?: string;          // e.g., 'New York', 'Vermont', 'England' (admin1)
  country: string;          // e.g., 'United States', 'Japan'
  latitude: number;
  longitude: number;
  timezone: string;         // e.g., 'America/New_York'
}

/**
 * Open-Meteo Geocoding Result item.
 */
export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  admin1_id?: number;
  admin2_id?: number;
  timezone?: string;
  population?: number;
  country_id?: number;
  country: string;
  admin1?: string;
  admin2?: string;
}

/**
 * Alias for GeocodingResult for consistency across reports.
 */
export type GeocodedCity = GeocodingResult;

/**
 * Curated Gen-Z 'Vibe Check' presentation.
 */
export interface VibeCheck {
  headline: string;         // Punchy, relatable Gen-Z headline
  badge: string;            // Short tag e.g. 'Sweater SZN', 'Melting Core'
  tagline: string;          // 1-2 sentence aesthetic summary
  moodColor: string;        // Hex or Tailwind color token (e.g. #FEF08A, #A855F7)
  score?: number;           // 0 - 100 vibe score
  emoji?: string;
  emojiBadge?: string;
  tier?: string;
  mood?: string;
}

/**
 * Clothing layers specification for OOTD recommendation.
 */
export interface OOTDLayers {
  outerwear?: string;       // e.g. 'Vintage Trench' or 'Down Puffer'
  top: string;              // e.g. 'Fleece-lined crewneck'
  bottom: string;           // e.g. 'Baggy vintage denim'
  footwear: string;         // e.g. 'Adidas Sambas' or 'Waterproof Chelsea boots'
  accessories: string[];    // e.g. ['Canvas tote', 'Tortoise sunglasses', 'Lip balm']
}

/**
 * Contextual Outfit of the Day ('OOTD') recommendation.
 */
export interface OOTDRecommendation {
  summary: string;          // Core outfit theme e.g. 'Oversized chunky knit + wide-leg denim'
  layers: OOTDLayers;
  tip: string;              // Crucial practical styling or weather tip
  aesthetic?: string;       // e.g. 'Cozy Cabincore', 'Gorpcore'

  // Compatibility and flat properties
  outerwear?: string;
  top?: string;
  bottom?: string;
  footwear?: string;
  accessories?: string[];
  aestheticVibe?: string;
  colorPalette?: string[];
  avoidList?: string[];
  proTip?: string;
}

/**
 * Curated single activity metadata.
 */
export interface ActivityItem {
  id: string;
  name: string;
  category: 'indoor' | 'outdoor' | 'hybrid';
  energy: 'chill' | 'moderate' | 'high';
  social: 'solo' | 'besties' | 'date';
  description: string;
  emoji: string;
  tag: string;
}

/**
 * Curated indoor/outdoor activity suggestions tailored to conditions.
 */
export interface ActivitySuggestions {
  primary: string;          // Main event: 'Thrifting & aesthetic matcha run'
  secondary: string;        // Alternative: 'Acoustic album park stroll'
  isIndoorPreferred: boolean;
  idealTimeOfDay: string;   // e.g. 'Afternoon 2-5 PM', 'Golden Hour', 'All Day'
  tertiary?: string;
  activities?: ActivityItem[];
  items?: ActivityItem[];
}

/**
 * Normalized daily forecast day contract.
 * Conforms 100% to PROJECT.md § Interface Contracts with cross-spec alias properties.
 */
export interface NormalizedForecastDay {
  date: string;                     // ISO format 'YYYY-MM-DD'
  dayOfWeek: string;                // 'Today', 'Tomorrow', 'Wed', 'Thu', etc.
  temperatureMax: number;           // Celsius max
  temperatureMin: number;           // Celsius min
  apparentTemperatureMax: number;   // Feels-like max (°C)
  apparentTemperatureMin?: number;  // Feels-like min (°C)
  precipitationSum: number;         // Total precipitation in mm
  precipitationProbability: number; // Probability percentage (0-100)
  windSpeedMax: number;             // km/h
  uvIndexMax: number;               // UV Index (0-12+)
  weatherCode: number;              // WMO code (0-99)
  conditionCategory: string;        // e.g. 'clear', 'cloudy', 'rain', 'snow', 'thunderstorm', 'fog', 'drizzle'
  conditionLabel: string;           // e.g. 'Mainly Clear', 'Partly Cloudy'
  conditionEmoji: string;           // Contextual emoji e.g. '🌤️', '⛈️'

  // Compatibility aliases
  dayName?: string;
  tempMax?: number;
  tempMin?: number;
  apparentTempMax?: number;
  apparentTempMin?: number;
  precipitationProbabilityMax?: number;
  emoji?: string;
  isDay?: boolean;

  // Attached recommendation layer
  vibeCheck?: VibeCheck;
  ootd?: OOTDRecommendation;
  activities?: ActivitySuggestions;
}

/**
 * Alias for NormalizedForecastDay for full spec compatibility.
 */
export type DailyForecastDay = NormalizedForecastDay;

/**
 * Current conditions snapshot.
 */
export interface CurrentConditions {
  temperature: number;             // °C
  apparentTemperature: number;     // °C
  weatherCode: number;
  conditionLabel: string;
  conditionEmoji: string;
  emoji?: string;                  // alias
  relativeHumidity: number;        // %
  windSpeed: number;               // km/h
  isDay: boolean;
  precipitation: number;           // mm
}

/**
 * Top-level container representing an active weather forecast dataset.
 */
export interface WeatherDataset {
  isPreset: boolean;
  presetId?: string;
  lastUpdated: string;              // ISO string
  location: LocationInfo;
  current: CurrentConditions;
  daily: NormalizedForecastDay[];   // 5 to 7 day sequence
}

/**
 * Preset Scenario metadata and payload definition.
 */
export interface PresetScenario {
  id: string;                       // e.g. 'sweater-weather'
  name: string;                     // e.g. 'Crisp Autumn Sweater Weather'
  description: string;              // 'Chilly breezes, falling leaves, hot apple cider vibes'
  icon: string;                     // Preset thumbnail icon/emoji '🍂'
  themeClass: string;               // Theme color gradient styling identifier
  dataset: WeatherDataset;
}

/**
 * Raw response structure from Open-Meteo Weather Forecast API.
 */
export interface OpenMeteoRawForecastResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units?: Record<string, string>;
  current?: {
    time: string;
    interval?: number;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    is_day: number;
    precipitation: number;
    weather_code: number;
    wind_speed_10m: number;
  };
  daily_units?: Record<string, string>;
  daily?: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    apparent_temperature_max: number[];
    apparent_temperature_min?: number[];
    precipitation_sum: number[];
    precipitation_probability_max?: number[];
    wind_speed_10m_max: number[];
    uv_index_max?: number[];
  };
}

/**
 * Raw response structure from Open-Meteo Geocoding Search API.
 */
export interface OpenMeteoRawGeocodingResponse {
  results?: GeocodingResult[];
  generationtime_ms?: number;
}
