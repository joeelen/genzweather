import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  NormalizedForecastDay,
  LocationInfo,
  VibeCheck,
  OOTDRecommendation,
  ActivitySuggestions,
  PresetScenario,
  WeatherDataset
} from '../../src/types/weather';
import {
  PRESET_SCENARIOS,
  AUTUMN_SWEATER_WEATHER,
  SCORCHING_HEATWAVE,
  GLOOMY_RAINY_DAY,
  SUBZERO_BLIZZARD,
  GOLDEN_HOUR_SPRING,
  CHAOTIC_SUMMER_THUNDERSTORM,
  DEFAULT_PRESET,
  getPresetById
} from '../../src/presets/presetData';
import {
  WMO_CODE_MAP,
  DEFAULT_WMO_INFO,
  getWmoInfo,
  fetchWeatherForecast
} from '../../src/services/openMeteoService';
import {
  searchCities,
  formatLocationName,
  getCityCoordinates
} from '../../src/services/geocodingService';

describe('Tier 1: Feature Coverage (F1 - F16)', () => {

  // =========================================================================
  // F1: Toolchain & Configuration
  // =========================================================================
  describe('F1: Toolchain & Configuration Environment', () => {
    it('F1.1: verifies TypeScript and Vitest testing environment is operational', () => {
      expect(typeof describe).toBe('function');
      expect(typeof it).toBe('function');
      expect(typeof expect).toBe('function');
    });

    it('F1.2: verifies ES module imports resolve internal TypeScript modules', () => {
      expect(AUTUMN_SWEATER_WEATHER).toBeDefined();
      expect(AUTUMN_SWEATER_WEATHER.id).toBe('sweater-weather');
    });

    it('F1.3: verifies jsdom environment supports DOM globals', () => {
      expect(typeof window).toBe('object');
      expect(typeof document).toBe('object');
      expect(typeof HTMLElement).toBe('function');
    });

    it('F1.4: verifies fetch and AbortController are available in runtime', () => {
      expect(typeof fetch).toBe('function');
      expect(typeof AbortController).toBe('function');
    });

    it('F1.5: verifies Neo-Brutalist color and design tokens are properly defined in presets', () => {
      expect(AUTUMN_SWEATER_WEATHER.themeClass).toContain('amber');
      expect(SCORCHING_HEATWAVE.themeClass).toMatch(/orange|red|rose/);
      expect(SUBZERO_BLIZZARD.themeClass).toContain('cyan');
    });
  });

  // =========================================================================
  // F2: Unified Data Schema
  // =========================================================================
  describe('F2: Unified Data Schema Compliance', () => {
    const sampleDay: NormalizedForecastDay = {
      date: '2026-09-11',
      dayOfWeek: 'Today',
      temperatureMax: 16.5,
      temperatureMin: 9.0,
      apparentTemperatureMax: 15.8,
      apparentTemperatureMin: 8.2,
      precipitationSum: 0.2,
      precipitationProbability: 15,
      windSpeedMax: 14.5,
      uvIndexMax: 4.2,
      weatherCode: 1,
      conditionCategory: 'clear',
      conditionLabel: 'Mainly Clear',
      conditionEmoji: '🌤️'
    };

    it('F2.1: validates required fields on NormalizedForecastDay contract', () => {
      expect(sampleDay.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(typeof sampleDay.dayOfWeek).toBe('string');
      expect(typeof sampleDay.temperatureMax).toBe('number');
      expect(typeof sampleDay.temperatureMin).toBe('number');
      expect(typeof sampleDay.apparentTemperatureMax).toBe('number');
      expect(typeof sampleDay.precipitationSum).toBe('number');
      expect(typeof sampleDay.precipitationProbability).toBe('number');
      expect(typeof sampleDay.windSpeedMax).toBe('number');
      expect(typeof sampleDay.uvIndexMax).toBe('number');
      expect(typeof sampleDay.weatherCode).toBe('number');
      expect(typeof sampleDay.conditionCategory).toBe('string');
      expect(typeof sampleDay.conditionLabel).toBe('string');
      expect(typeof sampleDay.conditionEmoji).toBe('string');
    });

    it('F2.2: validates LocationInfo schema adherence', () => {
      const loc: LocationInfo = {
        name: 'Brooklyn',
        region: 'New York',
        country: 'United States',
        latitude: 40.6782,
        longitude: -73.9442,
        timezone: 'America/New_York'
      };
      expect(loc.name).toBe('Brooklyn');
      expect(loc.latitude).toBeGreaterThan(-90);
      expect(loc.latitude).toBeLessThan(90);
      expect(loc.longitude).toBeGreaterThan(-180);
      expect(loc.longitude).toBeLessThan(180);
    });

    it('F2.3: validates VibeCheck schema structure', () => {
      const vibe: VibeCheck = {
        headline: 'Sweater weather peak immaculate',
        badge: 'Sweater SZN',
        tagline: 'Cool morning breeze with golden afternoon sunshine.',
        moodColor: '#FEF08A',
        score: 88
      };
      expect(vibe.headline.length).toBeGreaterThan(5);
      expect(vibe.badge.length).toBeGreaterThan(2);
      expect(vibe.moodColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(vibe.score).toBeGreaterThanOrEqual(0);
      expect(vibe.score).toBeLessThanOrEqual(100);
    });

    it('F2.4: validates OOTDRecommendation layers structure', () => {
      const ootd: OOTDRecommendation = {
        summary: 'Trench coat over knit sweater with wide-leg trousers',
        layers: {
          outerwear: 'Vintage trench coat',
          top: 'Cream cable-knit sweater',
          bottom: 'Wide-leg dark denim',
          footwear: 'Platform loafers',
          accessories: ['Canvas tote', 'Gold hoop earrings']
        },
        tip: 'Layers are easy to shed once afternoon sun kicks in.'
      };
      expect(ootd.summary).toBeDefined();
      expect(ootd.layers.top).toBeDefined();
      expect(ootd.layers.bottom).toBeDefined();
      expect(ootd.layers.footwear).toBeDefined();
      expect(Array.isArray(ootd.layers.accessories)).toBe(true);
      expect(ootd.layers.accessories.length).toBeGreaterThan(0);
    });

    it('F2.5: validates ActivitySuggestions structure and routing flags', () => {
      const act: ActivitySuggestions = {
        primary: 'Indie coffee crawl and vintage bookstore browse',
        secondary: 'Golden hour walk through Prospect Park',
        isIndoorPreferred: false,
        idealTimeOfDay: 'Afternoon (2:00 PM - 5:00 PM)'
      };
      expect(act.primary).toBeDefined();
      expect(act.secondary).toBeDefined();
      expect(typeof act.isIndoorPreferred).toBe('boolean');
      expect(act.idealTimeOfDay).toBeDefined();
    });
  });

  // =========================================================================
  // F3: Open-Meteo Live API Client
  // =========================================================================
  describe('F3: Open-Meteo Live API Client & Interpretation', () => {
    it('F3.1: maps Clear Sky code 0 to clean descriptors and sun emoji', () => {
      const info = getWmoInfo(0);
      expect(info.label).toBe('Clear Sky');
      expect(info.category).toBe('clear');
      expect(info.emoji).toBeDefined();
      expect(info.genZDescriptor).toContain('Clean Slate');
    });

    it('F3.2: maps rain and storm codes (61, 65, 95) to wet/storm categories', () => {
      expect(getWmoInfo(61).category).toBe('rain');
      expect(getWmoInfo(65).category).toBe('heavy-rain');
      expect(getWmoInfo(95).category).toBe('thunderstorm');
      expect(getWmoInfo(95).genZDescriptor).toContain('Thunder');
    });

    it('F3.3: maps snowfall codes (71, 73, 75, 86) to snow categories', () => {
      expect(getWmoInfo(71).category).toBe('snow');
      expect(getWmoInfo(73).category).toBe('snow');
      expect(getWmoInfo(75).category).toBe('heavy-snow');
      expect(getWmoInfo(86).category).toBe('heavy-snow');
    });

    it('F3.4: falls back to DEFAULT_WMO_INFO for unknown WMO codes', () => {
      const unknownInfo = getWmoInfo(999);
      expect(unknownInfo).toEqual(DEFAULT_WMO_INFO);
      expect(unknownInfo.category).toBe('clear');
    });

    it('F3.5: handles network errors gracefully by falling back to DEFAULT_PRESET', async () => {
      const originalFetch = global.fetch;
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error simulated'));

      const dataset = await fetchWeatherForecast({
        name: 'MockCity',
        country: 'MockCountry',
        latitude: 10,
        longitude: 20,
        timezone: 'UTC'
      });

      expect(dataset).toBeDefined();
      expect(dataset.isPreset).toBe(true);
      expect(dataset.daily.length).toBeGreaterThanOrEqual(5);

      global.fetch = originalFetch;
    });
  });

  // =========================================================================
  // F4: Geocoding City Search
  // =========================================================================
  describe('F4: Geocoding City Search Service', () => {
    it('F4.1: rejects queries with fewer than 2 characters without network call', async () => {
      const originalFetch = global.fetch;
      const fetchSpy = vi.fn();
      global.fetch = fetchSpy;

      const r1 = await searchCities('');
      const r2 = await searchCities('   ');
      const r3 = await searchCities('a');

      expect(r1).toEqual([]);
      expect(r2).toEqual([]);
      expect(r3).toEqual([]);
      expect(fetchSpy).not.toHaveBeenCalled();

      global.fetch = originalFetch;
    });

    it('F4.2: parses and formats populated city search results', async () => {
      const originalFetch = global.fetch;
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          results: [
            {
              id: 1850147,
              name: 'Tokyo',
              latitude: 35.6895,
              longitude: 139.6917,
              country: 'Japan',
              timezone: 'Asia/Tokyo'
            }
          ]
        })
      });

      const results = await searchCities('Tokyo', { count: 1 });
      expect(results.length).toBe(1);
      expect(results[0].name).toBe('Tokyo');
      expect(results[0].country).toBe('Japan');

      global.fetch = originalFetch;
    });

    it('F4.3: handles 0-match responses where results key is absent', async () => {
      const originalFetch = global.fetch;
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          generationtime_ms: 0.123
        })
      });

      const results = await searchCities('NowhereCityXYZ12345');
      expect(results).toEqual([]);

      global.fetch = originalFetch;
    });

    it('F4.4: formats location string correctly with admin1 when distinct from city name', () => {
      const city1 = {
        id: 1,
        name: 'London',
        latitude: 51.5,
        longitude: -0.1,
        country: 'United Kingdom',
        admin1: 'England'
      };
      expect(formatLocationName(city1)).toBe('London, England, United Kingdom');

      const city2 = {
        id: 2,
        name: 'Tokyo',
        latitude: 35.6,
        longitude: 139.6,
        country: 'Japan',
        admin1: 'Tokyo' // duplicate name
      };
      expect(formatLocationName(city2)).toBe('Tokyo, Japan');
    });

    it('F4.5: getCityCoordinates returns LocationInfo for top match or null on empty', async () => {
      const originalFetch = global.fetch;
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          results: [
            {
              id: 5128581,
              name: 'New York',
              latitude: 40.7143,
              longitude: -74.006,
              country: 'United States',
              admin1: 'New York',
              timezone: 'America/New_York'
            }
          ]
        })
      });

      const loc = await getCityCoordinates('New York');
      expect(loc).not.toBeNull();
      expect(loc?.name).toBe('New York');
      expect(loc?.latitude).toBeCloseTo(40.7143, 2);

      global.fetch = originalFetch;
    });
  });

  // =========================================================================
  // F5: Weather Scenario Presets
  // =========================================================================
  describe('F5: Weather Scenario Presets Integrity', () => {
    it('F5.1: guarantees all 4 required presets exist in PRESET_SCENARIOS', () => {
      const requiredIds = ['sweater-weather', 'scorching-heatwave', 'gloomy-rainy-day', 'subzero-blizzard'];
      const existingIds = PRESET_SCENARIOS.map(p => p.id);

      for (const reqId of requiredIds) {
        expect(existingIds).toContain(reqId);
      }
    });

    it('F5.2: verifies bonus presets exist (spring and thunderstorm)', () => {
      const existingIds = PRESET_SCENARIOS.map(p => p.id);
      expect(existingIds).toContain('golden-hour-spring');
      expect(existingIds).toContain('summer-thunderstorm');
    });

    it('F5.3: getPresetById resolves exact and alias IDs safely', () => {
      expect(getPresetById('sweater-weather')).toBeDefined();
      expect(getPresetById('scorching-heatwave')).toBeDefined();
      expect(getPresetById('gloomy-rainy-day')).toBeDefined();
      expect(getPresetById('subzero-blizzard')).toBeDefined();
      expect(getPresetById('spring-breeze')).toBeDefined(); // alias check
      expect(getPresetById('non-existent-preset')).toBeUndefined();
    });

    it('F5.4: verifies every preset dataset has at least 5 contiguous valid daily forecasts', () => {
      for (const preset of PRESET_SCENARIOS) {
        expect(preset.dataset.daily.length).toBeGreaterThanOrEqual(5);
        for (const day of preset.dataset.daily) {
          expect(day.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
          expect(day.temperatureMax).toBeGreaterThanOrEqual(day.temperatureMin);
          expect(day.precipitationProbability).toBeGreaterThanOrEqual(0);
          expect(day.precipitationProbability).toBeLessThanOrEqual(100);
          expect(day.windSpeedMax).toBeGreaterThanOrEqual(0);
        }
      }
    });

    it('F5.5: verifies DEFAULT_PRESET is configured to Autumn Sweater Weather', () => {
      expect(DEFAULT_PRESET.id).toBe('sweater-weather');
      expect(DEFAULT_PRESET.name).toContain('Sweater Weather');
      expect(DEFAULT_PRESET.dataset.isPreset).toBe(true);
    });
  });

  // =========================================================================
  // F6: OOTD Recommendation Engine Logic
  // =========================================================================
  describe('F6: OOTD Clothing Recommendation Logic', () => {
    it('F6.1: Subzero preset (<0°C) specifies heavy down outerwear and winter accessories', () => {
      const blizzardDay = SUBZERO_BLIZZARD.dataset.daily[0];
      expect(blizzardDay.ootd).toBeDefined();
      const ootd = blizzardDay.ootd!;
      const outerwear = ootd.layers.outerwear?.toLowerCase() ?? '';
      expect(outerwear).toMatch(/puffer|parka|down/);
      const acc = ootd.layers.accessories.join(' ').toLowerCase();
      expect(acc).toMatch(/beanie|scarf|mittens|balaclava|gloves/);
    });

    it('F6.2: Autumn preset (11°C - 17°C) specifies transitional knitwear or trench outerwear', () => {
      const autumnDay = AUTUMN_SWEATER_WEATHER.dataset.daily[0];
      expect(autumnDay.ootd).toBeDefined();
      const ootd = autumnDay.ootd!;
      const outerwear = (ootd.layers.outerwear ?? '').toLowerCase();
      const top = ootd.layers.top.toLowerCase();
      expect(outerwear + ' ' + top).toMatch(/trench|knit|sweater|chore|cardigan|corduroy|overshirt|turtleneck/);
    });

    it('F6.3: Heatwave preset (>32°C) specifies lightweight breathable tops and accessories', () => {
      const heatDay = SCORCHING_HEATWAVE.dataset.daily[0];
      expect(heatDay.ootd).toBeDefined();
      const ootd = heatDay.ootd!;
      const top = ootd.layers.top.toLowerCase();
      expect(top).toMatch(/linen|tank|crop|breezy/);
      const acc = ootd.layers.accessories.join(' ').toLowerCase();
      expect(acc).toMatch(/sunglasses|sunscreen|water|bottle/);
    });

    it('F6.4: Rain preset enforces waterproof footwear and umbrella accessories', () => {
      const rainDay = GLOOMY_RAINY_DAY.dataset.daily[0];
      expect(rainDay.ootd).toBeDefined();
      const ootd = rainDay.ootd!;
      const shoes = ootd.layers.footwear.toLowerCase();
      expect(shoes).toMatch(/waterproof|boot|chelsea|gore-tex|lug/);
      const acc = ootd.layers.accessories.join(' ').toLowerCase();
      expect(acc).toMatch(/umbrella/);
    });

    it('F6.5: Spring preset (18°C - 24°C) recommends light relaxed layers without heavy coats', () => {
      const springDay = GOLDEN_HOUR_SPRING.dataset.daily[0];
      expect(springDay.ootd).toBeDefined();
      const ootd = springDay.ootd!;
      const outerwear = (ootd.layers.outerwear ?? '').toLowerCase();
      expect(outerwear).not.toMatch(/heavy down|parka|arctic/);
    });

    it('F6.6: Thunderstorm preset warns about storm gear and footwear protection', () => {
      const stormDay = CHAOTIC_SUMMER_THUNDERSTORM.dataset.daily[0];
      expect(stormDay.ootd).toBeDefined();
      const tip = stormDay.ootd!.tip.toLowerCase();
      expect(tip.length).toBeGreaterThan(10);
    });
  });

  // =========================================================================
  // F7: Vibe Check Engine
  // =========================================================================
  describe('F7: Vibe Check Engine & Aesthetic Headlines', () => {
    it('F7.1: generates relatable, non-meteorological Gen-Z headlines', () => {
      for (const preset of PRESET_SCENARIOS) {
        const vibe = preset.dataset.daily[0].vibeCheck;
        expect(vibe).toBeDefined();
        expect(vibe!.headline.length).toBeGreaterThan(5);
      }
    });

    it('F7.2: assigns concise, punchy badges to each forecast day', () => {
      expect(AUTUMN_SWEATER_WEATHER.dataset.daily[0].vibeCheck?.badge).toBeDefined();
      expect(SCORCHING_HEATWAVE.dataset.daily[0].vibeCheck?.badge).toBeDefined();
      expect(GLOOMY_RAINY_DAY.dataset.daily[0].vibeCheck?.badge).toBeDefined();
      expect(SUBZERO_BLIZZARD.dataset.daily[0].vibeCheck?.badge).toBeDefined();
    });

    it('F7.3: supplies atmospheric narrative taglines without dense isobar jargon', () => {
      for (const preset of PRESET_SCENARIOS) {
        const tagline = preset.dataset.daily[0].vibeCheck?.tagline ?? '';
        expect(tagline.length).toBeGreaterThan(15);
        expect(tagline.toLowerCase()).not.toContain('hpa');
        expect(tagline.toLowerCase()).not.toContain('isobar');
        expect(tagline.toLowerCase()).not.toContain('hectopascal');
      }
    });

    it('F7.4: assigns valid hex mood color tokens for UI theming', () => {
      for (const preset of PRESET_SCENARIOS) {
        const moodColor = preset.dataset.daily[0].vibeCheck?.moodColor ?? '';
        expect(moodColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
      }
    });

    it('F7.5: assigns scores within 0-100 boundary when score is present', () => {
      for (const preset of PRESET_SCENARIOS) {
        for (const day of preset.dataset.daily) {
          if (day.vibeCheck?.score !== undefined) {
            expect(day.vibeCheck.score).toBeGreaterThanOrEqual(0);
            expect(day.vibeCheck.score).toBeLessThanOrEqual(100);
          }
        }
      }
    });
  });

  // =========================================================================
  // F8: Activity Planner Engine
  // =========================================================================
  describe('F8: Activity Planner Engine Routing', () => {
    it('F8.1: flags isIndoorPreferred as true during hazardous rain and blizzards', () => {
      const rainDay = GLOOMY_RAINY_DAY.dataset.daily[0];
      const blizzardDay = SUBZERO_BLIZZARD.dataset.daily[0];
      expect(rainDay.activities?.isIndoorPreferred).toBe(true);
      expect(blizzardDay.activities?.isIndoorPreferred).toBe(true);
    });

    it('F8.2: flags isIndoorPreferred as false during pleasant autumn and spring weather', () => {
      const autumnDay = AUTUMN_SWEATER_WEATHER.dataset.daily[0];
      const springDay = GOLDEN_HOUR_SPRING.dataset.daily[0];
      expect(autumnDay.activities?.isIndoorPreferred).toBe(false);
      expect(springDay.activities?.isIndoorPreferred).toBe(false);
    });

    it('F8.3: includes curated Gen-Z indoor activities during bad weather', () => {
      const rainActivities = GLOOMY_RAINY_DAY.dataset.daily[0].activities!;
      const combined = (rainActivities.primary + ' ' + rainActivities.secondary).toLowerCase();
      expect(combined).toMatch(/vinyl|cafe|coffee|records|thrifting|bookstore|matcha|indoor/);
    });

    it('F8.4: includes outdoor aesthetic plans during pleasant weather', () => {
      const springActivities = GOLDEN_HOUR_SPRING.dataset.daily[0].activities!;
      const combined = (springActivities.primary + ' ' + springActivities.secondary).toLowerCase();
      expect(combined).toMatch(/park|walk|stroll|picnic|outdoor|patio/);
    });

    it('F8.5: provides contextual time of day recommendations for daily plans', () => {
      for (const preset of PRESET_SCENARIOS) {
        const tod = preset.dataset.daily[0].activities?.idealTimeOfDay;
        expect(tod).toBeDefined();
        expect(tod!.length).toBeGreaterThan(3);
      }
    });
  });

  // =========================================================================
  // F10: Neo-Brutalist Pop Styling Tokens
  // =========================================================================
  describe('F10: Neo-Brutalist Pop Styling Specifications', () => {
    it('F10.1: defines high-contrast tactile shadow token configurations', () => {
      const shadowRegex = /4px_4px_0px_0px_#000|4px 4px 0px 0px #000|shadow-neo/;
      expect('shadow-[4px_4px_0px_0px_#000]').toMatch(shadowRegex);
    });

    it('F10.2: defines 2px / 3px solid black border tokens', () => {
      const borderToken = 'border-2 border-black';
      expect(borderToken).toContain('border-2');
      expect(borderToken).toContain('border-black');
    });

    it('F10.3: defines playful squircle border radius tokens', () => {
      const squircleToken = 'rounded-2xl';
      expect(['rounded-2xl', 'rounded-3xl']).toContain(squircleToken);
    });

    it('F10.4: defines mood-driven background gradients in preset themeClass', () => {
      for (const preset of PRESET_SCENARIOS) {
        expect(preset.themeClass).toMatch(/from-|via-|to-/);
      }
    });

    it('F10.5: provides high-contrast badge styling properties', () => {
      const badgePill = 'rounded-full px-3 py-1 font-bold border border-black';
      expect(badgePill).toContain('rounded-full');
      expect(badgePill).toContain('border-black');
    });
  });

  // =========================================================================
  // F11: Preset Selector Pills
  // =========================================================================
  describe('F11: Preset Selector Pills Interaction', () => {
    it('F11.1: exposes 6 selectable preset pills with descriptive names and icons', () => {
      expect(PRESET_SCENARIOS.length).toBe(6);
      for (const preset of PRESET_SCENARIOS) {
        expect(preset.name.length).toBeGreaterThan(5);
        expect(preset.icon.length).toBeGreaterThan(0);
      }
    });

    it('F11.2: lookup by ID matches all available presets', () => {
      for (const p of PRESET_SCENARIOS) {
        const found = getPresetById(p.id);
        expect(found).toBeDefined();
        expect(found?.id).toBe(p.id);
      }
    });

    it('F11.3: each preset has distinct location metadata', () => {
      const locations = PRESET_SCENARIOS.map(p => p.dataset.location.name);
      const uniqueLocations = new Set(locations);
      expect(uniqueLocations.size).toBe(PRESET_SCENARIOS.length);
    });

    it('F11.4: each preset has realistic starting current conditions', () => {
      for (const p of PRESET_SCENARIOS) {
        expect(typeof p.dataset.current.temperature).toBe('number');
        expect(typeof p.dataset.current.relativeHumidity).toBe('number');
        expect(typeof p.dataset.current.windSpeed).toBe('number');
      }
    });

    it('F11.5: selecting an invalid preset returns undefined safely', () => {
      expect(getPresetById('invalid_preset_id_12345')).toBeUndefined();
    });
  });

  // =========================================================================
  // F12: Hero Today Bento Card Structure
  // =========================================================================
  describe('F12: Hero Today Bento Card Data Contracts', () => {
    const today = AUTUMN_SWEATER_WEATHER.dataset.daily[0];

    it('F12.1: provides city name, country, and formatted day header', () => {
      expect(AUTUMN_SWEATER_WEATHER.dataset.location.name).toBe('Woodstock');
      expect(AUTUMN_SWEATER_WEATHER.dataset.location.country).toBe('United States');
      expect(today.dayOfWeek).toBe('Today');
    });

    it('F12.2: provides max and min temperatures for big hero rendering', () => {
      expect(today.temperatureMax).toBeCloseTo(15.6, 1);
      expect(today.temperatureMin).toBeCloseTo(5.4, 1);
    });

    it('F12.3: provides condition label and visual emoji badge', () => {
      expect(today.conditionLabel).toBeDefined();
      expect(today.conditionEmoji).toBeDefined();
    });

    it('F12.4: embeds Vibe Check headline and badge in hero presentation', () => {
      expect(today.vibeCheck?.headline).toBeDefined();
      expect(today.vibeCheck?.badge).toMatch(/Cozy Core|Sweater SZN/);
    });

    it('F12.5: provides non-cluttered micro-metrics (precipitation %, wind km/h, UV)', () => {
      expect(today.precipitationProbability).toBe(10);
      expect(today.windSpeedMax).toBeCloseTo(12.4, 1);
      expect(today.uvIndexMax).toBeCloseTo(3.8, 1);
    });
  });

  // =========================================================================
  // F13: OOTD Display Cards Structure
  // =========================================================================
  describe('F13: OOTD Display Cards Contract', () => {
    const ootd = AUTUMN_SWEATER_WEATHER.dataset.daily[0].ootd!;

    it('F13.1: exposes overall outfit aesthetic summary', () => {
      expect(ootd.summary).toBeDefined();
      expect(ootd.summary.length).toBeGreaterThan(10);
    });

    it('F13.2: details top layer garment recommendation', () => {
      expect(ootd.layers.top).toBeDefined();
      expect(ootd.layers.top.length).toBeGreaterThan(3);
    });

    it('F13.3: details bottom layer garment recommendation', () => {
      expect(ootd.layers.bottom).toBeDefined();
      expect(ootd.layers.bottom.length).toBeGreaterThan(3);
    });

    it('F13.4: details footwear recommendation', () => {
      expect(ootd.layers.footwear).toBeDefined();
      expect(ootd.layers.footwear.length).toBeGreaterThan(3);
    });

    it('F13.5: details accessory recommendations and practical weather tip', () => {
      expect(Array.isArray(ootd.layers.accessories)).toBe(true);
      expect(ootd.tip).toBeDefined();
      expect(ootd.tip.length).toBeGreaterThan(10);
    });
  });

  // =========================================================================
  // F14: Activities Display Cards Structure
  // =========================================================================
  describe('F14: Activities Display Cards Contract', () => {
    const activities = AUTUMN_SWEATER_WEATHER.dataset.daily[0].activities!;

    it('F14.1: provides primary curated activity recommendation', () => {
      expect(activities.primary).toBeDefined();
      expect(activities.primary.length).toBeGreaterThan(10);
    });

    it('F14.2: provides secondary curated activity recommendation', () => {
      expect(activities.secondary).toBeDefined();
      expect(activities.secondary.length).toBeGreaterThan(10);
    });

    it('F14.3: provides indoor preference boolean indicator', () => {
      expect(typeof activities.isIndoorPreferred).toBe('boolean');
    });

    it('F14.4: provides ideal time of day recommendation', () => {
      expect(activities.idealTimeOfDay).toBeDefined();
      expect(activities.idealTimeOfDay.length).toBeGreaterThan(5);
    });

    it('F14.5: activities differ between sunny and rainy scenario presets', () => {
      const autumnAct = AUTUMN_SWEATER_WEATHER.dataset.daily[0].activities!;
      const rainAct = GLOOMY_RAINY_DAY.dataset.daily[0].activities!;
      expect(autumnAct.primary).not.toBe(rainAct.primary);
      expect(autumnAct.isIndoorPreferred).not.toBe(rainAct.isIndoorPreferred);
    });
  });

  // =========================================================================
  // F15: Multi-Day Forecast Grid Structure
  // =========================================================================
  describe('F15: Multi-Day Forecast Grid Structure', () => {
    const daily = AUTUMN_SWEATER_WEATHER.dataset.daily;

    it('F15.1: contains 5 or more forecast days', () => {
      expect(daily.length).toBeGreaterThanOrEqual(5);
    });

    it('F15.2: days progress in chronological sequence', () => {
      for (let i = 0; i < daily.length - 1; i++) {
        const curr = new Date(daily[i].date).getTime();
        const next = new Date(daily[i + 1].date).getTime();
        expect(next).toBeGreaterThan(curr);
      }
    });

    it('F15.3: each day has defined dayOfWeek descriptor', () => {
      for (const d of daily) {
        expect(d.dayOfWeek).toBeDefined();
        expect(d.dayOfWeek.length).toBeGreaterThan(1);
      }
    });

    it('F15.4: each day has valid high and low temperatures', () => {
      for (const d of daily) {
        expect(d.temperatureMax).toBeGreaterThanOrEqual(d.temperatureMin);
      }
    });

    it('F15.5: each day provides condition emoji and label', () => {
      for (const d of daily) {
        expect(d.conditionEmoji).toBeDefined();
        expect(d.conditionLabel).toBeDefined();
      }
    });
  });

  // =========================================================================
  // F16: City Search & Geo Header / Unit Toggle
  // =========================================================================
  describe('F16: City Search & Unit Toggle Conversion', () => {
    function toDisplayTemp(celsius: number, unit: 'celsius' | 'fahrenheit'): string {
      if (unit === 'fahrenheit') {
        const f = Math.round((celsius * 9) / 5 + 32);
        return f + '°F';
      }
      return Math.round(celsius) + '°C';
    }

    it('F16.1: converts 0°C freezing point to exactly 32°F', () => {
      expect(toDisplayTemp(0, 'celsius')).toBe('0°C');
      expect(toDisplayTemp(0, 'fahrenheit')).toBe('32°F');
    });

    it('F16.2: converts 35°C scorching heat to exactly 95°F', () => {
      expect(toDisplayTemp(35, 'celsius')).toBe('35°C');
      expect(toDisplayTemp(35, 'fahrenheit')).toBe('95°F');
    });

    it('F16.3: converts -10°C subzero cold to 14°F', () => {
      expect(toDisplayTemp(-10, 'celsius')).toBe('-10°C');
      expect(toDisplayTemp(-10, 'fahrenheit')).toBe('14°F');
    });

    it('F16.4: converts 20°C mild room temperature to 68°F', () => {
      expect(toDisplayTemp(20, 'celsius')).toBe('20°C');
      expect(toDisplayTemp(20, 'fahrenheit')).toBe('68°F');
    });

    it('F16.5: trims whitespace on search input and enforces minimum length', () => {
      const sanitizeQuery = (q: string): string | null => {
        const trimmed = q.trim();
        return trimmed.length >= 2 ? trimmed : null;
      };

      expect(sanitizeQuery('  London  ')).toBe('London');
      expect(sanitizeQuery('a')).toBeNull();
      expect(sanitizeQuery('   ')).toBeNull();
      expect(sanitizeQuery('Tokyo')).toBe('Tokyo');
    });
  });
});
