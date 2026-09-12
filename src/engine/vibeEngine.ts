import { NormalizedForecastDay, VibeCheck } from '../types/weather';

export type WeatherMood = 'sunny' | 'rain' | 'snow' | 'heat' | 'storm' | 'mild_cloudy';

export interface VibeScoreResult {
  score: number;
  tier: string;
  emoji: string;
}

/**
 * Calculates a genuine 0-100 Vibe Score based on physiological comfort and meteorological friction.
 */
export function calculateVibeScore(day: NormalizedForecastDay): VibeScoreResult {
  let score = 70; // Baseline neutral score

  const temp = day.apparentTemperatureMax ?? day.temperatureMax;

  // Temperature comfort curve
  if (temp >= 19 && temp <= 24) {
    score += 25; // Goldilocks zone
  } else if (temp >= 15 && temp < 19) {
    score += 15; // Pleasant mild
  } else if (temp >= 25 && temp <= 29) {
    score += 15; // Warm summer
  } else if (temp >= 30 && temp <= 34) {
    score -= 15; // Uncomfortably hot
  } else if (temp > 34) {
    score -= 35; // Scorching heatwave
  } else if (temp >= 5 && temp < 15) {
    score += 5; // Crisp sweater weather
  } else if (temp >= 0 && temp < 5) {
    score -= 10; // Chilly damp
  } else {
    score -= 25; // Subzero freezing
  }

  // Precipitation penalties
  if (day.precipitationSum > 10 || (day.weatherCode >= 95 && day.weatherCode <= 99)) {
    score -= 40; // Downpour / thunderstorm
  } else if (
    day.precipitationSum > 3 ||
    [61, 63, 65, 71, 73, 75, 80, 81, 82, 85, 86].includes(day.weatherCode)
  ) {
    score -= 25; // Moderate rain / snowfall
  } else if (day.precipitationProbability > 60) {
    score -= 15; // High probability of dampness
  } else if (day.precipitationProbability > 30) {
    score -= 5;
  }

  // Sunshine bonus (WMO 0 = Clear sky, 1 = Mainly clear)
  if ([0, 1].includes(day.weatherCode)) {
    score += 10;
  }

  // Wind penalties
  if (day.windSpeedMax > 40) {
    score -= 20; // Gale force
  } else if (day.windSpeedMax > 28) {
    score -= 10; // High breeze
  }

  // Clamp strictly between 5 and 100
  const finalScore = Math.max(5, Math.min(100, Math.round(score)));

  let tier = 'Mid Vibe';
  let emoji = '🌤️';

  if (finalScore >= 90) {
    tier = '100% Immaculate';
    emoji = '✨';
  } else if (finalScore >= 75) {
    tier = 'Main Character Energy';
    emoji = '🌟';
  } else if (finalScore >= 60) {
    tier = 'Valid Outside';
    emoji = '🌤️';
  } else if (finalScore >= 40) {
    tier = 'Cozy / Mixed Bag';
    emoji = '☕';
  } else if (finalScore >= 20) {
    tier = 'Down Bad Weather';
    emoji = '🌧️';
  } else {
    tier = 'Certified Disaster';
    emoji = '💀';
  }

  return { score: finalScore, tier, emoji };
}

/**
 * Pure function: Evaluates the daily forecast and generates a punchy, relatable
 * Gen-Z Vibe Check containing headline, badge, aesthetic tagline, and mood color token.
 */
export function getVibeCheck(day: NormalizedForecastDay): VibeCheck {
  const temp = day.apparentTemperatureMax ?? day.temperatureMax;
  const { score, tier, emoji: scoreEmoji } = calculateVibeScore(day);

  const isThunderstorm = day.weatherCode >= 95 && day.weatherCode <= 99;
  const isSnow = [71, 73, 75, 77, 85, 86].includes(day.weatherCode) || (temp < 0 && day.precipitationSum > 0);
  const isFreezing = temp < 0;
  const isHeavyRain = (!isSnow && !isFreezing && day.precipitationSum > 8) || [63, 65, 81, 82].includes(day.weatherCode);
  const isRain = isHeavyRain || (!isSnow && !isFreezing && day.precipitationSum > 1) || [51, 53, 55, 61, 80].includes(day.weatherCode);
  const isHighWind = day.windSpeedMax > 35;
  const isScorching = temp > 32;

  let headline = '';
  let badge = '';
  let tagline = '';
  let mood: WeatherMood = 'mild_cloudy';
  let moodColor = '#D97706';
  let emojiBadge = scoreEmoji;

  // Priority 1: Hazardous / Extreme Conditions
  if (isThunderstorm || (isHeavyRain && isHighWind)) {
    headline = 'The sky is throwing a temper tantrum ⚡⛈️';
    badge = 'Storm Warning';
    tagline = 'Cinematic thunder and horizontal rain outside; do not fight the elements today bestie.';
    mood = 'storm';
    moodColor = '#8B5CF6';
    emojiBadge = '⚡';
  } else if (temp < 0 && (isSnow || day.windSpeedMax > 25)) {
    headline = 'Literally freezing blizzard no cap 🥶❄️';
    badge = 'Arctic Freeze';
    tagline = 'Certified Arctic morning, staying cocooned under three weighted blankets is the only acceptable move.';
    mood = 'snow';
    moodColor = '#06B6D4';
    emojiBadge = '🥶';
  } else if (temp < 0) {
    headline = 'Certified Arctic morning, pack the heat 🧊❄️';
    badge = 'Subzero Chill';
    tagline = 'Frost on every window pane, breath fogging instantly, heavy puffer armor strictly required.';
    mood = 'snow';
    moodColor = '#38BDF8';
    emojiBadge = '❄️';
  } else if (isScorching) {
    headline = 'Scorching heat stay hydrated bestie 🔥🥵';
    badge = 'Melting Core';
    tagline = 'Feral heatwave outside, literal sidewalk frying pan, iced beverages and AC worship mandatory.';
    mood = 'heat';
    moodColor = '#F43F5E';
    emojiBadge = '🔥';
  } else if (isHighWind && !isRain) {
    headline = 'Wind is personally disrespecting your haircut 💨😤';
    badge = 'Gale Warning';
    tagline = 'Gale-force gusts actively ruining hair aesthetics and turning standard umbrellas inside-out.';
    mood = 'storm';
    moodColor = '#0284C7';
    emojiBadge = '💨';
  }
  // Priority 2: Wet Elements
  else if (isHeavyRain) {
    headline = 'Moody rain lofi vibe no cap 🌧️🎧';
    badge = 'Downpour SZN';
    tagline = 'Waterproof footwear locked in, rainy lofi beats on repeat, jumping over urban puddles.';
    mood = 'rain';
    moodColor = '#6366F1';
    emojiBadge = '🌧️';
  } else if (isRain) {
    headline = 'Moody rain lofi vibe 🌧️☕';
    badge = 'Cozy Rain';
    tagline = 'Soft rain patter on the glass, warm oat latte steaming, prime introspective coffee shop energy.';
    mood = 'rain';
    moodColor = '#818CF8';
    emojiBadge = '☕';
  }
  // Priority 3: Pleasant / Temperate Conditions
  else if (temp >= 19 && temp <= 24 && [0, 1].includes(day.weatherCode)) {
    headline = 'Main character sunshine, outside is calling ☀️😎';
    badge = 'Sweater SZN'; // Compatible with preset expectations
    badge = 'Peak Vibes';
    tagline = 'Pure vitamin D boost, golden sunlight hitting just right, pristine dopamine weather.';
    mood = 'sunny';
    moodColor = '#F59E0B';
    emojiBadge = '✨';
  } else if (temp >= 25 && temp <= 32) {
    headline = 'Top tier summer warmth, iced matcha essential 🌴🧋';
    badge = 'Summer Glow';
    tagline = 'Iced drinks sweating instantly, warm sun on bare shoulders, immaculate summer energy.';
    mood = 'sunny';
    moodColor = '#FB923C';
    emojiBadge = '🌴';
  } else if (temp >= 11 && temp <= 17) {
    headline = 'Sweater weather is completely immaculate 🍂☕';
    badge = 'Sweater SZN';
    tagline = 'Crisp autumn breeze, crunching golden leaves, peak cozy knitwear season unlocked.';
    mood = 'mild_cloudy';
    moodColor = '#D97706';
    emojiBadge = '🍂';
  } else if (temp >= 0 && temp <= 10) {
    headline = 'Brisk chilly air, heavy layering required 🧣🌬️';
    badge = 'Chilly SZN';
    tagline = 'Rosy cheeks and cold noses, double-shot cappuccino in both hands to warm your fingers.';
    mood = 'mild_cloudy';
    moodColor = '#64748B';
    emojiBadge = '🧣';
  } else {
    headline = 'Cozy overcast aura, emotional playlist loaded ☁️🎧';
    badge = 'Indie Overcast';
    tagline = 'Soft diffused daylight, zero glare, perfect introspective afternoon stroll vibe.';
    mood = 'mild_cloudy';
    moodColor = '#94A3B8';
    emojiBadge = '☁️';
  }

  return {
    headline,
    badge,
    tagline,
    moodColor,
    score,
    emoji: emojiBadge,
    emojiBadge,
    tier,
    mood
  };
}
