import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import App from '../../src/App';
import {
  PRESET_SCENARIOS,
  DEFAULT_PRESET,
  getPresetById
} from '../../src/presets/presetData';
import { getOOTDRecommendation } from '../../src/engine/ootdEngine';
import { getVibeCheck } from '../../src/engine/vibeEngine';
import { getActivitySuggestions, ACTIVITY_CATALOG } from '../../src/engine/activityEngine';
import * as openMeteoService from '../../src/services/openMeteoService';
import * as geocodingService from '../../src/services/geocodingService';
import { NormalizedForecastDay, WeatherDataset } from '../../src/types/weather';

function createMockDay(overrides: Partial<NormalizedForecastDay> = {}): NormalizedForecastDay {
  return {
    date: '2026-11-20',
    dayOfWeek: 'Friday',
    temperatureMax: 15,
    temperatureMin: 8,
    apparentTemperatureMax: 14,
    precipitationSum: 0,
    precipitationProbability: 10,
    windSpeedMax: 15,
    uvIndexMax: 3,
    weatherCode: 1,
    conditionCategory: 'clear',
    conditionLabel: 'Mainly Clear',
    conditionEmoji: '🌤️',
    ...overrides
  };
}

function createMockDataset(cityName: string, country: string, overrides: Partial<NormalizedForecastDay> = {}): WeatherDataset {
  const day = createMockDay(overrides);
  return {
    location: {
      name: cityName,
      country,
      latitude: 50.0,
      longitude: 0.0,
      timezone: 'UTC'
    },
    current: {
      temperature: day.temperatureMax,
      apparentTemperature: day.apparentTemperatureMax ?? day.temperatureMax,
      weatherCode: day.weatherCode,
      relativeHumidity: 65,
      windSpeed: day.windSpeedMax,
      uvIndex: day.uvIndexMax,
      conditionCategory: day.conditionCategory,
      conditionLabel: day.conditionLabel,
      conditionEmoji: day.conditionEmoji
    },
    daily: [
      {
        ...day,
        vibeCheck: getVibeCheck(day),
        ootd: getOOTDRecommendation(day),
        activities: getActivitySuggestions(day)
      }
    ]
  };
}

describe('Tier 6: Challenger V2 Adversarial Stress & Concurrency Suite', () => {

  // =========================================================================
  // Focus Area 1: Domain Logic Fixes Verification
  // =========================================================================
  describe('Area 1: Domain Logic Fixes Verification', () => {

    describe('1.1 Subzero Heavy Snowfall vs Horizontal Rain Precedence', () => {
      it('triggers Arctic Freeze and blizzard copy under subzero heavy snow (-15°C, 25mm precip, 45 km/h wind, WMO 75)', () => {
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
        expect(vibe.badge).not.toBe('Storm Warning');
        expect(vibe.tagline).not.toMatch(/horizontal rain/i);
      });

      it('triggers Arctic Freeze under subzero conditions with heavy precipSum even when weatherCode is generic', () => {
        const coldDay = createMockDay({
          temperatureMax: -6,
          apparentTemperatureMax: -12,
          weatherCode: 0,
          precipitationSum: 18,
          windSpeedMax: 40
        });

        const vibe = getVibeCheck(coldDay);
        expect(vibe.badge).toBe('Arctic Freeze');
        expect(vibe.mood).toBe('snow');
        expect(vibe.headline).toMatch(/freezing blizzard/i);
      });

      it('correctly triggers Storm Warning when temperatures are above freezing (15°C, 25mm precip, 45 km/h wind, WMO 65)', () => {
        const rainStormDay = createMockDay({
          temperatureMax: 15,
          apparentTemperatureMax: 15,
          weatherCode: 65, // Heavy Rain
          precipitationSum: 25,
          windSpeedMax: 45
        });

        const vibe = getVibeCheck(rainStormDay);
        expect(vibe.badge).toBe('Storm Warning');
        expect(vibe.headline).toMatch(/temper tantrum/i);
        expect(vibe.mood).toBe('storm');
      });
    });

    describe('1.2 WMO Thunderstorm Code Bounding [95, 99]', () => {
      const thunderstormCodes = [95, 96, 99];
      const nonThunderstormBoundaryCodes = [90, 91, 92, 93, 94, 100, 101, 105, 200, 255, 999];

      thunderstormCodes.forEach(code => {
        it(`recognizes WMO ${code} as thunderstorm in vibeEngine and activityEngine`, () => {
          const stormDay = createMockDay({
            temperatureMax: 22,
            apparentTemperatureMax: 22,
            weatherCode: code,
            precipitationSum: 5,
            windSpeedMax: 25
          });

          const vibe = getVibeCheck(stormDay);
          expect(vibe.badge).toBe('Storm Warning');
          expect(vibe.mood).toBe('storm');

          const actSuggestions = getActivitySuggestions(stormDay);
          expect(actSuggestions.isIndoorPreferred).toBe(true);
          const hasOutdoor = actSuggestions.activities.some(s => s.category === 'outdoor');
          expect(hasOutdoor).toBe(false);
        });
      });

      nonThunderstormBoundaryCodes.forEach(code => {
        it(`rejects WMO ${code} from being treated as thunderstorm in vibeEngine and activityEngine isStorm`, () => {
          const calmDay = createMockDay({
            temperatureMax: 21,
            apparentTemperatureMax: 21,
            weatherCode: code,
            precipitationSum: 0,
            windSpeedMax: 12
          });

          const vibe = getVibeCheck(calmDay);
          expect(vibe.badge).not.toBe('Storm Warning');
          expect(vibe.mood).not.toBe('storm');

          const actSuggestions = getActivitySuggestions(calmDay);
          // Line 282 isStorm check is properly bounded, so isIndoorPreferred is not forced to true
          expect(actSuggestions.isIndoorPreferred).toBe(false);
        });
      });

      it('empirically demonstrates residual unbounded weatherCode >= 95 in activityEngine lines 80 and 111', () => {
        const museum = ACTIVITY_CATALOG.find(a => a.id === 'act_modern_museum')!;
        const movie = ACTIVITY_CATALOG.find(a => a.id === 'act_movie_marathon')!;

        const dayClear = createMockDay({ weatherCode: 1, temperatureMax: 21, apparentTemperatureMax: 21, precipitationSum: 0 });
        const dayCode100 = createMockDay({ weatherCode: 100, temperatureMax: 21, apparentTemperatureMax: 21, precipitationSum: 0 });

        // On normal clear day:
        expect(museum.suitability(dayClear)).toBe(70);
        expect(movie.suitability(dayClear)).toBe(65);

        // On out-of-range code 100: line 80 and line 111 evaluate day.weatherCode >= 95 as true!
        // Unintended +20 boost to modern museum (70 -> 90)
        expect(museum.suitability(dayCode100)).toBe(90);
        // Unintended +30 boost to movie marathon (65 -> 95)
        expect(movie.suitability(dayCode100)).toBe(95);
      });
    });

    describe('1.3 Outerwear Down Puffer Preservation in Subzero Winds', () => {
      const subzeroTemps = [-1, -5, -15, -30];
      const galeWinds = [36, 50, 75, 100];

      subzeroTemps.forEach(temp => {
        galeWinds.forEach(wind => {
          it(`preserves down puffer with storm hood for temp=${temp}°C and wind=${wind} km/h`, () => {
            const day = createMockDay({
              temperatureMax: temp,
              apparentTemperatureMax: temp - 5,
              windSpeedMax: wind,
              weatherCode: 73
            });

            const ootd = getOOTDRecommendation(day);
            expect(ootd.layers.outerwear).toBe('Heavyweight maxi down puffer jacket with windproof storm hood');
            expect(ootd.layers.outerwear).not.toBe('Windproof hooded technical shell jacket');
          });
        });
      });

      it('assigns Windproof hooded technical shell jacket for CHILLY band (4°C, 45 km/h)', () => {
        const chillyGale = createMockDay({
          temperatureMax: 4,
          apparentTemperatureMax: 1,
          windSpeedMax: 45,
          weatherCode: 3
        });
        const ootd = getOOTDRecommendation(chillyGale);
        expect(ootd.layers.outerwear).toBe('Windproof hooded technical shell jacket');
      });

      it('assigns Windproof hooded technical shell jacket for MILD_CRISP band (12°C, 45 km/h)', () => {
        const mildGale = createMockDay({
          temperatureMax: 12,
          apparentTemperatureMax: 10,
          windSpeedMax: 45,
          weatherCode: 3
        });
        const ootd = getOOTDRecommendation(mildGale);
        expect(ootd.layers.outerwear).toBe('Windproof hooded technical shell jacket');
      });

      it('does NOT equip heavy technical shell in SCORCHING heat band (36°C, 45 km/h)', () => {
        const hotWind = createMockDay({
          temperatureMax: 36,
          apparentTemperatureMax: 38,
          windSpeedMax: 45,
          weatherCode: 0
        });
        const ootd = getOOTDRecommendation(hotWind);
        expect(ootd.layers.outerwear).toBeUndefined();
      });
    });
  });

  // =========================================================================
  // Focus Area 2: Concurrency & State Invalidation in App.tsx
  // =========================================================================
  describe('Area 2: Concurrency & State Invalidation in App.tsx', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('Scenario A: In-flight city search response is discarded when user switches to offline preset', async () => {
      let resolveSearchFetch: (val: WeatherDataset) => void = () => {};
      const searchFetchPromise = new Promise<WeatherDataset>((resolve) => {
        resolveSearchFetch = resolve;
      });

      vi.spyOn(geocodingService, 'searchCities').mockResolvedValue([
        {
          id: 101,
          name: 'London',
          country: 'United Kingdom',
          latitude: 51.5074,
          longitude: -0.1278,
          timezone: 'Europe/London'
        }
      ]);

      vi.spyOn(openMeteoService, 'fetchWeatherForecast').mockImplementation(() => searchFetchPromise as any);

      const { unmount } = render(<App />);
      expect(screen.getByText(/Woodstock/i)).toBeInTheDocument();

      // 1. Submit search for London
      const searchInput = screen.getByPlaceholderText(/Search city/i);
      fireEvent.change(searchInput, { target: { value: 'London' } });
      const searchForm = searchInput.closest('form')!;
      fireEvent.submit(searchForm);

      // Wait for search to dispatch forecast fetch
      await vi.waitFor(() => {
        expect(openMeteoService.fetchWeatherForecast).toHaveBeenCalled();
      });

      // 2. While API fetch is pending, click Preset "Subzero Blizzard" (Reykjavík)
      const blizzardBtn = screen.getByRole('button', { name: /Blizzard/i });
      fireEvent.click(blizzardBtn);
      expect(screen.getByText(/Reykjav/i)).toBeInTheDocument();

      // 3. Resolve the delayed search fetch
      await act(async () => {
        resolveSearchFetch(createMockDataset('London', 'United Kingdom'));
      });

      // 4. Invariant: Reykjavík MUST remain active; London MUST be discarded
      expect(screen.queryAllByText(/Reykjav/i).length).toBeGreaterThan(0);
      expect(screen.queryAllByText(/London/i).length).toBe(0);

      unmount();
    });

    it('Scenario B: Rapid consecutive searches out of order discard the older request', async () => {
      let resolveSlowSearch: (val: WeatherDataset) => void = () => {};
      const slowPromise = new Promise<WeatherDataset>((resolve) => {
        resolveSlowSearch = resolve;
      });

      const fastDataset = createMockDataset('Tokyo', 'Japan');

      vi.spyOn(geocodingService, 'searchCities').mockImplementation(async (q: string) => {
        if (q === 'SlowCity') {
          return [{ id: 1, name: 'SlowCity', country: 'Slowland', latitude: 10, longitude: 10, timezone: 'UTC' }];
        }
        return [{ id: 2, name: 'Tokyo', country: 'Japan', latitude: 35.6, longitude: 139.6, timezone: 'Asia/Tokyo' }];
      });

      vi.spyOn(openMeteoService, 'fetchWeatherForecast').mockImplementation(async (params) => {
        if (params.name === 'SlowCity') {
          return slowPromise;
        }
        return fastDataset;
      });

      const { unmount } = render(<App />);

      const searchInput = screen.getByPlaceholderText(/Search city/i);
      const searchForm = searchInput.closest('form')!;

      // 1. Trigger SlowCity
      fireEvent.change(searchInput, { target: { value: 'SlowCity' } });
      fireEvent.submit(searchForm);

      // Wait for first fetch to start
      await vi.waitFor(() => {
        expect(openMeteoService.fetchWeatherForecast).toHaveBeenCalledTimes(1);
      });

      // 2. Immediately trigger Tokyo
      fireEvent.change(searchInput, { target: { value: 'Tokyo' } });
      fireEvent.submit(searchForm);

      // Tokyo resolved immediately
      await vi.waitFor(() => {
        expect(screen.queryAllByText(/Tokyo/i).length).toBeGreaterThan(0);
      });

      // 3. Now SlowCity resolves later
      await act(async () => {
        resolveSlowSearch(createMockDataset('SlowCity', 'Slowland'));
      });

      // Invariant: UI MUST remain on Tokyo, SlowCity is discarded
      expect(screen.queryAllByText(/Tokyo/i).length).toBeGreaterThan(0);
      expect(screen.queryAllByText(/SlowCity/i).length).toBe(0);

      unmount();
    });

    it('Scenario C: In-flight Geolocation request is discarded when user selects a preset', async () => {
      let geoSuccessCb: ((pos: any) => void) | null = null;
      const mockGeolocation = {
        getCurrentPosition: vi.fn().mockImplementation((success: (pos: any) => void) => {
          geoSuccessCb = success;
        })
      };

      const originalGeolocation = navigator.geolocation;
      Object.defineProperty(navigator, 'geolocation', {
        value: mockGeolocation,
        configurable: true,
        writable: true
      });

      let resolveGeoWeather: (val: WeatherDataset) => void = () => {};
      const geoWeatherPromise = new Promise<WeatherDataset>((resolve) => {
        resolveGeoWeather = resolve;
      });

      vi.spyOn(openMeteoService, 'fetchWeatherForecast').mockImplementation(() => geoWeatherPromise as any);

      const { unmount } = render(<App />);

      // 1. Click geolocation button
      const geoButtons = screen.getAllByRole('button', { name: /location/i });
      fireEvent.click(geoButtons[0]);
      expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled();

      // Trigger geolocation coordinate callback
      await act(async () => {
        if (geoSuccessCb) {
          geoSuccessCb({ coords: { latitude: 48.8566, longitude: 2.3522 } });
        }
      });

      // Confirm fetchWeatherForecast was dispatched for Local Coordinates
      expect(openMeteoService.fetchWeatherForecast).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Local Coordinates'
      }));

      // 2. User clicks Preset "Scorching Heatwave" (Palm Springs) while fetch is pending
      const heatwaveBtn = screen.getByRole('button', { name: /Heatwave/i });
      fireEvent.click(heatwaveBtn);
      expect(screen.getByText(/Palm Springs/i)).toBeInTheDocument();

      // 3. Geolocation resolves afterwards
      await act(async () => {
        resolveGeoWeather(createMockDataset('Local Coordinates', 'Current Area'));
      });

      // Invariant: Palm Springs remains active, Local Coordinates discarded
      expect(screen.queryAllByText(/Palm Springs/i).length).toBeGreaterThan(0);
      expect(screen.queryAllByText(/Local Coordinates/i).length).toBe(0);

      Object.defineProperty(navigator, 'geolocation', {
        value: originalGeolocation,
        configurable: true,
        writable: true
      });

      unmount();
    });

    it('Scenario D: Network rejection on stale search does not trigger error toast', async () => {
      let rejectSearchFetch: (err: any) => void = () => {};
      const failingPromise = new Promise<WeatherDataset>((_, reject) => {
        rejectSearchFetch = reject;
      });
      // Prevent unhandled rejection warning in test runner
      failingPromise.catch(() => {});

      vi.spyOn(geocodingService, 'searchCities').mockResolvedValue([
        { id: 99, name: 'Atlantis', country: 'Ocean', latitude: 0, longitude: 0, timezone: 'UTC' }
      ]);
      vi.spyOn(openMeteoService, 'fetchWeatherForecast').mockImplementation(() => failingPromise as any);

      const { unmount } = render(<App />);

      // 1. Search for Atlantis
      const searchInput = screen.getByPlaceholderText(/Search city/i);
      fireEvent.change(searchInput, { target: { value: 'Atlantis' } });
      const searchForm = searchInput.closest('form')!;
      fireEvent.submit(searchForm);

      // Wait for fetchWeatherForecast to be dispatched
      await vi.waitFor(() => {
        expect(openMeteoService.fetchWeatherForecast).toHaveBeenCalled();
      });

      // 2. Switch to Autumn preset
      const autumnBtn = screen.getByRole('button', { name: /Sweater Weather/i });
      fireEvent.click(autumnBtn);
      expect(screen.getByText(/Woodstock/i)).toBeInTheDocument();

      // 3. Delayed network call fails with network error
      await act(async () => {
        rejectSearchFetch(new Error('Network disconnected'));
      });

      // Invariant: Error toast for live weather must NOT appear
      expect(screen.queryByText(/Live weather temporarily unavailable/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Search request encountered an error/i)).not.toBeInTheDocument();

      unmount();
    });
  });

  // =========================================================================
  // Focus Area 3: Permutational Boundary Stress Harness
  // =========================================================================
  describe('Area 3: Permutational Boundary Stress Harness', () => {
    it('executes 250 micro-boundary permutations without uncaught errors or invalid contracts', () => {
      const temperatures = [-10, -1, -0.01, 0, 0.01, 1, 15, 33, 40];
      const precipAmounts = [0, 0.5, 1.0, 1.1, 7.9, 8.0, 8.1, 20, 50];
      const windSpeeds = [0, 20, 34, 35, 36, 50, 90];
      const weatherCodes = [0, 61, 65, 71, 75, 95, 99, 100, 255];

      let count = 0;
      for (let i = 0; i < 250; i++) {
        const t = temperatures[i % temperatures.length];
        const p = precipAmounts[(i * 3) % precipAmounts.length];
        const w = windSpeeds[(i * 7) % windSpeeds.length];
        const c = weatherCodes[(i * 5) % weatherCodes.length];

        const day = createMockDay({
          temperatureMax: t,
          apparentTemperatureMax: t - 2,
          precipitationSum: p,
          windSpeedMax: w,
          weatherCode: c
        });

        const vibe = getVibeCheck(day);
        const ootd = getOOTDRecommendation(day);
        const acts = getActivitySuggestions(day);

        // Core Contract Validations
        expect(typeof vibe.headline).toBe('string');
        expect(vibe.headline.length).toBeGreaterThan(0);
        expect(typeof vibe.badge).toBe('string');
        expect(vibe.badge.length).toBeGreaterThan(0);
        expect(typeof vibe.tagline).toBe('string');
        expect(vibe.tagline.length).toBeGreaterThan(0);
        expect(vibe.score).toBeGreaterThanOrEqual(0);
        expect(vibe.score).toBeLessThanOrEqual(100);

        expect(typeof ootd.summary).toBe('string');
        expect(ootd.summary.length).toBeGreaterThan(0);
        expect(typeof ootd.tip).toBe('string');
        expect(ootd.layers).toBeDefined();

        expect(acts.activities.length).toBe(3);
        expect(typeof acts.isIndoorPreferred).toBe('boolean');

        // Critical Boundary Invariant: Subzero + heavy snow + gale must NEVER trigger rain storm warning
        if (t < 0 && (c === 75 || c === 71 || p > 8) && w > 35) {
          expect(vibe.badge).toBe('Arctic Freeze');
          expect(ootd.layers.outerwear).toBe('Heavyweight maxi down puffer jacket with windproof storm hood');
        }

        // Critical Boundary Invariant: WMO 100 or 255 must NEVER trigger storm warning in vibeEngine
        if ((c === 100 || c === 255) && p <= 8) {
          expect(vibe.badge).not.toBe('Storm Warning');
        }

        count++;
      }

      expect(count).toBe(250);
    });
  });
});
