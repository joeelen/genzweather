import { describe, it, expect } from 'vitest';
import { getVibeCheck, calculateVibeScore } from '../engine/vibeEngine';
import { NormalizedForecastDay } from '../types/weather';

function createMockDay(overrides: Partial<NormalizedForecastDay> = {}): NormalizedForecastDay {
  return {
    date: '2026-09-11',
    dayOfWeek: 'Today',
    temperatureMax: 21,
    temperatureMin: 14,
    apparentTemperatureMax: 21,
    apparentTemperatureMin: 14,
    precipitationSum: 0,
    precipitationProbability: 0,
    windSpeedMax: 10,
    uvIndexMax: 4,
    weatherCode: 0,
    conditionCategory: 'clear',
    conditionLabel: 'Clear Sky',
    conditionEmoji: '☀️',
    ...overrides
  };
}

describe('Vibe Check Engine (F7)', () => {
  describe('Vibe Score Calculation & Tier Scaling', () => {
    it('calculates near-perfect score for immaculate sunny day (21°C, clear sky, zero rain)', () => {
      const day = createMockDay({
        temperatureMax: 21,
        apparentTemperatureMax: 21,
        weatherCode: 0,
        precipitationSum: 0,
        windSpeedMax: 10
      });
      const result = calculateVibeScore(day);

      expect(result.score).toBeGreaterThanOrEqual(90);
      expect(result.tier).toBe('100% Immaculate');
      expect(result.emoji).toBe('✨');
    });

    it('penalizes subzero blizzard into Down Bad / Certified Disaster tier', () => {
      const blizzard = createMockDay({
        temperatureMax: -5,
        apparentTemperatureMax: -10,
        weatherCode: 73,
        precipitationSum: 8.5,
        windSpeedMax: 32
      });
      const result = calculateVibeScore(blizzard);

      expect(result.score).toBeLessThanOrEqual(35);
      expect(['Down Bad Weather', 'Certified Disaster']).toContain(result.tier);
    });

    it('penalizes violent storm with high winds into low vibe score', () => {
      const storm = createMockDay({
        temperatureMax: 13,
        apparentTemperatureMax: 10,
        weatherCode: 95,
        precipitationSum: 22,
        windSpeedMax: 48
      });
      const result = calculateVibeScore(storm);

      expect(result.score).toBeLessThanOrEqual(30);
      expect(['Down Bad Weather', 'Certified Disaster']).toContain(result.tier);
    });

    it('penalizes extreme heatwaves (> 34°C)', () => {
      const heatwave = createMockDay({
        temperatureMax: 38,
        apparentTemperatureMax: 42,
        weatherCode: 0,
        precipitationSum: 0
      });
      const result = calculateVibeScore(heatwave);

      // Baseline 70 - 35 (heat) + 10 (clear) = 45
      expect(result.score).toBeLessThanOrEqual(55);
      expect(result.score).toBeGreaterThanOrEqual(10);
    });

    it('awards high vibe score for crisp autumn sweater weather (15°C, dry, mild)', () => {
      const crisp = createMockDay({
        temperatureMax: 15,
        apparentTemperatureMax: 15,
        weatherCode: 1,
        precipitationSum: 0,
        windSpeedMax: 12
      });
      const result = calculateVibeScore(crisp);

      expect(result.score).toBeGreaterThanOrEqual(75);
      expect(['Main Character Energy', '100% Immaculate']).toContain(result.tier);
    });

    it('clamps scores strictly within 5 to 100 boundaries under extreme modifiers', () => {
      const apocalyptic = createMockDay({
        temperatureMax: -25,
        apparentTemperatureMax: -35,
        weatherCode: 99,
        precipitationSum: 60,
        windSpeedMax: 90
      });
      const resultMin = calculateVibeScore(apocalyptic);
      expect(resultMin.score).toBeGreaterThanOrEqual(5);

      const paradise = createMockDay({
        temperatureMax: 22,
        apparentTemperatureMax: 22,
        weatherCode: 0,
        precipitationSum: 0,
        windSpeedMax: 5
      });
      const resultMax = calculateVibeScore(paradise);
      expect(resultMax.score).toBeLessThanOrEqual(100);
    });
  });

  describe('Gen-Z Headline & Slang Dictionary Generation', () => {
    it('produces "Main character sunshine" headline on warm sunny days', () => {
      const day = createMockDay({
        temperatureMax: 22,
        apparentTemperatureMax: 22,
        weatherCode: 0
      });
      const vibe = getVibeCheck(day);

      expect(vibe.headline).toMatch(/Main character sunshine/i);
      expect(vibe.mood).toBe('sunny');
      expect(vibe.moodColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });

    it('produces "Sweater weather is completely immaculate" on crisp autumn days (11°C - 17°C)', () => {
      const day = createMockDay({
        temperatureMax: 14,
        apparentTemperatureMax: 13.5,
        weatherCode: 2,
        precipitationSum: 0
      });
      const vibe = getVibeCheck(day);

      expect(vibe.headline).toMatch(/Sweater weather is completely immaculate/i);
      expect(vibe.badge).toMatch(/Sweater SZN/i);
      expect(vibe.mood).toBe('mild_cloudy');
    });

    it('produces "Literally freezing blizzard no cap" on subzero snowy days', () => {
      const day = createMockDay({
        temperatureMax: -4,
        apparentTemperatureMax: -9,
        weatherCode: 73,
        precipitationSum: 6.0,
        windSpeedMax: 28
      });
      const vibe = getVibeCheck(day);

      expect(vibe.headline).toMatch(/Literally freezing blizzard no cap/i);
      expect(vibe.badge).toMatch(/Arctic Freeze/i);
      expect(vibe.mood).toBe('snow');
    });

    it('produces "Moody rain lofi vibe" on rainy days', () => {
      const day = createMockDay({
        temperatureMax: 14,
        apparentTemperatureMax: 13,
        weatherCode: 63,
        precipitationSum: 12.0
      });
      const vibe = getVibeCheck(day);

      expect(vibe.headline).toMatch(/Moody rain lofi vibe/i);
      expect(vibe.mood).toBe('rain');
    });

    it('produces "Scorching heat stay hydrated bestie" on extreme heat days (> 32°C)', () => {
      const day = createMockDay({
        temperatureMax: 37,
        apparentTemperatureMax: 40,
        weatherCode: 0
      });
      const vibe = getVibeCheck(day);

      expect(vibe.headline).toMatch(/Scorching heat stay hydrated bestie/i);
      expect(vibe.badge).toMatch(/Melting Core/i);
      expect(vibe.mood).toBe('heat');
    });

    it('produces "The sky is throwing a temper tantrum" during thunderstorms', () => {
      const day = createMockDay({
        temperatureMax: 22,
        apparentTemperatureMax: 22,
        weatherCode: 95,
        windSpeedMax: 45,
        precipitationSum: 15
      });
      const vibe = getVibeCheck(day);

      expect(vibe.headline).toMatch(/The sky is throwing a temper tantrum/i);
      expect(vibe.badge).toMatch(/Storm Warning/i);
      expect(vibe.mood).toBe('storm');
    });

    it('produces "Wind is personally disrespecting your haircut" on gale wind days (> 35 km/h, dry)', () => {
      const day = createMockDay({
        temperatureMax: 16,
        apparentTemperatureMax: 14,
        weatherCode: 2,
        windSpeedMax: 42,
        precipitationSum: 0
      });
      const vibe = getVibeCheck(day);

      expect(vibe.headline).toMatch(/Wind is personally disrespecting your haircut/i);
      expect(vibe.badge).toMatch(/Gale Warning/i);
    });
  });

  describe('Contract Presentation & Visual Tokens', () => {
    it('provides valid non-empty badge, tagline, mood color, and score for UI rendering', () => {
      const day = createMockDay({ temperatureMax: 19 });
      const vibe = getVibeCheck(day);

      expect(vibe.badge.length).toBeGreaterThan(2);
      expect(vibe.tagline.length).toBeGreaterThan(10);
      expect(vibe.moodColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(vibe.score).toBeDefined();
      expect(vibe.score).toBeGreaterThanOrEqual(0);
      expect(vibe.score).toBeLessThanOrEqual(100);
      expect(vibe.emoji).toBeDefined();
      expect(vibe.tier).toBeDefined();
    });

    it('triggers Arctic Freeze rather than rain storm warning for subzero blizzard with heavy snow (>8mm)', () => {
      const blizzardDay = createMockDay({
        temperatureMax: -15,
        apparentTemperatureMax: -22,
        weatherCode: 75, // Heavy Snow
        precipitationSum: 25,
        windSpeedMax: 45
      });
      const vibe = getVibeCheck(blizzardDay);

      expect(vibe.badge).toBe('Arctic Freeze');
      expect(vibe.headline).toMatch(/freezing blizzard/i);
      expect(vibe.tagline).toMatch(/weighted blankets/i);
      expect(vibe.mood).toBe('snow');
    });

    it('does not trigger thunderstorm on out-of-range codes (e.g. 100, 255)', () => {
      const day = createMockDay({
        temperatureMax: 20,
        apparentTemperatureMax: 20,
        weatherCode: 100,
        precipitationSum: 0,
        windSpeedMax: 10
      });
      const vibe = getVibeCheck(day);

      expect(vibe.badge).not.toBe('Storm Warning');
      expect(vibe.mood).not.toBe('storm');
    });
  });
});
