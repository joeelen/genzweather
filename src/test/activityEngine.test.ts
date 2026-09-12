import { describe, it, expect } from 'vitest';
import { getActivitySuggestions, ACTIVITY_CATALOG } from '../engine/activityEngine';
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
    uvIndexMax: 4,
    weatherCode: 0,
    conditionCategory: 'clear',
    conditionLabel: 'Clear Sky',
    conditionEmoji: '☀️',
    ...overrides
  };
}

describe('Activity Suggestions Engine (F8)', () => {
  describe('Activity Catalog Breadth & Metadata', () => {
    it('contains a rich catalog of indoor and outdoor activities with complete metadata', () => {
      expect(ACTIVITY_CATALOG.length).toBeGreaterThanOrEqual(12);

      const indoor = ACTIVITY_CATALOG.filter(a => a.category === 'indoor');
      const outdoor = ACTIVITY_CATALOG.filter(a => a.category === 'outdoor');

      expect(indoor.length).toBeGreaterThanOrEqual(6);
      expect(outdoor.length).toBeGreaterThanOrEqual(5);

      // Verify required catalog entries
      const names = ACTIVITY_CATALOG.map(a => a.name.toLowerCase());
      expect(names.some(n => n.includes('matcha'))).toBe(true);
      expect(names.some(n => n.includes('thrift'))).toBe(true);
      expect(names.some(n => n.includes('vinyl'))).toBe(true);
      expect(names.some(n => n.includes('museum') || n.includes('art'))).toBe(true);
      expect(names.some(n => n.includes('boulder'))).toBe(true);
      expect(names.some(n => n.includes('cinema') || n.includes('marathon'))).toBe(true);
      expect(names.some(n => n.includes('picnic'))).toBe(true);
      expect(names.some(n => n.includes('skate'))).toBe(true);
      expect(names.some(n => n.includes('rooftop'))).toBe(true);
      expect(names.some(n => n.includes('beach'))).toBe(true);
      expect(names.some(n => n.includes('bike'))).toBe(true);
    });

    it('each activity item has complete structure (id, name, category, energy, social, description, emoji, tag)', () => {
      for (const item of ACTIVITY_CATALOG) {
        expect(item.id).toBeTypeOf('string');
        expect(item.name.length).toBeGreaterThan(5);
        expect(['indoor', 'outdoor', 'hybrid']).toContain(item.category);
        expect(['chill', 'moderate', 'high']).toContain(item.energy);
        expect(['solo', 'besties', 'date']).toContain(item.social);
        expect(item.description.length).toBeGreaterThan(15);
        expect(item.emoji.length).toBeGreaterThan(0);
        expect(item.tag.length).toBeGreaterThan(2);
      }
    });
  });

  describe('Outdoor Activity Disqualification & Indoor Routing', () => {
    it('strictly disqualifies outdoor activities during thunderstorms (WMO 95+)', () => {
      const stormDay = createMockDay({
        temperatureMax: 20,
        apparentTemperatureMax: 20,
        weatherCode: 95,
        precipitationSum: 18.0,
        windSpeedMax: 48
      });
      const suggestions = getActivitySuggestions(stormDay);

      expect(suggestions.isIndoorPreferred).toBe(true);
      expect(suggestions.activities).toHaveLength(3);

      for (const act of suggestions.activities!) {
        expect(act.category).not.toBe('outdoor');
        expect(act.name.toLowerCase()).not.toMatch(/picnic|skate|beach|bike|rooftop|park/);
      }

      // Check indoor activities recommended
      const combined = suggestions.activities!.map(a => a.name.toLowerCase()).join(' ');
      expect(combined).toMatch(/museum|thrifting|vinyl|cinema|ramen|matcha|bouldering|bake/);
    });

    it('strictly disqualifies outdoor activities during heavy rain (> 4mm / rain codes)', () => {
      const rainDay = createMockDay({
        temperatureMax: 13,
        apparentTemperatureMax: 11,
        precipitationSum: 15.0,
        precipitationProbability: 95,
        weatherCode: 63
      });
      const suggestions = getActivitySuggestions(rainDay);

      expect(suggestions.isIndoorPreferred).toBe(true);
      expect(suggestions.activities).toHaveLength(3);

      const outdoorActivities = suggestions.activities!.filter(a => a.category === 'outdoor');
      expect(outdoorActivities).toHaveLength(0);
    });

    it('strictly disqualifies outdoor activities during subzero blizzards (< 0°C + snow)', () => {
      const blizzardDay = createMockDay({
        temperatureMax: -5,
        apparentTemperatureMax: -11,
        precipitationSum: 6.0,
        weatherCode: 73,
        windSpeedMax: 30
      });
      const suggestions = getActivitySuggestions(blizzardDay);

      expect(suggestions.isIndoorPreferred).toBe(true);
      expect(suggestions.activities).toHaveLength(3);

      for (const act of suggestions.activities!) {
        expect(act.category).toBe('indoor');
      }

      // Should include warm comforting indoor options (e.g. ramen, baking, cinema)
      const combined = suggestions.activities!.map(a => a.name.toLowerCase()).join(' ');
      expect(combined).toMatch(/ramen|bake|cinema|vinyl|thrifting|matcha/);
    });

    it('strictly disqualifies outdoor activities during extreme heatwaves (> 34°C)', () => {
      const heatwaveDay = createMockDay({
        temperatureMax: 38,
        apparentTemperatureMax: 42,
        weatherCode: 0,
        precipitationSum: 0
      });
      const suggestions = getActivitySuggestions(heatwaveDay);

      expect(suggestions.isIndoorPreferred).toBe(true);
      // Modern art museum / AC sanctuary should be prominently suggested
      const combined = suggestions.activities!.map(a => a.name.toLowerCase()).join(' ');
      expect(combined).toMatch(/museum|art|indoor/);
    });

    it('promotes outdoor activities during pleasant spring/autumn weather (18°C - 24°C, clear sky, 0% rain)', () => {
      const pleasantDay = createMockDay({
        temperatureMax: 22,
        apparentTemperatureMax: 22,
        weatherCode: 0,
        precipitationSum: 0,
        windSpeedMax: 8
      });
      const suggestions = getActivitySuggestions(pleasantDay);

      expect(suggestions.isIndoorPreferred).toBe(false);
      expect(suggestions.activities).toHaveLength(3);

      const hasOutdoor = suggestions.activities!.some(a => a.category === 'outdoor');
      expect(hasOutdoor).toBe(true);

      const combined = suggestions.activities!.map(a => a.name.toLowerCase()).join(' ');
      expect(combined).toMatch(/picnic|skate|rooftop|bike|walk/);
    });
  });

  describe('Contextual Ideal Time of Day', () => {
    it('recommends Golden Hour for pleasant sunny afternoons', () => {
      const day = createMockDay({
        temperatureMax: 22,
        apparentTemperatureMax: 22,
        weatherCode: 0,
        precipitationSum: 0
      });
      const suggestions = getActivitySuggestions(day);
      expect(suggestions.idealTimeOfDay).toMatch(/Golden Hour/i);
    });

    it('recommends Midday Sun for freezing winter days', () => {
      const day = createMockDay({
        temperatureMax: -2,
        apparentTemperatureMax: -4,
        weatherCode: 1,
        precipitationSum: 0
      });
      const suggestions = getActivitySuggestions(day);
      expect(suggestions.idealTimeOfDay).toMatch(/Midday/i);
    });

    it('recommends Early Morning or Late Evening during scorching heatwaves', () => {
      const day = createMockDay({
        temperatureMax: 36,
        apparentTemperatureMax: 39,
        weatherCode: 0
      });
      const suggestions = getActivitySuggestions(day);
      expect(suggestions.idealTimeOfDay).toMatch(/Early Morning|Late Evening/i);
    });

    it('recommends All Day Cozy during rainy indoor days', () => {
      const day = createMockDay({
        temperatureMax: 14,
        apparentTemperatureMax: 13,
        precipitationSum: 8.0,
        weatherCode: 61
      });
      const suggestions = getActivitySuggestions(day);
      expect(suggestions.idealTimeOfDay).toMatch(/All Day Cozy|Indoors/i);
    });
  });

  describe('Structured Contract Conformity', () => {
    it('returns primary, secondary, tertiary, isIndoorPreferred, idealTimeOfDay, and 3 activities', () => {
      const day = createMockDay();
      const suggestions = getActivitySuggestions(day);

      expect(suggestions.primary).toBeTypeOf('string');
      expect(suggestions.primary.length).toBeGreaterThan(5);
      expect(suggestions.secondary).toBeTypeOf('string');
      expect(suggestions.secondary.length).toBeGreaterThan(5);
      expect(suggestions.tertiary).toBeTypeOf('string');
      expect(suggestions.isIndoorPreferred).toBeTypeOf('boolean');
      expect(suggestions.idealTimeOfDay).toBeTypeOf('string');
      expect(suggestions.activities).toBeDefined();
      expect(suggestions.activities).toHaveLength(3);
      expect(suggestions.items).toEqual(suggestions.activities);

      // Verify all 3 selected activities are unique
      const ids = suggestions.activities!.map(a => a.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(3);
    });
  });
});
