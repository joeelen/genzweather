import { describe, it, expect } from 'vitest';
import { PRESET_SCENARIOS, DEFAULT_PRESET, getPresetById } from '../presets/presetData';

describe('Preset Scenarios Data Layer (M1)', () => {
  it('contains all 4 required presets + 2 bonus presets', () => {
    expect(PRESET_SCENARIOS).toHaveLength(6);
    const ids = PRESET_SCENARIOS.map(p => p.id);
    expect(ids).toContain('sweater-weather');
    expect(ids).toContain('scorching-heatwave');
    expect(ids).toContain('gloomy-rainy-day');
    expect(ids).toContain('subzero-blizzard');
    expect(ids).toContain('golden-hour-spring');
    expect(ids).toContain('summer-thunderstorm');
  });

  it('provides default fallback scenario as Crisp Autumn Sweater Weather', () => {
    expect(DEFAULT_PRESET).toBeDefined();
    expect(DEFAULT_PRESET.id).toBe('sweater-weather');
    expect(DEFAULT_PRESET.name).toBe('Crisp Autumn Sweater Weather');
  });

  it('supports lookup by id and spec aliases', () => {
    expect(getPresetById('sweater-weather')?.name).toBe('Crisp Autumn Sweater Weather');
    expect(getPresetById('scorching-heatwave')?.name).toBe('Scorching Heatwave');
    expect(getPresetById('gloomy-rainy-day')?.name).toBe('Gloomy Rainy Day');
    expect(getPresetById('subzero-blizzard')?.name).toBe('Subzero Blizzard');
    expect(getPresetById('golden-hour-spring')?.name).toBe('Golden Hour Spring Breeze');
    expect(getPresetById('spring-breeze')?.name).toBe('Golden Hour Spring Breeze');
    expect(getPresetById('summer-thunderstorm')?.name).toBe('Chaotic Summer Thunderstorm');
    expect(getPresetById('chaotic-thunderstorm')?.name).toBe('Chaotic Summer Thunderstorm');
  });

  it('each preset has 5 days conforming strictly to NormalizedForecastDay interface', () => {
    for (const preset of PRESET_SCENARIOS) {
      expect(preset.dataset.daily).toHaveLength(5);
      expect(preset.dataset.isPreset).toBe(true);
      expect(preset.dataset.location.name).toBeTruthy();
      expect(typeof preset.dataset.location.latitude).toBe('number');
      expect(typeof preset.dataset.location.longitude).toBe('number');

      for (const day of preset.dataset.daily) {
        expect(day.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(day.dayOfWeek).toBeTruthy();
        expect(typeof day.temperatureMax).toBe('number');
        expect(typeof day.temperatureMin).toBe('number');
        expect(typeof day.apparentTemperatureMax).toBe('number');
        expect(typeof day.precipitationSum).toBe('number');
        expect(typeof day.precipitationProbability).toBe('number');
        expect(typeof day.windSpeedMax).toBe('number');
        expect(typeof day.uvIndexMax).toBe('number');
        expect(typeof day.weatherCode).toBe('number');
        expect(day.conditionCategory).toBeTruthy();
        expect(day.conditionLabel).toBeTruthy();
        expect(day.conditionEmoji).toBeTruthy();

        // Check recommendation layers
        expect(day.vibeCheck).toBeDefined();
        expect(day.vibeCheck?.headline).toBeTruthy();
        expect(day.vibeCheck?.badge).toBeTruthy();

        expect(day.ootd).toBeDefined();
        expect(day.ootd?.summary).toBeTruthy();
        expect(day.ootd?.layers.top).toBeTruthy();
        expect(day.ootd?.layers.bottom).toBeTruthy();
        expect(day.ootd?.layers.footwear).toBeTruthy();

        expect(day.activities).toBeDefined();
        expect(day.activities?.primary).toBeTruthy();
        expect(typeof day.activities?.isIndoorPreferred).toBe('boolean');
      }
    }
  });
});