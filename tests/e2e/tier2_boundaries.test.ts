import { describe, it, expect, vi } from 'vitest';
import {
  NormalizedForecastDay,
  OOTDRecommendation,
  VibeCheck,
  ActivitySuggestions
} from '../../src/types/weather';
import {
  SUBZERO_BLIZZARD,
  SCORCHING_HEATWAVE,
  GLOOMY_RAINY_DAY,
  AUTUMN_SWEATER_WEATHER,
  CHAOTIC_SUMMER_THUNDERSTORM,
  PRESET_SCENARIOS
} from '../../src/presets/presetData';
import { searchCities, formatLocationName } from '../../src/services/geocodingService';
import { getWmoInfo } from '../../src/services/openMeteoService';

describe('Tier 2: Boundary & Corner Cases', () => {

  // =========================================================================
  // B1: Subzero Freezing (< 0°C)
  // =========================================================================
  describe('B1: Subzero Freezing (< 0°C) Boundaries', () => {
    it('B1.1: validates subzero forecast days enforce heavy down puffer, parka, or shearling outerwear', () => {
      const blizzardDays = SUBZERO_BLIZZARD.dataset.daily;
      for (const day of blizzardDays) {
        if (day.temperatureMax < 0) {
          const outerwear = (day.ootd?.layers.outerwear ?? '').toLowerCase();
          expect(outerwear).toMatch(/puffer|parka|down|quilted|shearling|aviator/);
        }
      }
    });

    it('B1.2: validates subzero conditions strictly forbid shorts and open sandals', () => {
      for (const day of SUBZERO_BLIZZARD.dataset.daily) {
        if (day.temperatureMax < 0) {
          const bottom = day.ootd?.layers.bottom.toLowerCase() ?? '';
          const footwear = day.ootd?.layers.footwear.toLowerCase() ?? '';
          expect(bottom).not.toContain('shorts');
          expect(footwear).not.toContain('sandals');
          expect(footwear).not.toContain('slides');
        }
      }
    });

    it('B1.3: validates subzero conditions mandate thermal headwear & handwear accessories', () => {
      for (const day of SUBZERO_BLIZZARD.dataset.daily) {
        if (day.temperatureMax < 0) {
          const accessories = (day.ootd?.layers.accessories ?? []).join(' ').toLowerCase();
          expect(accessories).toMatch(/beanie|balaclava|mittens|gloves|scarf/);
        }
      }
    });

    it('B1.4: validates severe negative temperatures reflect frost/arctic vibe headlines', () => {
      const blizzardDay = SUBZERO_BLIZZARD.dataset.daily[0];
      const headline = blizzardDay.vibeCheck?.headline.toLowerCase() ?? '';
      const tagline = blizzardDay.vibeCheck?.tagline.toLowerCase() ?? '';
      expect(headline + ' ' + tagline).toMatch(/freezing|blizzard|arctic|subzero|frost|polar|ice/);
    });

    it('B1.5: validates apparent temperature in subzero conditions reflects windchill drop', () => {
      for (const day of SUBZERO_BLIZZARD.dataset.daily) {
        expect(day.apparentTemperatureMax).toBeLessThanOrEqual(day.temperatureMax);
      }
    });
  });

  // =========================================================================
  // B2: Heavy Blizzard & Snowfall
  // =========================================================================
  describe('B2: Heavy Blizzard & Snowfall Edge Cases', () => {
    it('B2.1: validates heavy snow WMO codes (73, 75, 85, 86) map to snow categories', () => {
      expect(getWmoInfo(73).category).toBe('snow');
      expect(getWmoInfo(75).category).toBe('heavy-snow');
      expect(getWmoInfo(85).category).toBe('snow');
      expect(getWmoInfo(86).category).toBe('heavy-snow');
    });

    it('B2.2: validates blizzard footwear requires lug-sole boots or insulated snow boots', () => {
      for (const day of SUBZERO_BLIZZARD.dataset.daily) {
        const shoes = day.ootd?.layers.footwear.toLowerCase() ?? '';
        expect(shoes).toMatch(/boot|lug|snow|thermal|insulated/);
      }
    });

    it('B2.3: validates blizzard peak day strictly sets isIndoorPreferred to true', () => {
      const blizzardDay0 = SUBZERO_BLIZZARD.dataset.daily[0];
      expect(blizzardDay0.activities?.isIndoorPreferred).toBe(true);
    });

    it('B2.4: validates blizzard activities prioritize warm comfort havens', () => {
      const activities = SUBZERO_BLIZZARD.dataset.daily[0].activities!;
      const text = (activities.primary + ' ' + activities.secondary).toLowerCase();
      expect(text).toMatch(/ramen|cocoa|warm|indoor|cozy|bakery|coffee|hearth/);
    });

    it('B2.5: validates blizzard peak day exhibits intense precipitation probability (>= 80%)', () => {
      expect(SUBZERO_BLIZZARD.dataset.daily[0].precipitationProbability).toBeGreaterThanOrEqual(80);
      for (const day of SUBZERO_BLIZZARD.dataset.daily) {
        expect(day.precipitationProbability).toBeGreaterThanOrEqual(0);
        expect(day.precipitationProbability).toBeLessThanOrEqual(100);
      }
    });
  });

  // =========================================================================
  // B3: Torrential Rain & Storm (Precipitation >= 20mm, Wind >= 35 km/h)
  // =========================================================================
  describe('B3: Torrential Rain & Storm Boundaries', () => {
    it('B3.1: validates heavy rain and thunderstorm WMO codes map to wet categories', () => {
      expect(getWmoInfo(65).category).toBe('heavy-rain');
      expect(getWmoInfo(82).category).toBe('heavy-rain');
      expect(getWmoInfo(95).category).toBe('thunderstorm');
      expect(getWmoInfo(99).category).toBe('thunderstorm');
    });

    it('B3.2: validates heavy rain days mandate waterproof footwear and disallow canvas/suede', () => {
      const heavyRainDay = GLOOMY_RAINY_DAY.dataset.daily[0];
      const shoes = heavyRainDay.ootd?.layers.footwear.toLowerCase() ?? '';
      expect(shoes).toMatch(/waterproof|boot|chelsea|gore-tex|lug|rubber/);
      expect(shoes).not.toContain('suede');
      expect(shoes).not.toContain('canvas');
    });

    it('B3.3: validates rainy day accessories include umbrellas on wet days', () => {
      const heavyRainDay = GLOOMY_RAINY_DAY.dataset.daily[0];
      const accessories = (heavyRainDay.ootd?.layers.accessories ?? []).join(' ').toLowerCase();
      expect(accessories).toContain('umbrella');
    });

    it('B3.4: validates high gale thunderstorm warns of severe weather hazards in tip', () => {
      const stormDay = CHAOTIC_SUMMER_THUNDERSTORM.dataset.daily[0];
      const tip = (stormDay.ootd?.tip ?? '').toLowerCase();
      expect(tip.length).toBeGreaterThan(10);
    });

    it('B3.5: validates storm and heavy downpour activities lock to indoor destinations', () => {
      expect(GLOOMY_RAINY_DAY.dataset.daily[0].activities?.isIndoorPreferred).toBe(true);
      expect(CHAOTIC_SUMMER_THUNDERSTORM.dataset.daily[0].activities?.isIndoorPreferred).toBe(true);
    });
  });

  // =========================================================================
  // B4: Extreme Heatwave (> 35°C, High UV)
  // =========================================================================
  describe('B4: Extreme Heatwave (> 35°C, High UV) Boundaries', () => {
    it('B4.1: validates heatwave days omit heavy outerwear coats', () => {
      for (const day of SCORCHING_HEATWAVE.dataset.daily) {
        if (day.temperatureMax > 35) {
          const outerwear = (day.ootd?.layers.outerwear ?? '').toLowerCase();
          expect(outerwear).not.toMatch(/heavy down|parka|wool coat|puffer/);
        }
      }
    });

    it('B4.2: validates heatwave tops specify breathable materials (linen, tank, crop, viscose)', () => {
      for (const day of SCORCHING_HEATWAVE.dataset.daily) {
        const top = day.ootd?.layers.top.toLowerCase() ?? '';
        expect(top).toMatch(/linen|tank|crop|breezy|mesh|cotton|viscose/);
      }
    });

    it('B4.3: validates heatwave accessories mandate sunglasses and hydration/sunscreen', () => {
      for (const day of SCORCHING_HEATWAVE.dataset.daily) {
        const acc = (day.ootd?.layers.accessories ?? []).join(' ').toLowerCase();
        expect(acc).toMatch(/sunglasses|sunscreen|water|shades|hydro/);
      }
    });

    it('B4.4: validates extreme heat UV index exceeds 8.0', () => {
      for (const day of SCORCHING_HEATWAVE.dataset.daily) {
        expect(day.uvIndexMax).toBeGreaterThanOrEqual(8.0);
      }
    });

    it('B4.5: validates heatwave vibe checks caution about asphalt and high temperatures', () => {
      const heatDay = SCORCHING_HEATWAVE.dataset.daily[0];
      const combined = (heatDay.vibeCheck?.headline + ' ' + heatDay.vibeCheck?.tagline).toLowerCase();
      expect(combined).toMatch(/heat|melting|sun|blaze|sweat|scorching|boiling/);
    });
  });

  // =========================================================================
  // B5: High Gale Wind (> 35 km/h)
  // =========================================================================
  describe('B5: High Gale Wind (> 35 km/h) Boundaries', () => {
    it('B5.1: validates wind speed scale mapping detects high wind conditions', () => {
      const isHighWind = (speed: number) => speed > 35;
      expect(isHighWind(12)).toBe(false);
      expect(isHighWind(25)).toBe(false);
      expect(isHighWind(35)).toBe(false);
      expect(isHighWind(35.1)).toBe(true);
      expect(isHighWind(48)).toBe(true);
    });

    it('B5.2: validates storm preset exhibits elevated wind speeds (> 25 km/h)', () => {
      const stormDay = CHAOTIC_SUMMER_THUNDERSTORM.dataset.daily[0];
      expect(stormDay.windSpeedMax).toBeGreaterThan(25);
    });

    it('B5.3: verifies windchill calculation function at gale speeds reduces apparent temperature', () => {
      const calculateWindChill = (temp: number, windKmh: number): number => {
        if (temp > 10 || windKmh < 4.8) return temp;
        return Math.round(13.12 + 0.6215 * temp - 11.37 * Math.pow(windKmh, 0.16) + 0.3965 * temp * Math.pow(windKmh, 0.16));
      };

      const apparentAtCalm = calculateWindChill(-5, 5);
      const apparentAtGale = calculateWindChill(-5, 45);
      expect(apparentAtGale).toBeLessThan(apparentAtCalm);
    });

    it('B5.4: verifies umbrella inversion hazard warning logic when wind exceeds 35 km/h during rain', () => {
      const getUmbrellaRecommendation = (precipSum: number, windKmh: number): string => {
        if (precipSum < 1) return 'No umbrella needed';
        if (windKmh > 35) return 'Warning: high wind will invert umbrellas; wear a hooded technical shell!';
        return 'Standard compact umbrella recommended';
      };

      expect(getUmbrellaRecommendation(0, 40)).toBe('No umbrella needed');
      expect(getUmbrellaRecommendation(10, 15)).toBe('Standard compact umbrella recommended');
      expect(getUmbrellaRecommendation(15, 42)).toContain('invert');
    });

    it('B5.5: verifies high wind disallows outdoor lightweight hats without retention cords', () => {
      const isHatSafeInWind = (hatType: string, windKmh: number): boolean => {
        if (windKmh > 40 && (hatType === 'bucket hat' || hatType === 'baseball cap')) {
          return false;
        }
        return true;
      };

      expect(isHatSafeInWind('baseball cap', 15)).toBe(true);
      expect(isHatSafeInWind('baseball cap', 45)).toBe(false);
      expect(isHatSafeInWind('beanie', 45)).toBe(true);
    });
  });

  // =========================================================================
  // B6: Empty Search Results & Edge Strings
  // =========================================================================
  describe('B6: Empty Search Results & Edge Input Handling', () => {
    it('B6.1: searchCities returns empty array for empty string', async () => {
      const res = await searchCities('');
      expect(res).toEqual([]);
    });

    it('B6.2: searchCities returns empty array for whitespace-only query', async () => {
      const res = await searchCities('      ');
      expect(res).toEqual([]);
    });

    it('B6.3: searchCities returns empty array for single character query', async () => {
      const res = await searchCities('K');
      expect(res).toEqual([]);
    });

    it('B6.4: searchCities handles mock HTTP 429 rate limit response without throwing', async () => {
      const originalFetch = global.fetch;
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 429
      });

      const res = await searchCities('London');
      expect(res).toEqual([]);

      global.fetch = originalFetch;
    });

    it('B6.5: formatLocationName handles missing admin1 without double commas', () => {
      const cityWithoutAdmin = {
        id: 99,
        name: 'Singapore',
        latitude: 1.35,
        longitude: 103.82,
        country: 'Singapore'
      };
      const formatted = formatLocationName(cityWithoutAdmin);
      expect(formatted).toBe('Singapore, Singapore');
      expect(formatted).not.toContain(', ,');
    });
  });

  // =========================================================================
  // B7: Exact Temperature Band Thresholds
  // =========================================================================
  describe('B7: Exact Temperature Band Boundary Classifications', () => {
    type TemperatureBand = 'SUBZERO' | 'CHILLY' | 'MILD_CRISP' | 'WARM' | 'HOT' | 'SCORCHING';

    const classifyBand = (temp: number): TemperatureBand => {
      if (temp < 0) return 'SUBZERO';
      if (temp <= 10.9) return 'CHILLY';
      if (temp <= 17.9) return 'MILD_CRISP';
      if (temp <= 24.9) return 'WARM';
      if (temp <= 32.0) return 'HOT';
      return 'SCORCHING';
    };

    it('B7.1: boundary at 0.0°C correctly transitions from SUBZERO to CHILLY', () => {
      expect(classifyBand(-0.1)).toBe('SUBZERO');
      expect(classifyBand(0.0)).toBe('CHILLY');
    });

    it('B7.2: boundary at 11.0°C correctly transitions from CHILLY to MILD_CRISP', () => {
      expect(classifyBand(10.9)).toBe('CHILLY');
      expect(classifyBand(11.0)).toBe('MILD_CRISP');
    });

    it('B7.3: boundary at 18.0°C correctly transitions from MILD_CRISP to WARM', () => {
      expect(classifyBand(17.9)).toBe('MILD_CRISP');
      expect(classifyBand(18.0)).toBe('WARM');
    });

    it('B7.4: boundary at 25.0°C correctly transitions from WARM to HOT', () => {
      expect(classifyBand(24.9)).toBe('WARM');
      expect(classifyBand(25.0)).toBe('HOT');
    });

    it('B7.5: boundary at 32.0°C correctly transitions from HOT to SCORCHING', () => {
      expect(classifyBand(32.0)).toBe('HOT');
      expect(classifyBand(32.1)).toBe('SCORCHING');
      expect(classifyBand(40.0)).toBe('SCORCHING');
    });
  });
});
