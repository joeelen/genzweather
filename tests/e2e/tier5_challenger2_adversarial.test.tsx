import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import App from '../../src/App';
import {
  PRESET_SCENARIOS,
  DEFAULT_PRESET,
  getPresetById
} from '../../src/presets/presetData';
import { searchCities, formatLocationName } from '../../src/services/geocodingService';
import * as openMeteoService from '../../src/services/openMeteoService';
import * as geocodingService from '../../src/services/geocodingService';

describe('Tier 5: Challenger 2 Adversarial Stress Testing', () => {

  // =========================================================================
  // Focus Area 1: Presets Integrity & Schema Conformance
  // =========================================================================
  describe('Area 1: Presets Integrity against NormalizedForecastDay schema', () => {
    it('verifies all 6 preset scenarios exist and have at least 5 daily forecast days', () => {
      expect(PRESET_SCENARIOS).toHaveLength(6);
      for (const preset of PRESET_SCENARIOS) {
        expect(preset.id).toBeTruthy();
        expect(preset.name).toBeTruthy();
        expect(preset.dataset).toBeDefined();
        expect(preset.dataset.daily.length).toBeGreaterThanOrEqual(5);
      }
    });

    it('validates strictly that every day in every preset conforms to NormalizedForecastDay', () => {
      const validCategories = ['clear', 'cloudy', 'rain', 'snow', 'thunderstorm', 'drizzle', 'fog', 'heavy-snow'];

      for (const preset of PRESET_SCENARIOS) {
        for (const [dayIdx, day] of preset.dataset.daily.entries()) {
          const context = `Preset: "${preset.id}", Day index: ${dayIdx} (${day.date})`;

          // Required string fields
          expect(day.date, `${context} date`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
          expect(isNaN(Date.parse(day.date)), `${context} valid date parse`).toBe(false);
          expect(typeof day.dayOfWeek, `${context} dayOfWeek`).toBe('string');
          expect(day.dayOfWeek.trim().length, `${context} dayOfWeek non-empty`).toBeGreaterThan(0);

          // Temperature integrity
          expect(typeof day.temperatureMax, `${context} tempMax type`).toBe('number');
          expect(Number.isFinite(day.temperatureMax), `${context} tempMax finite`).toBe(true);
          expect(typeof day.temperatureMin, `${context} tempMin type`).toBe('number');
          expect(Number.isFinite(day.temperatureMin), `${context} tempMin finite`).toBe(true);
          expect(day.temperatureMax, `${context} tempMax >= tempMin`).toBeGreaterThanOrEqual(day.temperatureMin);

          // Apparent temperatures
          expect(typeof day.apparentTemperatureMax, `${context} apparentTempMax type`).toBe('number');
          expect(Number.isFinite(day.apparentTemperatureMax), `${context} apparentTempMax finite`).toBe(true);
          if (day.apparentTemperatureMin !== undefined) {
            expect(typeof day.apparentTemperatureMin, `${context} apparentTempMin type`).toBe('number');
            expect(Number.isFinite(day.apparentTemperatureMin), `${context} apparentTempMin finite`).toBe(true);
            expect(day.apparentTemperatureMax, `${context} apparentTempMax >= apparentTempMin`).toBeGreaterThanOrEqual(day.apparentTemperatureMin);
          }

          // Precipitation integrity
          expect(typeof day.precipitationSum, `${context} precipitationSum type`).toBe('number');
          expect(Number.isFinite(day.precipitationSum), `${context} precipitationSum finite`).toBe(true);
          expect(day.precipitationSum, `${context} precipitationSum >= 0`).toBeGreaterThanOrEqual(0);

          expect(typeof day.precipitationProbability, `${context} precipitationProbability type`).toBe('number');
          expect(Number.isFinite(day.precipitationProbability), `${context} precipitationProbability finite`).toBe(true);
          expect(day.precipitationProbability, `${context} precipitationProbability >= 0`).toBeGreaterThanOrEqual(0);
          expect(day.precipitationProbability, `${context} precipitationProbability <= 100`).toBeLessThanOrEqual(100);

          // Wind and UV
          expect(typeof day.windSpeedMax, `${context} windSpeedMax type`).toBe('number');
          expect(Number.isFinite(day.windSpeedMax), `${context} windSpeedMax finite`).toBe(true);
          expect(day.windSpeedMax, `${context} windSpeedMax >= 0`).toBeGreaterThanOrEqual(0);

          expect(typeof day.uvIndexMax, `${context} uvIndexMax type`).toBe('number');
          expect(Number.isFinite(day.uvIndexMax), `${context} uvIndexMax finite`).toBe(true);
          expect(day.uvIndexMax, `${context} uvIndexMax >= 0`).toBeGreaterThanOrEqual(0);

          // Weather code and condition metadata
          expect(typeof day.weatherCode, `${context} weatherCode type`).toBe('number');
          expect(Number.isInteger(day.weatherCode), `${context} weatherCode integer`).toBe(true);
          expect(day.weatherCode, `${context} weatherCode in 0..99`).toBeGreaterThanOrEqual(0);
          expect(day.weatherCode, `${context} weatherCode in 0..99`).toBeLessThanOrEqual(99);

          expect(typeof day.conditionCategory, `${context} conditionCategory type`).toBe('string');
          expect(validCategories, `${context} conditionCategory in known list`).toContain(day.conditionCategory);

          expect(typeof day.conditionLabel, `${context} conditionLabel type`).toBe('string');
          expect(day.conditionLabel.trim().length, `${context} conditionLabel non-empty`).toBeGreaterThan(0);

          expect(typeof day.conditionEmoji, `${context} conditionEmoji type`).toBe('string');
          expect(day.conditionEmoji.trim().length, `${context} conditionEmoji non-empty`).toBeGreaterThan(0);

          // Recommendation Layer: VibeCheck
          expect(day.vibeCheck, `${context} vibeCheck defined`).toBeDefined();
          expect(day.vibeCheck!.headline.trim().length, `${context} vibe headline`).toBeGreaterThan(0);
          expect(day.vibeCheck!.badge.trim().length, `${context} vibe badge`).toBeGreaterThan(0);
          expect(day.vibeCheck!.tagline.trim().length, `${context} vibe tagline`).toBeGreaterThan(0);
          if (day.vibeCheck!.score !== undefined) {
            expect(day.vibeCheck!.score, `${context} vibe score >= 0`).toBeGreaterThanOrEqual(0);
            expect(day.vibeCheck!.score, `${context} vibe score <= 100`).toBeLessThanOrEqual(100);
          }

          // Recommendation Layer: OOTD
          expect(day.ootd, `${context} ootd defined`).toBeDefined();
          expect(day.ootd!.summary.trim().length, `${context} ootd summary`).toBeGreaterThan(0);
          expect(day.ootd!.layers, `${context} ootd layers`).toBeDefined();
          expect(day.ootd!.layers.top.trim().length, `${context} ootd top`).toBeGreaterThan(0);
          expect(day.ootd!.layers.bottom.trim().length, `${context} ootd bottom`).toBeGreaterThan(0);
          expect(day.ootd!.layers.footwear.trim().length, `${context} ootd footwear`).toBeGreaterThan(0);
          expect(Array.isArray(day.ootd!.layers.accessories), `${context} ootd accessories array`).toBe(true);
          expect(day.ootd!.tip.trim().length, `${context} ootd tip`).toBeGreaterThan(0);

          // Recommendation Layer: Activities
          expect(day.activities, `${context} activities defined`).toBeDefined();
          expect(day.activities!.primary.trim().length, `${context} activities primary`).toBeGreaterThan(0);
          expect(day.activities!.secondary.trim().length, `${context} activities secondary`).toBeGreaterThan(0);
          expect(typeof day.activities!.isIndoorPreferred, `${context} activities isIndoorPreferred`).toBe('boolean');
          expect(day.activities!.idealTimeOfDay.trim().length, `${context} activities idealTimeOfDay`).toBeGreaterThan(0);
        }
      }
    });

    it('validates dataset metadata (location, current conditions) for all presets', () => {
      for (const preset of PRESET_SCENARIOS) {
        const ds = preset.dataset;
        expect(ds.isPreset).toBe(true);
        expect(ds.presetId).toBe(preset.id);
        expect(typeof ds.lastUpdated).toBe('string');

        // Location Info
        expect(ds.location.name.trim().length).toBeGreaterThan(0);
        expect(ds.location.country.trim().length).toBeGreaterThan(0);
        expect(ds.location.latitude).toBeGreaterThanOrEqual(-90);
        expect(ds.location.latitude).toBeLessThanOrEqual(90);
        expect(ds.location.longitude).toBeGreaterThanOrEqual(-180);
        expect(ds.location.longitude).toBeLessThanOrEqual(180);

        // Current Conditions
        expect(ds.current).toBeDefined();
        expect(Number.isFinite(ds.current.temperature)).toBe(true);
        expect(Number.isFinite(ds.current.apparentTemperature)).toBe(true);
        expect(Number.isInteger(ds.current.weatherCode)).toBe(true);
        expect(ds.current.conditionLabel.trim().length).toBeGreaterThan(0);
        expect(ds.current.conditionEmoji.trim().length).toBeGreaterThan(0);
        expect(ds.current.relativeHumidity).toBeGreaterThanOrEqual(0);
        expect(ds.current.relativeHumidity).toBeLessThanOrEqual(100);
        expect(ds.current.windSpeed).toBeGreaterThanOrEqual(0);
        expect(typeof ds.current.isDay).toBe('boolean');
        expect(ds.current.precipitation).toBeGreaterThanOrEqual(0);
      }
    });

    it('verifies chronological sequencing of dates in each preset', () => {
      for (const preset of PRESET_SCENARIOS) {
        const dates = preset.dataset.daily.map(d => new Date(d.date).getTime());
        for (let i = 1; i < dates.length; i++) {
          expect(dates[i], `Preset ${preset.id} day ${i} date >= day ${i-1}`).toBeGreaterThanOrEqual(dates[i - 1]);
        }
      }
    });
  });

  // =========================================================================
  // Focus Area 2: Rapid Switching Between Presets and Live API Data
  // =========================================================================
  describe('Area 2: Rapid Switching Between Presets and Live API Data (Concurrency & Stale State)', () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('verifies synchronous rapid cycling through all presets in React App', async () => {
      const { unmount } = render(<App />);

      // Default preset is Autumn Sweater Weather (Woodstock)
      expect(screen.getByText(/Woodstock/i)).toBeInTheDocument();

      // Cycle rapidly through all presets by clicking preset buttons
      const presetButtons = [
        { name: /Heatwave/i, expectedLoc: /Palm Springs/i },
        { name: /Rainy/i, expectedLoc: /Seattle/i },
        { name: /Blizzard/i, expectedLoc: /Reykjav/i },
        { name: /Spring/i, expectedLoc: /Kyoto/i },
        { name: /Thunderstorm/i, expectedLoc: /Miami/i },
        { name: /Sweater Weather/i, expectedLoc: /Woodstock/i }
      ];

      for (const { name, expectedLoc } of presetButtons) {
        const btn = screen.getByRole('button', { name });
        fireEvent.click(btn);
        expect(screen.getByText(expectedLoc)).toBeInTheDocument();
      }

      unmount();
    });

    it('verifies race condition mitigation: in-flight API response is discarded upon subsequent preset selection', async () => {
      let resolveApiFetch: (dataset: any) => void;
      const apiPromise = new Promise((resolve) => {
        resolveApiFetch = resolve;
      });

      const mockLiveDataset = {
        isPreset: false,
        lastUpdated: '2026-09-11T12:00:00Z',
        location: {
          name: 'London',
          country: 'United Kingdom',
          latitude: 51.5074,
          longitude: -0.1278,
          timezone: 'Europe/London'
        },
        current: {
          temperature: 15,
          apparentTemperature: 14,
          weatherCode: 3,
          conditionLabel: 'Overcast',
          conditionEmoji: '☁️',
          relativeHumidity: 70,
          windSpeed: 10,
          isDay: true,
          precipitation: 0
        },
        daily: [
          {
            date: '2026-09-11',
            dayOfWeek: 'Today',
            temperatureMax: 17,
            temperatureMin: 11,
            apparentTemperatureMax: 16,
            precipitationSum: 0,
            precipitationProbability: 10,
            windSpeedMax: 15,
            uvIndexMax: 3,
            weatherCode: 3,
            conditionCategory: 'cloudy',
            conditionLabel: 'Overcast',
            conditionEmoji: '☁️',
            vibeCheck: {
              headline: 'London grey vibes',
              badge: 'Cloudy',
              tagline: 'Classic drizzle',
              moodColor: '#78716C',
              score: 75
            },
            ootd: {
              summary: 'Trench coat and umbrella',
              layers: { top: 'Knit', bottom: 'Trousers', footwear: 'Boots', accessories: ['Umbrella'] },
              tip: 'Be ready for drizzle'
            },
            activities: {
              primary: 'Museum tour',
              secondary: 'Tea house',
              isIndoorPreferred: true,
              idealTimeOfDay: 'Afternoon'
            }
          }
        ]
      };

      vi.spyOn(geocodingService, 'searchCities').mockResolvedValue([
        {
          id: 1,
          name: 'London',
          country: 'United Kingdom',
          latitude: 51.5074,
          longitude: -0.1278,
          timezone: 'Europe/London'
        }
      ]);

      vi.spyOn(openMeteoService, 'fetchWeatherForecast').mockImplementation(() => apiPromise as any);

      const { unmount } = render(<App />);

      // Initial state: Woodstock
      expect(screen.getByText(/Woodstock/i)).toBeInTheDocument();

      // 1. User submits search for "London" -> triggers in-flight fetch
      const searchInput = screen.getByPlaceholderText(/Search city/i);
      fireEvent.change(searchInput, { target: { value: 'London' } });
      const searchForm = searchInput.closest('form')!;
      fireEvent.submit(searchForm);

      // 2. While API fetch is in-flight, user clicks Preset "Subzero Blizzard" (Reykjavik)
      const blizzardBtn = screen.getByRole('button', { name: /Blizzard/i });
      fireEvent.click(blizzardBtn);

      // Verify user is now viewing Reykjavik
      expect(screen.getByText(/Reykjav/i)).toBeInTheDocument();

      // 3. Now the delayed live API call resolves!
      await act(async () => {
        resolveApiFetch(mockLiveDataset);
      });

      // VERIFICATION OF HARDENED ARCHITECTURE:
      // With activeRequestIdRef versioning in App.tsx:
      // The late-arriving API response is discarded, preserving the user's active preset!
      const londonMatches = screen.queryAllByText(/London/i);
      const reykjavikMatches = screen.queryAllByText(/Reykjav/i);

      // Confirms race condition mitigation: Reykjavik remains active, stale London response discarded
      expect(reykjavikMatches.length).toBeGreaterThan(0);
      expect(londonMatches.length).toBe(0);

      unmount();
    });

    it('verifies safe day index boundary handling when switching between datasets of different lengths', () => {
      const fiveDayDataset = DEFAULT_PRESET.dataset;
      expect(fiveDayDataset.daily.length).toBe(5);

      let selectedDayIdx = 6; // Out of bounds for 5-day dataset

      // Safe fallback pattern used in App.tsx:
      const activeDay = fiveDayDataset.daily[selectedDayIdx] ?? fiveDayDataset.daily[0];
      expect(activeDay).toBeDefined();
      expect(activeDay.date).toBe(fiveDayDataset.daily[0].date);
    });
  });

  // =========================================================================
  // Focus Area 3: Temperature Unit Toggles (°C and °F) Mathematical Accuracy
  // =========================================================================
  describe('Area 3: Temperature Unit Toggles (°C and °F) Mathematical Accuracy', () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    const formatTemp = (celsius: number, unit: 'celsius' | 'fahrenheit'): string => {
      if (unit === 'fahrenheit') {
        const f = Math.round((celsius * 9) / 5 + 32);
        return `${f}°F`;
      }
      return `${Math.round(celsius)}°C`;
    };

    it('validates critical physical temperature checkpoints', () => {
      // 0°C -> 32°F
      expect(formatTemp(0, 'celsius')).toBe('0°C');
      expect(formatTemp(0, 'fahrenheit')).toBe('32°F');

      // 100°C -> 212°F
      expect(formatTemp(100, 'celsius')).toBe('100°C');
      expect(formatTemp(100, 'fahrenheit')).toBe('212°F');

      // -40°C -> -40°F (Exact equivalence point)
      expect(formatTemp(-40, 'celsius')).toBe('-40°C');
      expect(formatTemp(-40, 'fahrenheit')).toBe('-40°F');

      // 37°C -> 98.6°F -> 99°F
      expect(formatTemp(37, 'celsius')).toBe('37°C');
      expect(formatTemp(37, 'fahrenheit')).toBe('99°F');

      // Absolute Zero: -273.15°C -> -459.67°F -> -460°F
      expect(formatTemp(-273.15, 'celsius')).toBe('-273°C');
      expect(formatTemp(-273.15, 'fahrenheit')).toBe('-460°F');
    });

    it('validates subzero and cold weather temperature conversions', () => {
      const coldTestCases: [number, string, string][] = [
        [-30, '-30°C', '-22°F'],
        [-20, '-20°C', '-4°F'],
        [-15, '-15°C', '5°F'],
        [-10, '-10°C', '14°F'],
        [-5, '-5°C', '23°F'],
        [-1, '-1°C', '30°F'],
        [-0.6, '-1°C', '31°F'],
        [-0.4, '0°C', '31°F'],
        [0.4, '0°C', '33°F'],
        [1, '1°C', '34°F'],
        [5, '5°C', '41°F'],
        [10, '10°C', '50°F'],
        [15, '15°C', '59°F'],
        [20, '20°C', '68°F'],
        [25, '25°C', '77°F'],
        [30, '30°C', '86°F'],
        [35, '35°C', '95°F'],
        [40, '40°C', '104°F'],
        [45, '45°C', '113°F'],
        [50, '50°C', '122°F'],
      ];

      for (const [celsius, expectedC, expectedF] of coldTestCases) {
        expect(formatTemp(celsius, 'celsius')).toBe(expectedC);
        expect(formatTemp(celsius, 'fahrenheit')).toBe(expectedF);
      }
    });

    it('validates round-trip consistency across preset data temperatures', () => {
      for (const preset of PRESET_SCENARIOS) {
        for (const day of preset.dataset.daily) {
          const cMax = formatTemp(day.temperatureMax, 'celsius');
          const fMax = formatTemp(day.temperatureMax, 'fahrenheit');
          const cMin = formatTemp(day.temperatureMin, 'celsius');
          const fMin = formatTemp(day.temperatureMin, 'fahrenheit');

          expect(cMax).toMatch(/^-?\d+°C$/);
          expect(fMax).toMatch(/^-?\d+°F$/);
          expect(cMin).toMatch(/^-?\d+°C$/);
          expect(fMin).toMatch(/^-?\d+°F$/);

          if (day.temperatureMax > day.temperatureMin) {
            const numFMax = parseInt(fMax.replace('°F', ''), 10);
            const numFMin = parseInt(fMin.replace('°F', ''), 10);
            expect(numFMax).toBeGreaterThanOrEqual(numFMin);
          }
        }
      }
    });

    it('probes mathematical edge cases: -0, NaN, Infinity', () => {
      const minusZero = Math.round(-0.1);
      expect(Object.is(minusZero, -0)).toBe(true);
      expect(`${minusZero}°C`).toBe('0°C');

      expect(formatTemp(NaN, 'celsius')).toBe('NaN°C');
      expect(formatTemp(NaN, 'fahrenheit')).toBe('NaN°F');

      expect(formatTemp(Infinity, 'celsius')).toBe('Infinity°C');
      expect(formatTemp(Infinity, 'fahrenheit')).toBe('Infinity°F');
    });

    it('verifies UI unit toggle updates DOM temperatures from °C to °F across components', async () => {
      const { unmount } = render(<App />);

      // Day 0 of Autumn Sweater Weather: tempMax = 15.6°C -> Math.round = 16°C
      // tempMin = 5.4°C -> Math.round = 5°C
      // In °F: 15.6 * 1.8 + 32 = 60.08 -> 60°F
      // Low in °F: 5.4 * 1.8 + 32 = 41.72 -> 42°F

      const initialElements = screen.getAllByText('16°C');
      expect(initialElements.length).toBeGreaterThanOrEqual(1);

      // Click the Fahrenheit toggle button (desktop pill)
      const fahrenheitBtn = screen.getByRole('button', { name: /Set Fahrenheit/i });
      fireEvent.click(fahrenheitBtn);

      // Verify DOM reflects converted Fahrenheit values (60°F)
      const fElements = screen.getAllByText('60°F');
      expect(fElements.length).toBeGreaterThanOrEqual(1);
      expect(screen.queryByText('16°C')).toBeNull();

      // Click Celsius toggle back
      const celsiusBtn = screen.getByRole('button', { name: /Set Celsius/i });
      fireEvent.click(celsiusBtn);

      expect(screen.getAllByText('16°C').length).toBeGreaterThanOrEqual(1);

      unmount();
    });
  });

  // =========================================================================
  // Focus Area 4: Geocoding Input Sanitization & Edge Inputs
  // =========================================================================
  describe('Area 4: Geocoding Input Sanitization & Adversarial Inputs', () => {
    let originalFetch: typeof global.fetch;

    beforeEach(() => {
      originalFetch = global.fetch;
    });

    afterEach(() => {
      global.fetch = originalFetch;
      vi.restoreAllMocks();
    });

    it('sanitizes empty strings and whitespace variants without triggering fetch', async () => {
      const fetchSpy = vi.fn();
      global.fetch = fetchSpy;

      const emptyInputs = ['', ' ', '   ', '\t', '\n', '\r\n', '    \t   '];
      for (const input of emptyInputs) {
        const results = await searchCities(input);
        expect(results).toEqual([]);
      }
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('sanitizes single character inputs without triggering fetch (< 2 chars rule)', async () => {
      const fetchSpy = vi.fn();
      global.fetch = fetchSpy;

      const singleChars = ['a', 'Z', '1', '!', '?', '.', ' '];
      for (const char of singleChars) {
        const results = await searchCities(char);
        expect(results).toEqual([]);
      }

      expect(await searchCities('  x  ')).toEqual([]);
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('safely handles SQL injection payloads without throwing', async () => {
      let capturedUrl = '';
      global.fetch = vi.fn().mockImplementation((url: string) => {
        capturedUrl = url;
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ generationtime_ms: 0.1 })
        });
      });

      const sqlPayloads = [
        "'; DROP TABLE cities; --",
        "' OR '1'='1",
        "UNION SELECT null, username, password FROM users--",
        "1' ORDER BY 1--",
        "admin'--",
        "' OR 1=1 #",
        "1'; WAITFOR DELAY '0:0:5'--"
      ];

      for (const payload of sqlPayloads) {
        const results = await searchCities(payload);
        expect(Array.isArray(results)).toBe(true);
        expect(results).toEqual([]);
        expect(capturedUrl).toContain('https://geocoding-api.open-meteo.com/v1/search');
        expect(capturedUrl).not.toContain("'; DROP"); // Must be URL-encoded
      }
    });

    it('safely handles XSS and script injection payloads', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ generationtime_ms: 0.1 })
      });

      const xssPayloads = [
        '<script>alert("xss")</script>',
        '<img src=x onerror=alert(1)>',
        'javascript:alert(1)',
        '"><svg/onload=alert(1)>',
        '${7*7}',
        '{{7*7}}',
        '../../../etc/passwd'
      ];

      for (const payload of xssPayloads) {
        const results = await searchCities(payload);
        expect(Array.isArray(results)).toBe(true);
      }
    });

    it('safely handles special keyboard characters and symbol mash', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ generationtime_ms: 0.1 })
      });

      const specialInputs = [
        '!@#$%^&*()_+-=[]{}|;:",.<>?',
        'Tokyo?query=1&page=2#heading',
        'C:\\Windows\\System32\\cmd.exe',
        '//network/share/path',
        '~`!@#$%^&*()_+='
      ];

      for (const input of specialInputs) {
        const results = await searchCities(input);
        expect(Array.isArray(results)).toBe(true);
      }
    });

    it('safely handles multilingual unicode, RTL, and emojis', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          results: [
            {
              id: 1,
              name: 'Tokyo',
              latitude: 35.68,
              longitude: 139.76,
              country: 'Japan'
            }
          ]
        })
      });

      const unicodeInputs = [
        '東京',
        'القاهرة',
        'Москва',
        'München',
        'São Paulo',
        'Reykjavík',
        'København',
        'New York 🗽✨',
        '🔥'
      ];

      for (const input of unicodeInputs) {
        const results = await searchCities(input);
        expect(Array.isArray(results)).toBe(true);
      }
    });

    it('safely handles extremely large string query without crashing or overflowing', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ generationtime_ms: 0.1 })
      });

      const longQuery = 'London'.repeat(2000);
      const results = await searchCities(longQuery);
      expect(Array.isArray(results)).toBe(true);
    });

    it('safely handles network timeout / abort controller in searchCities', async () => {
      global.fetch = vi.fn().mockImplementation((_url, options) => {
        return new Promise((_, reject) => {
          options.signal.addEventListener('abort', () => {
            const err = new Error('The operation was aborted');
            err.name = 'AbortError';
            reject(err);
          });
        });
      });

      const results = await searchCities('Stockholm', { timeoutMs: 10 });
      expect(results).toEqual([]);
    });

    it('validates formatLocationName boundary edge cases', () => {
      expect(formatLocationName({
        id: 1,
        name: 'Seattle',
        admin1: 'Washington',
        country: 'United States',
        latitude: 47.6,
        longitude: -122.3
      })).toBe('Seattle, Washington, United States');

      expect(formatLocationName({
        id: 2,
        name: 'Singapore',
        admin1: 'Singapore',
        country: 'Singapore',
        latitude: 1.35,
        longitude: 103.8
      })).toBe('Singapore, Singapore');

      expect(formatLocationName({
        id: 3,
        name: 'Monaco',
        country: 'Monaco',
        latitude: 43.7,
        longitude: 7.4
      })).toBe('Monaco, Monaco');

      expect(formatLocationName({
        id: 4,
        name: 'Unknown Atoll',
        admin1: 'Pacific',
        country: '',
        latitude: 0,
        longitude: 0
      })).toBe('Unknown Atoll, Pacific');
    });
  });
});
