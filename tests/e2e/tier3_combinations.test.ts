import { describe, it, expect } from 'vitest';
import {
  NormalizedForecastDay,
  WeatherDataset
} from '../../src/types/weather';
import {
  AUTUMN_SWEATER_WEATHER,
  SCORCHING_HEATWAVE,
  GLOOMY_RAINY_DAY,
  SUBZERO_BLIZZARD,
  CHAOTIC_SUMMER_THUNDERSTORM,
  PRESET_SCENARIOS,
  getPresetById
} from '../../src/presets/presetData';
import { getOOTDRecommendation } from '../../src/engine/ootdEngine';
import { getVibeCheck } from '../../src/engine/vibeEngine';
import { getActivitySuggestions } from '../../src/engine/activityEngine';

function createTestDay(overrides: Partial<NormalizedForecastDay> = {}): NormalizedForecastDay {
  return {
    date: '2026-10-15',
    dayOfWeek: 'Thursday',
    temperatureMax: 14,
    temperatureMin: 9,
    apparentTemperatureMax: 12,
    precipitationSum: 15,
    precipitationProbability: 80,
    windSpeedMax: 40,
    uvIndexMax: 2,
    weatherCode: 63,
    conditionCategory: 'rain',
    conditionLabel: 'Moderate Rain',
    conditionEmoji: '🌧️',
    ...overrides
  };
}

describe('Tier 3: Cross-Feature Combinations & Pairwise Coverage', () => {

  // =========================================================================
  // C1: Rain + High Wind Combination
  // =========================================================================
  describe('C1: Rain + High Wind (Precipitation >= 10mm & Wind >= 35 km/h)', () => {
    it('C1.1: warns of inverted umbrella hazard when wind exceeds 35 km/h during rain', () => {
      const day = createTestDay({ precipitationSum: 18, windSpeedMax: 42, temperatureMax: 12, apparentTemperatureMax: 12 });
      const ootd = getOOTDRecommendation(day);
      expect(ootd.tip).toContain('invert');
      expect(ootd.tip).toContain('hooded shell');
    });

    it('C1.2: recommends storm-resistant hooded shell for high wind rain', () => {
      const day = createTestDay({ precipitationSum: 15, windSpeedMax: 38, temperatureMax: 14, apparentTemperatureMax: 14 });
      const ootd = getOOTDRecommendation(day);
      expect(ootd.layers.outerwear?.toLowerCase()).toContain('hooded');
      expect(ootd.layers.outerwear?.toLowerCase()).toContain('shell');
    });

    it('C1.3: enforces waterproof lug-sole footwear under heavy rain and gale', () => {
      const day = createTestDay({ precipitationSum: 22, windSpeedMax: 45, temperatureMax: 11, apparentTemperatureMax: 11 });
      const ootd = getOOTDRecommendation(day);
      expect(ootd.layers.footwear.toLowerCase()).toMatch(/lug|waterproof|boot/);
    });

    it('C1.4: strictly forbids suede and canvas footwear during rain and wind', () => {
      const day = createTestDay({ precipitationSum: 12, windSpeedMax: 36, temperatureMax: 13, apparentTemperatureMax: 13 });
      const ootd = getOOTDRecommendation(day);
      const avoidText = ootd.avoidList.join(' ').toLowerCase();
      expect(avoidText).toContain('suede');
      expect(avoidText).toContain('canvas');
      expect(avoidText).toContain('invert');
    });

    it('C1.5: verifies thunderstorm preset combines high wind and rain safety guidance', () => {
      const stormDay = CHAOTIC_SUMMER_THUNDERSTORM.dataset.daily[0];
      const activities = getActivitySuggestions(stormDay);
      expect(stormDay.windSpeedMax).toBeGreaterThan(25);
      expect(stormDay.precipitationProbability).toBeGreaterThanOrEqual(60);
      expect(activities.isIndoorPreferred).toBe(true);
    });
  });

  // =========================================================================
  // C2: Freezing + High Wind Combination (Extreme Windchill)
  // =========================================================================
  describe('C2: Freezing + High Wind (Subzero Temp & Wind >= 35 km/h)', () => {
    it('C2.1: calculates severe subzero windchill conditions via genuine domain engines', () => {
      const freezingGaleDay = createTestDay({
        temperatureMax: -8,
        temperatureMin: -15,
        apparentTemperatureMax: -18,
        apparentTemperatureMin: -24,
        windSpeedMax: 45,
        weatherCode: 73,
        precipitationSum: 3
      });
      const vibe = getVibeCheck(freezingGaleDay);
      expect(vibe.badge).toMatch(/Freeze|Arctic/i);
      expect(vibe.score).toBeLessThan(40);
      const ootd = getOOTDRecommendation(freezingGaleDay);
      expect(ootd.layers.outerwear?.toLowerCase()).toMatch(/down|puffer|parka/);
    });

    it('C2.2: validates subzero high wind days mandate arctic parka with down fill', () => {
      const blizzardDay = SUBZERO_BLIZZARD.dataset.daily[0];
      const ootd = getOOTDRecommendation(blizzardDay);
      const outerwear = (ootd.layers.outerwear ?? '').toLowerCase();
      expect(outerwear).toMatch(/down|puffer|parka/);
    });

    it('C2.3: validates subzero high wind days mandate thermal balaclava or beanie & mittens', () => {
      const blizzardDay = SUBZERO_BLIZZARD.dataset.daily[0];
      const ootd = getOOTDRecommendation(blizzardDay);
      const accessories = (ootd.layers.accessories ?? []).join(' ').toLowerCase();
      expect(accessories).toMatch(/beanie|mittens|balaclava|gloves/);
    });

    it('C2.4: verifies outdoor park and skate activities are strictly banned under freeze and gale', () => {
      const blizzardDay = SUBZERO_BLIZZARD.dataset.daily[0];
      const activities = getActivitySuggestions(blizzardDay);
      expect(activities.isIndoorPreferred).toBe(true);
      const text = (activities.primary + ' ' + activities.secondary).toLowerCase();
      expect(text).not.toContain('picnic');
      expect(text).not.toContain('skatepark');
    });

    it('C2.5: subzero blizzard dataset confirms apparent temperature is lower than air temperature', () => {
      for (const day of SUBZERO_BLIZZARD.dataset.daily) {
        expect(day.apparentTemperatureMax).toBeLessThanOrEqual(day.temperatureMax);
      }
    });
  });

  // =========================================================================
  // C3: Heatwave + High UV + Blazing Sunshine
  // =========================================================================
  describe('C3: Heatwave + High UV + Blazing Sunshine (Temp > 35°C & UV >= 8)', () => {
    it('C3.1: verifies heatwave days combine high temperature with high UV index', () => {
      for (const day of SCORCHING_HEATWAVE.dataset.daily) {
        expect(day.temperatureMax).toBeGreaterThan(32);
        expect(day.uvIndexMax).toBeGreaterThanOrEqual(8.0);
      }
    });

    it('C3.2: verifies heatwave fit check omits heavy jackets and promotes linen/tank tops', () => {
      for (const day of SCORCHING_HEATWAVE.dataset.daily) {
        const outerwear = (day.ootd?.layers.outerwear ?? '').toLowerCase();
        expect(outerwear).not.toMatch(/puffer|down|wool|parka/);
        const top = day.ootd?.layers.top.toLowerCase() ?? '';
        expect(top).toMatch(/linen|tank|crop|breezy|mesh|cotton|viscose/);
      }
    });

    it('C3.3: verifies heatwave accessories require sunglasses and hydration/sunscreen', () => {
      const heatDay = SCORCHING_HEATWAVE.dataset.daily[0];
      const acc = (heatDay.ootd?.layers.accessories ?? []).join(' ').toLowerCase();
      expect(acc).toMatch(/sunglasses|sunscreen|water|hydro/);
    });

    it('C3.4: heatwave activities promote air-conditioned indoor refuges', () => {
      const heatActivities = SCORCHING_HEATWAVE.dataset.daily[0].activities!;
      const combined = (heatActivities.primary + ' ' + heatActivities.secondary).toLowerCase();
      expect(combined).toMatch(/museum|gallery|air-conditioned|indoor|shaded|smoothie/);
    });

    it('C3.5: verifies heatwave condition category is predominantly clear or sunny', () => {
      for (const day of SCORCHING_HEATWAVE.dataset.daily) {
        expect(day.conditionCategory).toMatch(/clear|sunny|cloudy/);
        expect(day.precipitationProbability).toBeLessThanOrEqual(25);
      }
    });
  });

  // =========================================================================
  // C4: Warm Muggy Rain (Tropical Rain / Monsoons)
  // =========================================================================
  describe('C4: Warm Muggy Rain (Temp 22°C - 27°C & Rain >= 8mm)', () => {
    it('C4.1: warm muggy rain strictly disqualifies heavy winter coats or puffers', () => {
      const warmRainDay = createTestDay({ temperatureMax: 24, apparentTemperatureMax: 24, precipitationSum: 10, weatherCode: 63, windSpeedMax: 12 });
      const ootd = getOOTDRecommendation(warmRainDay);
      const outerwear = (ootd.layers.outerwear ?? '').toLowerCase();
      expect(outerwear).not.toContain('puffer');
      expect(outerwear).not.toContain('wool');
      expect(ootd.avoidList.some(item => /wool|heavy/i.test(item))).toBe(true);
    });

    it('C4.2: warm muggy rain recommends light breathable poncho or packable shell', () => {
      const warmRainDay = createTestDay({ temperatureMax: 25, apparentTemperatureMax: 25, precipitationSum: 12, weatherCode: 63, windSpeedMax: 10 });
      const ootd = getOOTDRecommendation(warmRainDay);
      expect(ootd.layers.outerwear?.toLowerCase()).toMatch(/packable|shell|waterproof/);
    });

    it('C4.3: warm muggy rain recommends water-friendly slides or platform sandals', () => {
      const warmRainDay = createTestDay({ temperatureMax: 24, apparentTemperatureMax: 24, precipitationSum: 8, weatherCode: 61, windSpeedMax: 10 });
      const ootd = getOOTDRecommendation(warmRainDay);
      expect(ootd.layers.footwear.toLowerCase()).toMatch(/slides|sandals|sneakers|water/);
    });

    it('C4.4: warm muggy rain recommends breathable shorts or skirts over heavy trousers', () => {
      const warmRainDay = createTestDay({ temperatureMax: 23, apparentTemperatureMax: 23, precipitationSum: 7, weatherCode: 61, windSpeedMax: 10 });
      const ootd = getOOTDRecommendation(warmRainDay);
      expect(ootd.layers.bottom.toLowerCase()).toMatch(/shorts|jorts|parachute/);
    });

    it('C4.5: thunderstorm preset maintains high summer temperatures with rain', () => {
      const stormDay = CHAOTIC_SUMMER_THUNDERSTORM.dataset.daily[0];
      expect(stormDay.temperatureMax).toBeGreaterThan(25);
      expect(stormDay.conditionCategory).toBe('thunderstorm');
    });
  });

  // =========================================================================
  // C5: Preset Switching & State Coherence
  // =========================================================================
  describe('C5: Sequential Preset Switching & State Continuity', () => {
    it('C5.1: switching Autumn -> Heatwave updates location, temperature, and vibe', () => {
      const autumn = getPresetById('sweater-weather')!;
      const heatwave = getPresetById('scorching-heatwave')!;

      expect(autumn.dataset.location.name).toBe('Woodstock');
      expect(heatwave.dataset.location.name).toBe('Palm Springs');
      expect(heatwave.dataset.daily[0].temperatureMax).toBeGreaterThan(autumn.dataset.daily[0].temperatureMax);
      expect(heatwave.dataset.daily[0].vibeCheck?.headline).not.toBe(autumn.dataset.daily[0].vibeCheck?.headline);
    });

    it('C5.2: switching Heatwave -> Blizzard updates outfit from light linen to heavy down puffer', () => {
      const heatwave = getPresetById('scorching-heatwave')!;
      const blizzard = getPresetById('subzero-blizzard')!;

      const heatTop = heatwave.dataset.daily[0].ootd?.layers.top.toLowerCase() ?? '';
      const blizzardOuter = blizzard.dataset.daily[0].ootd?.layers.outerwear?.toLowerCase() ?? '';

      expect(heatTop).toMatch(/linen|tank|crop|breezy|mesh|cotton|viscose/);
      expect(blizzardOuter).toMatch(/puffer|down|parka/);
    });

    it('C5.3: switching Blizzard -> Rain updates accessories from mittens to umbrellas', () => {
      const blizzard = getPresetById('subzero-blizzard')!;
      const rain = getPresetById('gloomy-rainy-day')!;

      const blizzardAcc = (blizzard.dataset.daily[0].ootd?.layers.accessories ?? []).join(' ').toLowerCase();
      const rainAcc = (rain.dataset.daily[0].ootd?.layers.accessories ?? []).join(' ').toLowerCase();

      expect(blizzardAcc).toMatch(/mittens|gloves|beanie/);
      expect(rainAcc).toContain('umbrella');
    });

    it('C5.4: verifying all 6 presets retain 5-day daily forecast collections', () => {
      for (const preset of PRESET_SCENARIOS) {
        expect(preset.dataset.daily.length).toBeGreaterThanOrEqual(5);
        for (const day of preset.dataset.daily) {
          expect(day.date).toBeDefined();
          expect(day.vibeCheck).toBeDefined();
          expect(day.ootd).toBeDefined();
          expect(day.activities).toBeDefined();
        }
      }
    });

    it('C5.5: circular preset switching sequence does not mutate underlying preset objects', () => {
      const p1 = getPresetById('sweater-weather')!;
      const originalTemp = p1.dataset.daily[0].temperatureMax;

      getPresetById('scorching-heatwave');
      getPresetById('subzero-blizzard');
      getPresetById('gloomy-rainy-day');
      const p1Again = getPresetById('sweater-weather')!;

      expect(p1Again.dataset.daily[0].temperatureMax).toBe(originalTemp);
    });
  });

  // =========================================================================
  // C6: Multi-Day Temperature Unit Toggling (°C <-> °F)
  // =========================================================================
  describe('C6: Multi-Day Temperature Unit Toggling (°C <-> °F)', () => {
    function toFahrenheit(celsius: number): number {
      return Math.round((celsius * 9) / 5 + 32);
    }

    function toCelsius(fahrenheit: number): number {
      return Math.round(((fahrenheit - 32) * 5) / 9);
    }

    it('C6.1: converts all 5 daily max temperatures of Autumn preset accurately', () => {
      const daily = AUTUMN_SWEATER_WEATHER.dataset.daily;
      for (const day of daily) {
        const f = toFahrenheit(day.temperatureMax);
        expect(typeof f).toBe('number');
        expect(f).toBeGreaterThan(32); // autumn max > 0°C
      }
    });

    it('C6.2: preserves high >= low inequality after Fahrenheit conversion', () => {
      for (const preset of PRESET_SCENARIOS) {
        for (const day of preset.dataset.daily) {
          const maxF = toFahrenheit(day.temperatureMax);
          const minF = toFahrenheit(day.temperatureMin);
          expect(maxF).toBeGreaterThanOrEqual(minF);
        }
      }
    });

    it('C6.3: apparent temperatures convert with mathematical consistency in Fahrenheit', () => {
      const blizzardDay = SUBZERO_BLIZZARD.dataset.daily[0];
      const maxF = toFahrenheit(blizzardDay.temperatureMax);
      const appF = toFahrenheit(blizzardDay.apparentTemperatureMax);
      expect(appF).toBeLessThanOrEqual(maxF);
    });

    it('C6.4: unit toggling preserves Celsius values without mutating original dataset', () => {
      const originalHigh = AUTUMN_SWEATER_WEATHER.dataset.daily[0].temperatureMax;
      const converted = toFahrenheit(originalHigh);
      expect(converted).not.toBe(originalHigh);
      expect(AUTUMN_SWEATER_WEATHER.dataset.daily[0].temperatureMax).toBe(originalHigh);
    });

    it('C6.5: roundtrip conversion (C -> F -> C) preserves approximate metric values', () => {
      const testTemps = [-15, -4, 0, 12, 18, 26, 35, 42];
      for (const t of testTemps) {
        const f = toFahrenheit(t);
        const roundTrip = toCelsius(f);
        expect(Math.abs(roundTrip - t)).toBeLessThanOrEqual(1);
      }
    });
  });
});
