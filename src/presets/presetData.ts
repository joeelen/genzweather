import { PresetScenario } from '../types/weather';
import { AUTUMN_SWEATER_WEATHER } from './autumn';
import { SCORCHING_HEATWAVE } from './heatwave';
import { GLOOMY_RAINY_DAY } from './rain';
import { SUBZERO_BLIZZARD } from './blizzard';
import { GOLDEN_HOUR_SPRING } from './spring';
import { CHAOTIC_SUMMER_THUNDERSTORM } from './thunderstorm';

export {
  AUTUMN_SWEATER_WEATHER,
  SCORCHING_HEATWAVE,
  GLOOMY_RAINY_DAY,
  SUBZERO_BLIZZARD,
  GOLDEN_HOUR_SPRING,
  CHAOTIC_SUMMER_THUNDERSTORM
};

/**
 * Complete list of 4 required + 2 bonus presets.
 */
export const PRESET_SCENARIOS: PresetScenario[] = [
  AUTUMN_SWEATER_WEATHER,
  SCORCHING_HEATWAVE,
  GLOOMY_RAINY_DAY,
  SUBZERO_BLIZZARD,
  GOLDEN_HOUR_SPRING,
  CHAOTIC_SUMMER_THUNDERSTORM
];

/**
 * Default fallback scenario: Crisp Autumn Sweater Weather
 */
export const DEFAULT_PRESET: PresetScenario = AUTUMN_SWEATER_WEATHER;

/**
 * Lookup preset by id, handling aliases safely.
 */
export function getPresetById(presetId: string): PresetScenario | undefined {
  const normalized = presetId.toLowerCase().trim();
  return PRESET_SCENARIOS.find(p => {
    if (p.id === normalized) return true;
    if (normalized === 'spring-breeze' && p.id === 'golden-hour-spring') return true;
    if (normalized === 'golden-hour-spring' && p.id === 'golden-hour-spring') return true;
    if (normalized === 'chaotic-thunderstorm' && p.id === 'summer-thunderstorm') return true;
    if (normalized === 'summer-thunderstorm' && p.id === 'summer-thunderstorm') return true;
    return false;
  });
}
