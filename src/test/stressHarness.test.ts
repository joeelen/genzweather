import { describe, it, expect } from 'vitest';
import { getOOTDRecommendation, getTemperatureBand } from '../engine/ootdEngine';
import { getVibeCheck, calculateVibeScore } from '../engine/vibeEngine';
import { getActivitySuggestions } from '../engine/activityEngine';
import { getWmoInfo, DEFAULT_WMO_INFO } from '../services/openMeteoService';
import { NormalizedForecastDay } from '../types/weather';

function createMockDay(overrides: Partial<NormalizedForecastDay> = {}): NormalizedForecastDay {
  return {
    date: '2026-09-11',
    dayOfWeek: 'Today',
    temperatureMax: 20,
    temperatureMin: 12,
    apparentTemperatureMax: 20,
    apparentTemperatureMin: 12,
    precipitationSum: 0,
    precipitationProbability: 0,
    windSpeedMax: 10,
    uvIndexMax: 3,
    weatherCode: 0,
    conditionCategory: 'clear',
    conditionLabel: 'Clear Sky',
    conditionEmoji: '??',
    ...overrides
  };
}

describe('Empirical Adversarial Stress Harness — Domain Recommendation Engines', () => {

  // =========================================================================
  // 1. EXTREME TEMPERATURES (-50°C, 0°C exact boundary, 55°C heatwave)
  // =========================================================================
  describe('Extreme Temperatures Stress Suite', () => {
    it('1.1: Absolute Antarctic minimum (-50°C): verifies subzero band and maximum cold protection without crash', () => {
      const day = createMockDay({
        temperatureMax: -50,
        apparentTemperatureMax: -58,
        weatherCode: 71,
        precipitationSum: 1.0,
        windSpeedMax: 15
      });

      expect(getTemperatureBand(-50)).toBe('SUBZERO');

      const ootd = getOOTDRecommendation(day);
      expect(ootd.summary).toBeTruthy();
      expect(ootd.layers.outerwear?.toLowerCase()).toMatch(/puffer|down|parka/);
      expect(ootd.layers.top).toBeTruthy();
      expect(ootd.layers.bottom).toBeTruthy();
      expect(ootd.layers.footwear.toLowerCase()).toMatch(/snow|boots|thermal/);
      expect(ootd.layers.accessories.some(a => a.toLowerCase().includes('beanie'))).toBe(true);
      expect(ootd.layers.accessories.some(a => a.toLowerCase().includes('gloves'))).toBe(true);

      const vibe = getVibeCheck(day);
      expect(vibe.headline).toBeTruthy();
      expect(vibe.badge).toMatch(/Subzero|Arctic/);
      expect(vibe.mood).toBe('snow');
      expect(vibe.score).toBeGreaterThanOrEqual(5);
      expect(vibe.score).toBeLessThanOrEqual(40);

      const act = getActivitySuggestions(day);
      expect(act.isIndoorPreferred).toBe(true);
      expect(act.activities).toHaveLength(3);
      for (const a of act.activities!) {
        expect(a.category).toBe('indoor');
      }
    });

    it('1.2: Exact 0.0°C boundary (dry, calm): verifies exact boundary handling and stability', () => {
      const day = createMockDay({
        temperatureMax: 0.0,
        apparentTemperatureMax: 0.0,
        precipitationSum: 0,
        precipitationProbability: 0,
        weatherCode: 0,
        windSpeedMax: 5
      });

      expect(getTemperatureBand(0.0)).toBe('CHILLY');

      const ootd = getOOTDRecommendation(day);
      expect(ootd.layers.top).toBeTruthy();
      expect(ootd.layers.bottom).toBeTruthy();
      expect(ootd.layers.footwear).toBeTruthy();

      const vibe = getVibeCheck(day);
      expect(vibe.badge).toMatch(/Chilly/i);
      expect(vibe.headline).toMatch(/Brisk chilly air/i);

      const act = getActivitySuggestions(day);
      expect(act.isIndoorPreferred).toBe(true); // < 10°C routes indoor
      expect(act.activities).toHaveLength(3);
    });

    it('1.3: Exact 0.0°C with freezing precipitation: enforces snow/freezing outerwear modifier', () => {
      const day = createMockDay({
        temperatureMax: 0.0,
        apparentTemperatureMax: -0.5,
        weatherCode: 71,
        precipitationSum: 2.0
      });

      const ootd = getOOTDRecommendation(day);
      expect(ootd.layers.outerwear?.toLowerCase()).toMatch(/puffer|down/);
      expect(ootd.layers.footwear.toLowerCase()).toMatch(/boots/);

      const vibe = getVibeCheck(day);
      expect(vibe.mood).toBe('snow');
    });

    it('1.4: Extreme Scorching Heatwave (+55°C): strictly forbids heavy layers, mandates hydration', () => {
      const day = createMockDay({
        temperatureMax: 55,
        apparentTemperatureMax: 60,
        weatherCode: 0,
        precipitationSum: 0,
        windSpeedMax: 10,
        uvIndexMax: 14
      });

      expect(getTemperatureBand(55)).toBe('SCORCHING');

      const ootd = getOOTDRecommendation(day);
      expect(ootd.layers.outerwear).toBeUndefined();
      expect(ootd.layers.top.toLowerCase()).toMatch(/tank|mesh|linen/);
      expect(ootd.layers.bottom.toLowerCase()).toMatch(/linen|shorts|gauze/);
      expect(ootd.avoidList?.some(a => a.toLowerCase().includes('outerwear'))).toBe(true);
      expect(ootd.layers.accessories.some(a => a.toLowerCase().includes('hydro flask') || a.toLowerCase().includes('water'))).toBe(true);

      const vibe = getVibeCheck(day);
      expect(vibe.badge).toBe('Melting Core');
      expect(vibe.headline).toMatch(/Scorching heat/i);
      expect(vibe.mood).toBe('heat');

      const act = getActivitySuggestions(day);
      expect(act.isIndoorPreferred).toBe(true);
      expect(act.idealTimeOfDay).toMatch(/Early Morning|Late Evening/);
      for (const a of act.activities!) {
        expect(a.category).toBe('indoor');
      }
    });

    it('1.5: Micro-boundary threshold: -0.01°C vs +0.01°C transition', () => {
      const subzeroBand = getTemperatureBand(-0.01);
      const chillyBand = getTemperatureBand(0.01);

      expect(subzeroBand).toBe('SUBZERO');
      expect(chillyBand).toBe('CHILLY');
    });
  });

  // =========================================================================
  // 2. SEVERE WEATHER (Hurricane wind 90 km/h, torrential rain 100mm, blizzard gale)
  // =========================================================================
  describe('Severe & Hazardous Weather Stress Suite', () => {
    it('2.1: Hurricane-force wind (90 km/h, 20°C): equips windproof shell, warns umbrella inversion', () => {
      const day = createMockDay({
        temperatureMax: 20,
        apparentTemperatureMax: 18,
        windSpeedMax: 90,
        precipitationSum: 0,
        weatherCode: 2
      });

      const ootd = getOOTDRecommendation(day);
      expect(ootd.layers.outerwear?.toLowerCase()).toMatch(/windproof.*shell/);
      expect(ootd.tip).toMatch(/90 km\/h/);
      expect(ootd.tip.toLowerCase()).toMatch(/invert/);
      expect(ootd.avoidList?.some(a => a.toLowerCase().includes('umbrella'))).toBe(true);

      const vibe = getVibeCheck(day);
      expect(vibe.badge).toBe('Gale Warning');
      expect(vibe.headline).toMatch(/disrespecting your haircut/i);

      const act = getActivitySuggestions(day);
      expect(act.isIndoorPreferred).toBe(true);
      for (const a of act.activities!) {
        expect(a.category).toBe('indoor');
      }
    });

    it('2.2: Torrential Rain (100mm precipitation, 18°C): enforces waterproof shoes, packable shell', () => {
      const day = createMockDay({
        temperatureMax: 18,
        apparentTemperatureMax: 17,
        precipitationSum: 100,
        precipitationProbability: 100,
        weatherCode: 65,
        windSpeedMax: 20
      });

      const ootd = getOOTDRecommendation(day);
      expect(ootd.layers.footwear.toLowerCase()).toMatch(/water-resistant|waterproof/);
      expect(ootd.layers.outerwear?.toLowerCase()).toMatch(/waterproof|water-resistant/);
      expect(ootd.layers.accessories.some(a => a.toLowerCase().includes('umbrella'))).toBe(true);

      const vibe = getVibeCheck(day);
      expect(vibe.mood).toBe('rain');
      expect(vibe.badge).toMatch(/Downpour/);

      const act = getActivitySuggestions(day);
      expect(act.isIndoorPreferred).toBe(true);
      for (const a of act.activities!) {
        expect(a.category).toBe('indoor');
      }
    });

    it('2.3: Blizzard with freezing gale (-20°C, 30 km/h wind, 6mm snow, WMO 75)', () => {
      const day = createMockDay({
        temperatureMax: -20,
        apparentTemperatureMax: -32,
        precipitationSum: 6,
        precipitationProbability: 100,
        windSpeedMax: 30,
        weatherCode: 75
      });

      const ootd = getOOTDRecommendation(day);
      expect(ootd.layers.footwear.toLowerCase()).toMatch(/boots/);
      expect(ootd.layers.accessories.some(a => a.toLowerCase().includes('gloves'))).toBe(true);
      expect(ootd.layers.accessories.some(a => a.toLowerCase().includes('beanie'))).toBe(true);

      const vibe = getVibeCheck(day);
      expect(vibe.badge).toBe('Arctic Freeze');
      expect(vibe.headline).toMatch(/freezing blizzard/i);
      expect(vibe.score).toBeLessThanOrEqual(35);

      const act = getActivitySuggestions(day);
      expect(act.isIndoorPreferred).toBe(true);
      for (const a of act.activities!) {
        expect(a.category).toBe('indoor');
      }
    });

    it('2.4: Extreme multi-hazard storm (WMO 99 thunderstorm with heavy hail, wind 110 km/h, rain 75mm)', () => {
      const day = createMockDay({
        temperatureMax: 17,
        apparentTemperatureMax: 14,
        precipitationSum: 75,
        precipitationProbability: 100,
        windSpeedMax: 110,
        weatherCode: 99
      });

      const vibe = getVibeCheck(day);
      expect(vibe.badge).toBe('Storm Warning');
      expect(vibe.headline).toMatch(/temper tantrum/i);
      expect(vibe.mood).toBe('storm');
      expect(vibe.score).toBeLessThanOrEqual(20);

      const act = getActivitySuggestions(day);
      expect(act.isIndoorPreferred).toBe(true);
      for (const a of act.activities!) {
        expect(a.category).toBe('indoor');
      }
    });

    it('2.5: Extreme blizzard with violent gale (80 km/h) and high precipitation (40mm): verifies contract integrity and storm-level prioritization', () => {
      const day = createMockDay({
        temperatureMax: -20,
        apparentTemperatureMax: -32,
        precipitationSum: 40,
        precipitationProbability: 100,
        windSpeedMax: 80,
        weatherCode: 75
      });

      const ootd = getOOTDRecommendation(day);
      expect(ootd.layers.footwear).toBeTruthy();
      expect(ootd.layers.top).toBeTruthy();
      expect(ootd.tip).toBeTruthy();

      const vibe = getVibeCheck(day);
      expect(vibe.headline).toBeTruthy();
      expect(vibe.badge).toBeTruthy();
      expect(vibe.score).toBeGreaterThanOrEqual(5);

      const act = getActivitySuggestions(day);
      expect(act.isIndoorPreferred).toBe(true);
      expect(act.activities).toHaveLength(3);
    });
  });

  // =========================================================================
  // 3. EDGE CASES (Negative precipitation, UV > 15, unmapped WMO codes)
  // =========================================================================
  describe('Edge Cases & Malformed Inputs Stress Suite', () => {
    it('3.1: Negative precipitation values (-10mm, prob -50%): handles gracefully without NaN or crash', () => {
      const day = createMockDay({
        temperatureMax: 22,
        precipitationSum: -10,
        precipitationProbability: -50,
        weatherCode: 0
      });

      const ootd = getOOTDRecommendation(day);
      expect(ootd.summary).toBeTruthy();
      expect(ootd.layers.outerwear).toBeUndefined(); // Warm dry day

      const scoreResult = calculateVibeScore(day);
      expect(isNaN(scoreResult.score)).toBe(false);
      expect(scoreResult.score).toBeGreaterThanOrEqual(5);
      expect(scoreResult.score).toBeLessThanOrEqual(100);

      const act = getActivitySuggestions(day);
      expect(act.activities).toHaveLength(3);
    });

    it('3.2: Extreme UV Index (UV = 22.0): enforces sunglasses, dad cap, and SPF reminder', () => {
      const day = createMockDay({
        temperatureMax: 26,
        apparentTemperatureMax: 27,
        uvIndexMax: 22.0,
        weatherCode: 0
      });

      const ootd = getOOTDRecommendation(day);
      expect(ootd.layers.accessories.some(a => a.toLowerCase().includes('sunnies') || a.toLowerCase().includes('sunglasses'))).toBe(true);
      expect(ootd.layers.accessories.some(a => a.toLowerCase().includes('dad cap'))).toBe(true);
      expect(ootd.layers.accessories.some(a => a.toLowerCase().includes('spf') || a.toLowerCase().includes('sunscreen'))).toBe(true);
      expect(ootd.tip.toLowerCase()).toMatch(/uv/);
    });

    it('3.3: Unmapped WMO codes (42, 999, -1, 100): getWmoInfo falls back safely, engines do not throw', () => {
      const unmappedCodes = [42, 999, -1, 100, 255];

      for (const code of unmappedCodes) {
        const info = getWmoInfo(code);
        expect(info).toBeDefined();
        expect(info.label).toBe(DEFAULT_WMO_INFO.label);
        expect(info.category).toBe(DEFAULT_WMO_INFO.category);

        const day = createMockDay({ weatherCode: code });
        expect(() => getOOTDRecommendation(day)).not.toThrow();
        expect(() => getVibeCheck(day)).not.toThrow();
        expect(() => getActivitySuggestions(day)).not.toThrow();

        const ootd = getOOTDRecommendation(day);
        expect(ootd.layers).toBeDefined();
        expect(ootd.layers.top).toBeTruthy();

        const vibe = getVibeCheck(day);
        expect(vibe.headline).toBeTruthy();
        expect(vibe.badge).toBeTruthy();

        const act = getActivitySuggestions(day);
        expect(act.activities).toHaveLength(3);
      }
    });

    it('3.4: Zero values across all metrics (absolute calm / freezing boundary)', () => {
      const zeroDay = createMockDay({
        temperatureMax: 0,
        temperatureMin: 0,
        apparentTemperatureMax: 0,
        apparentTemperatureMin: 0,
        precipitationSum: 0,
        precipitationProbability: 0,
        windSpeedMax: 0,
        uvIndexMax: 0,
        weatherCode: 0
      });

      const ootd = getOOTDRecommendation(zeroDay);
      expect(ootd.layers.footwear).toBeTruthy();

      const vibe = getVibeCheck(zeroDay);
      expect(vibe.score).toBeGreaterThanOrEqual(5);

      const act = getActivitySuggestions(zeroDay);
      expect(act.activities).toHaveLength(3);
    });
  });

  // =========================================================================
  // 4. RANDOMIZED FUZZING STRESS HARNESS (1,000 Iterations)
  // =========================================================================
  describe('Randomized Fuzzing Suite (1,000 extreme weather permutations)', () => {
    it('executes 1,000 fuzz iterations without any uncaught exceptions or undefined mandatory fields', () => {
      const wmoPool = [0, 1, 2, 3, 45, 48, 51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 71, 73, 75, 77, 80, 81, 82, 85, 86, 95, 96, 99, 42, 999, -5, 100];

      for (let i = 0; i < 1000; i++) {
        // Random values including extreme negative and high bounds
        const temp = -55 + Math.random() * 115; // -55 to +60
        const apparentTemp = temp + (-15 + Math.random() * 30); // windchill or heat index
        const precipSum = -5 + Math.random() * 150; // -5 to 145mm
        const precipProb = -10 + Math.random() * 120; // -10% to 110%
        const wind = -5 + Math.random() * 120; // -5 to 115 km/h
        const uv = -2 + Math.random() * 20; // -2 to 18
        const code = wmoPool[Math.floor(Math.random() * wmoPool.length)];

        const day = createMockDay({
          temperatureMax: temp,
          apparentTemperatureMax: apparentTemp,
          precipitationSum: precipSum,
          precipitationProbability: precipProb,
          windSpeedMax: wind,
          uvIndexMax: uv,
          weatherCode: code
        });

        // 1. OOTD verification
        const ootd = getOOTDRecommendation(day);
        expect(ootd.summary).toBeTypeOf('string');
        expect(ootd.summary.length).toBeGreaterThan(0);
        expect(ootd.tip).toBeTypeOf('string');
        expect(ootd.tip.length).toBeGreaterThan(0);
        expect(ootd.aesthetic).toBeTypeOf('string');
        expect(ootd.layers).toBeDefined();
        expect(ootd.layers.top).toBeTypeOf('string');
        expect(ootd.layers.top.length).toBeGreaterThan(0);
        expect(ootd.layers.bottom).toBeTypeOf('string');
        expect(ootd.layers.bottom.length).toBeGreaterThan(0);
        expect(ootd.layers.footwear).toBeTypeOf('string');
        expect(ootd.layers.footwear.length).toBeGreaterThan(0);
        expect(Array.isArray(ootd.layers.accessories)).toBe(true);
        expect(Array.isArray(ootd.colorPalette)).toBe(true);
        expect(Array.isArray(ootd.avoidList)).toBe(true);

        // 2. Vibe Check verification
        const vibe = getVibeCheck(day);
        expect(vibe.headline).toBeTypeOf('string');
        expect(vibe.headline.length).toBeGreaterThan(0);
        expect(vibe.badge).toBeTypeOf('string');
        expect(vibe.badge.length).toBeGreaterThan(0);
        expect(vibe.tagline).toBeTypeOf('string');
        expect(vibe.tagline.length).toBeGreaterThan(0);
        expect(vibe.moodColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
        expect(vibe.score).toBeTypeOf('number');
        expect(isNaN(vibe.score!)).toBe(false);
        expect(vibe.score).toBeGreaterThanOrEqual(5);
        expect(vibe.score).toBeLessThanOrEqual(100);
        expect(vibe.emoji).toBeTypeOf('string');
        expect(vibe.tier).toBeTypeOf('string');
        expect(vibe.mood).toBeTypeOf('string');

        // 3. Activity Suggestions verification
        const act = getActivitySuggestions(day);
        expect(act.primary).toBeTypeOf('string');
        expect(act.primary.length).toBeGreaterThan(0);
        expect(act.secondary).toBeTypeOf('string');
        expect(act.secondary.length).toBeGreaterThan(0);
        expect(act.tertiary).toBeTypeOf('string');
        expect(act.tertiary?.length).toBeGreaterThan(0);
        expect(act.isIndoorPreferred).toBeTypeOf('boolean');
        expect(act.idealTimeOfDay).toBeTypeOf('string');
        expect(act.activities).toHaveLength(3);
        for (const item of act.activities!) {
          expect(item.id).toBeTypeOf('string');
          expect(item.name).toBeTypeOf('string');
          expect(['indoor', 'outdoor', 'hybrid']).toContain(item.category);
          expect(['chill', 'moderate', 'high']).toContain(item.energy);
          expect(['solo', 'besties', 'date']).toContain(item.social);
          expect(item.description).toBeTypeOf('string');
          expect(item.emoji).toBeTypeOf('string');
          expect(item.tag).toBeTypeOf('string');
        }
      }
    });
  });
});
