import { describe, it, expect } from 'vitest';
import {
  NormalizedForecastDay,
  LocationInfo
} from '../../src/types/weather';
import { getOOTDRecommendation } from '../../src/engine/ootdEngine';
import { getVibeCheck } from '../../src/engine/vibeEngine';
import { getActivitySuggestions } from '../../src/engine/activityEngine';

describe('Tier 4: Real-World Application Scenarios', () => {

  // =========================================================================
  // Scenario 1: London Rainy Autumn Weekend
  // =========================================================================
  describe('Scenario 1: London Rainy Autumn Weekend (3-Day Workload)', () => {
    const londonLocation: LocationInfo = {
      name: 'London',
      region: 'England',
      country: 'United Kingdom',
      latitude: 51.5074,
      longitude: -0.1278,
      timezone: 'Europe/London'
    };

    const londonMetrics: Array<Omit<NormalizedForecastDay, 'ootd' | 'vibeCheck' | 'activities'>> = [
      {
        date: '2026-10-23',
        dayOfWeek: 'Friday',
        temperatureMax: 14.2,
        temperatureMin: 9.0,
        apparentTemperatureMax: 13.5,
        precipitationSum: 4.5,
        precipitationProbability: 65,
        windSpeedMax: 18.0,
        uvIndexMax: 2.1,
        weatherCode: 61,
        conditionCategory: 'rain',
        conditionLabel: 'Slight Rain',
        conditionEmoji: '🌧️'
      },
      {
        date: '2026-10-24',
        dayOfWeek: 'Saturday',
        temperatureMax: 11.8,
        temperatureMin: 7.5,
        apparentTemperatureMax: 9.2,
        precipitationSum: 26.0,
        precipitationProbability: 95,
        windSpeedMax: 44.0,
        uvIndexMax: 1.2,
        weatherCode: 65,
        conditionCategory: 'heavy-rain',
        conditionLabel: 'Heavy Rain',
        conditionEmoji: '🌧️🌧️'
      },
      {
        date: '2026-10-25',
        dayOfWeek: 'Sunday',
        temperatureMax: 13.0,
        temperatureMin: 8.0,
        apparentTemperatureMax: 12.0,
        precipitationSum: 0.0,
        precipitationProbability: 15,
        windSpeedMax: 12.0,
        uvIndexMax: 2.5,
        weatherCode: 3,
        conditionCategory: 'cloudy',
        conditionLabel: 'Overcast',
        conditionEmoji: '☁️'
      }
    ];

    // Pass the daily metrics into genuine domain engines directly
    const londonForecast: NormalizedForecastDay[] = londonMetrics.map((metrics) => {
      const day = { ...metrics } as NormalizedForecastDay;
      day.ootd = getOOTDRecommendation(day);
      day.vibeCheck = getVibeCheck(day);
      day.activities = getActivitySuggestions(day);
      return day;
    });

    it('S1.1: validates multi-day forecast sequence for London rainy weekend', () => {
      expect(londonLocation.name).toBe('London');
      expect(londonForecast.length).toBe(3);
      expect(londonForecast[0].date).toBe('2026-10-23');
      expect(londonForecast[1].date).toBe('2026-10-24');
      expect(londonForecast[2].date).toBe('2026-10-25');
    });

    it('S1.2: validates footwear swaps to waterproof lug combat boots during Saturday downpour', () => {
      const sat = londonForecast[1];
      expect(sat.ootd?.layers.footwear.toLowerCase()).toMatch(/lug|combat|waterproof/);
      expect(sat.precipitationSum).toBeGreaterThanOrEqual(20);
    });

    it('S1.3: verifies inverted umbrella warning is triggered during Saturday gale wind (44 km/h)', () => {
      const sat = londonForecast[1];
      expect(sat.windSpeedMax).toBeGreaterThan(35);
      expect(sat.ootd?.tip.toLowerCase()).toContain('invert');
      expect(sat.ootd?.tip.toLowerCase()).toContain('hooded shell');
    });

    it('S1.4: locks Saturday activities strictly to indoor haven (vinyl & ramen)', () => {
      const sat = londonForecast[1];
      expect(sat.activities?.isIndoorPreferred).toBe(true);
      const text = (sat.activities!.primary + ' ' + sat.activities!.secondary).toLowerCase();
      expect(text).toMatch(/vinyl|ramen|cinema|indoor|thrift|matcha/);
    });

    it('S1.5: verifies Sunday clearing transitions back to outdoor Southbank stroll and chore jacket', () => {
      const sun = londonForecast[2];
      expect(sun.activities?.isIndoorPreferred).toBe(false);
      expect(sun.ootd?.layers.outerwear?.toLowerCase()).toMatch(/chore jacket|trench/);
    });
  });

  // =========================================================================
  // Scenario 2: Tokyo Spring Matcha Stroll
  // =========================================================================
  describe('Scenario 2: Tokyo Spring Matcha Stroll (5-Day Workload)', () => {
    const tokyoMetrics: Array<Omit<NormalizedForecastDay, 'ootd' | 'vibeCheck' | 'activities'>> = [
      {
        date: '2026-04-10',
        dayOfWeek: 'Friday',
        temperatureMax: 21.0,
        temperatureMin: 12.0,
        apparentTemperatureMax: 21.0,
        precipitationSum: 0.0,
        precipitationProbability: 5,
        windSpeedMax: 10.0,
        uvIndexMax: 4.8,
        weatherCode: 0,
        conditionCategory: 'clear',
        conditionLabel: 'Clear Sky',
        conditionEmoji: '☀️'
      },
      {
        date: '2026-04-11',
        dayOfWeek: 'Saturday',
        temperatureMax: 19.5,
        temperatureMin: 11.0,
        apparentTemperatureMax: 19.0,
        precipitationSum: 0.0,
        precipitationProbability: 10,
        windSpeedMax: 12.0,
        uvIndexMax: 4.5,
        weatherCode: 1,
        conditionCategory: 'clear',
        conditionLabel: 'Mainly Clear',
        conditionEmoji: '🌤️'
      },
      {
        date: '2026-04-12',
        dayOfWeek: 'Sunday',
        temperatureMax: 22.0,
        temperatureMin: 13.0,
        apparentTemperatureMax: 22.0,
        precipitationSum: 0.0,
        precipitationProbability: 0,
        windSpeedMax: 9.0,
        uvIndexMax: 5.2,
        weatherCode: 0,
        conditionCategory: 'clear',
        conditionLabel: 'Clear Sky',
        conditionEmoji: '☀️'
      },
      {
        date: '2026-04-13',
        dayOfWeek: 'Monday',
        temperatureMax: 18.5,
        temperatureMin: 10.5,
        apparentTemperatureMax: 18.0,
        precipitationSum: 0.0,
        precipitationProbability: 10,
        windSpeedMax: 14.0,
        uvIndexMax: 3.8,
        weatherCode: 2,
        conditionCategory: 'cloudy',
        conditionLabel: 'Partly Cloudy',
        conditionEmoji: '⛅'
      },
      {
        date: '2026-04-14',
        dayOfWeek: 'Tuesday',
        temperatureMax: 20.0,
        temperatureMin: 12.0,
        apparentTemperatureMax: 20.0,
        precipitationSum: 0.0,
        precipitationProbability: 5,
        windSpeedMax: 11.0,
        uvIndexMax: 4.6,
        weatherCode: 1,
        conditionCategory: 'clear',
        conditionLabel: 'Mainly Clear',
        conditionEmoji: '🌤️'
      }
    ];

    // Pass the daily metrics into genuine domain engines directly
    const tokyoForecast: NormalizedForecastDay[] = tokyoMetrics.map((metrics) => {
      const day = { ...metrics } as NormalizedForecastDay;
      day.ootd = getOOTDRecommendation(day);
      day.vibeCheck = getVibeCheck(day);
      day.activities = getActivitySuggestions(day);
      return day;
    });

    it('S2.1: validates 5-day spring temperature stability between 18°C and 22°C', () => {
      expect(tokyoForecast.length).toBe(5);
      for (const day of tokyoForecast) {
        expect(day.temperatureMax).toBeGreaterThanOrEqual(18.0);
        expect(day.temperatureMax).toBeLessThanOrEqual(23.0);
        expect(day.temperatureMin).toBeGreaterThanOrEqual(10.0);
      }
    });

    it('S2.2: validates all 5 days avoid heavy winter coats in favor of light layers', () => {
      for (const day of tokyoForecast) {
        const outerwear = (day.ootd?.layers.outerwear ?? '').toLowerCase();
        expect(outerwear).not.toMatch(/heavy down|parka|puffer|arctic/);
        const top = (day.ootd?.layers.top ?? '').toLowerCase();
        expect(top).toMatch(/tee|tank|cardigan|breezy|linen|cotton/);
        expect(day.ootd?.avoidList.some(item => /heavy|wool|boots|puffer/i.test(item))).toBe(true);
      }
    });

    it('S2.3: verifies 100% of days recommend outdoor activities due to 0mm rainfall', () => {
      for (const day of tokyoForecast) {
        expect(day.precipitationSum).toBeLessThan(1.0);
        expect(day.activities?.isIndoorPreferred).toBe(false);
      }
    });

    it('S2.4: verifies vibe check headlines capture aesthetic spring slang', () => {
      const allHeadlines = tokyoForecast.map(d => d.vibeCheck?.headline ?? '').join(' ');
      expect(allHeadlines).toMatch(/character|sunshine|cozy|immaculate|aesthetic|golden|lofi|spring|vibe|aura/i);
    });

    it('S2.5: verifies curated activities include aesthetic outdoor activities and picnic/polaroids', () => {
      const allActivityText = tokyoForecast
        .flatMap(d => (d.activities?.items ?? []).flatMap(a => [a.name, a.description, a.tag]))
        .join(' ')
        .toLowerCase();
      expect(allActivityText).toMatch(/picnic|polaroid|sunset|rooftop|skate|matcha/i);
    });
  });
});
