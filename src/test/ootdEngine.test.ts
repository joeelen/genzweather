import { describe, it, expect } from 'vitest';
import { getOOTDRecommendation, getTemperatureBand } from '../engine/ootdEngine';
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
    conditionEmoji: '☀️',
    ...overrides
  };
}

describe('OOTD Recommendation Engine (F6)', () => {
  describe('Temperature Band Classification', () => {
    it('classifies subzero temps (< 0°C)', () => {
      expect(getTemperatureBand(-0.5)).toBe('SUBZERO');
      expect(getTemperatureBand(-15)).toBe('SUBZERO');
    });

    it('classifies chilly temps (0°C - 10°C)', () => {
      expect(getTemperatureBand(0)).toBe('CHILLY');
      expect(getTemperatureBand(5.5)).toBe('CHILLY');
      expect(getTemperatureBand(10)).toBe('CHILLY');
    });

    it('classifies mild/crisp temps (11°C - 17°C)', () => {
      expect(getTemperatureBand(11)).toBe('MILD_CRISP');
      expect(getTemperatureBand(15)).toBe('MILD_CRISP');
      expect(getTemperatureBand(17)).toBe('MILD_CRISP');
    });

    it('classifies warm temps (18°C - 24°C)', () => {
      expect(getTemperatureBand(18)).toBe('WARM');
      expect(getTemperatureBand(21.5)).toBe('WARM');
      expect(getTemperatureBand(24)).toBe('WARM');
    });

    it('classifies hot temps (25°C - 32°C)', () => {
      expect(getTemperatureBand(25)).toBe('HOT');
      expect(getTemperatureBand(28)).toBe('HOT');
      expect(getTemperatureBand(32)).toBe('HOT');
    });

    it('classifies scorching temps (> 32°C)', () => {
      expect(getTemperatureBand(32.1)).toBe('SCORCHING');
      expect(getTemperatureBand(42)).toBe('SCORCHING');
    });
  });

  describe('Temperature Bands Output & Aesthetic Outfits', () => {
    it('Subzero band (< 0°C): recommends heavyweight down puffer, thermal layers, and snow boots', () => {
      const day = createMockDay({
        temperatureMax: -4,
        apparentTemperatureMax: -8,
        weatherCode: 71
      });
      const ootd = getOOTDRecommendation(day);

      expect(ootd.summary).toBeDefined();
      expect(ootd.layers.outerwear?.toLowerCase()).toMatch(/puffer|down|parka/);
      expect(ootd.layers.top.toLowerCase()).toMatch(/knit|thermal|sweater/);
      expect(ootd.layers.bottom.toLowerCase()).toMatch(/cargo|fleece|pants/);
      expect(ootd.layers.footwear.toLowerCase()).toMatch(/snow|boots|thermal/);
      expect(ootd.layers.accessories.some(a => a.toLowerCase().includes('beanie'))).toBe(true);
      expect(ootd.layers.accessories.some(a => a.toLowerCase().includes('gloves'))).toBe(true);
      expect(ootd.avoidList?.some(a => a.toLowerCase().includes('shorts'))).toBe(true);
      expect(ootd.avoidList?.some(a => a.toLowerCase().includes('slides'))).toBe(true);
    });

    it('Chilly band (0°C - 10°C): recommends cropped puffer or bomber, hoodie, and Chelsea boots', () => {
      const day = createMockDay({
        temperatureMax: 7,
        apparentTemperatureMax: 6,
        weatherCode: 2
      });
      const ootd = getOOTDRecommendation(day);

      expect(ootd.layers.outerwear?.toLowerCase()).toMatch(/puffer|bomber|jacket/);
      expect(ootd.layers.top.toLowerCase()).toMatch(/hoodie|knit|crewneck/);
      expect(ootd.layers.bottom.toLowerCase()).toMatch(/denim|jeans/);
      expect(ootd.layers.footwear.toLowerCase()).toMatch(/chelsea|boots/);
      expect(ootd.colorPalette?.length).toBeGreaterThanOrEqual(3);
    });

    it('Mild/Crisp band (11°C - 17°C): recommends trench/cardigan, baby tee, carpenter denim, and retro kicks', () => {
      const day = createMockDay({
        temperatureMax: 15,
        apparentTemperatureMax: 14,
        weatherCode: 1
      });
      const ootd = getOOTDRecommendation(day);

      expect(ootd.layers.outerwear?.toLowerCase()).toMatch(/trench|chore|jacket/);
      expect(ootd.layers.top.toLowerCase()).toMatch(/tee|cardigan|knit/);
      expect(ootd.layers.bottom.toLowerCase()).toMatch(/carpenter|jeans|chinos/);
      expect(ootd.layers.footwear.toLowerCase()).toMatch(/sneakers|loafers|terrace/);
    });

    it('Warm band (18°C - 24°C): recommends baby tee, relaxed jorts, and skate sneakers', () => {
      const day = createMockDay({
        temperatureMax: 22,
        apparentTemperatureMax: 22,
        weatherCode: 0
      });
      const ootd = getOOTDRecommendation(day);

      expect(ootd.layers.outerwear).toBeUndefined();
      expect(ootd.layers.top.toLowerCase()).toMatch(/baby tee|tank|washed/);
      expect(ootd.layers.bottom.toLowerCase()).toMatch(/jorts|pants|parachute/);
      expect(ootd.layers.footwear.toLowerCase()).toMatch(/skate|sneakers|canvas/);
    });

    it('Hot band (25°C - 32°C): recommends breezy linen shirt, linen shorts, and sandals', () => {
      const day = createMockDay({
        temperatureMax: 29,
        apparentTemperatureMax: 30,
        weatherCode: 0
      });
      const ootd = getOOTDRecommendation(day);

      expect(ootd.layers.outerwear).toBeUndefined();
      expect(ootd.layers.top.toLowerCase()).toMatch(/linen|button-up|halter/);
      expect(ootd.layers.bottom.toLowerCase()).toMatch(/linen|shorts|skirt/);
      expect(ootd.layers.footwear.toLowerCase()).toMatch(/sandals|slides|runners/);
      expect(ootd.avoidList?.some(a => a.toLowerCase().includes('black polyester') || a.toLowerCase().includes('hoodie'))).toBe(true);
    });

    it('Scorching band (> 32°C): strictly forbids outerwear and recommends ultra-light linen and hydration', () => {
      const day = createMockDay({
        temperatureMax: 38,
        apparentTemperatureMax: 41,
        weatherCode: 0,
        uvIndexMax: 10
      });
      const ootd = getOOTDRecommendation(day);

      expect(ootd.layers.outerwear).toBeUndefined();
      expect(ootd.outerwear).toBeUndefined();
      expect(ootd.layers.top.toLowerCase()).toMatch(/tank|mesh|light/);
      expect(ootd.layers.bottom.toLowerCase()).toMatch(/linen|shorts|gauze/);
      expect(ootd.layers.footwear.toLowerCase()).toMatch(/slides|sandals/);
      expect(ootd.layers.accessories.some(a => a.toLowerCase().includes('hydro flask') || a.toLowerCase().includes('water'))).toBe(true);
      expect(ootd.avoidList?.some(a => a.toLowerCase().includes('outerwear'))).toBe(true);
    });
  });

  describe('Weather Condition & Metric Modifiers', () => {
    it('Wet/Rain modifier: enforces waterproof boots, water-resistant outer, umbrella, and warns against raw suede/canvas', () => {
      const rainyDay = createMockDay({
        temperatureMax: 13,
        apparentTemperatureMax: 12,
        precipitationSum: 14.5,
        precipitationProbability: 90,
        weatherCode: 63
      });
      const ootd = getOOTDRecommendation(rainyDay);

      expect(ootd.layers.footwear.toLowerCase()).toMatch(/waterproof.*chelsea|boots/);
      expect(ootd.layers.outerwear?.toLowerCase()).toMatch(/water-resistant|trench|jacket/);
      expect(ootd.layers.accessories.some(a => a.toLowerCase().includes('umbrella'))).toBe(true);
      expect(ootd.avoidList?.some(a => a.toLowerCase().includes('raw suede'))).toBe(true);
      expect(ootd.avoidList?.some(a => a.toLowerCase().includes('white canvas'))).toBe(true);
    });

    it('Snow and freezing modifier: enforces thermal snow boots, maxi puffer, beanie, thermal base layers, and touchscreen gloves', () => {
      const snowDay = createMockDay({
        temperatureMax: -2,
        apparentTemperatureMax: -6,
        weatherCode: 73,
        precipitationSum: 4.2
      });
      const ootd = getOOTDRecommendation(snowDay);

      expect(ootd.layers.outerwear?.toLowerCase()).toMatch(/heavyweight maxi down puffer|puffer/);
      expect(ootd.layers.footwear.toLowerCase()).toMatch(/thermal snow boots/);
      expect(ootd.layers.accessories.some(a => a.toLowerCase().includes('beanie'))).toBe(true);
      expect(ootd.layers.accessories.some(a => a.toLowerCase().includes('gloves'))).toBe(true);
      expect(ootd.layers.accessories.some(a => a.toLowerCase().includes('thermal base layer'))).toBe(true);
    });

    it('High wind modifier (> 35 km/h): equips windproof shell, swaps loose hats, and warns against umbrella inversion', () => {
      const windyStormDay = createMockDay({
        temperatureMax: 14,
        apparentTemperatureMax: 11,
        windSpeedMax: 46,
        precipitationSum: 8.0,
        weatherCode: 61
      });
      const ootd = getOOTDRecommendation(windyStormDay);

      expect(ootd.layers.outerwear?.toLowerCase()).toMatch(/windproof.*shell|technical shell/);
      expect(ootd.tip.toLowerCase()).toMatch(/invert|hooded shell/);
      expect(ootd.layers.accessories.some(a => a.toLowerCase().includes('windproof snug beanie') || a.toLowerCase().includes('claw clip'))).toBe(true);
      expect(ootd.avoidList?.some(a => a.toLowerCase().includes('invert'))).toBe(true);
    });

    it('Subzero high wind (> 35 km/h & < 0°C): preserves heavyweight down puffer with windproof storm hood', () => {
      const subzeroGaleDay = createMockDay({
        temperatureMax: -8,
        apparentTemperatureMax: -16,
        windSpeedMax: 48,
        weatherCode: 73
      });
      const ootd = getOOTDRecommendation(subzeroGaleDay);

      expect(ootd.layers.outerwear?.toLowerCase()).toMatch(/heavyweight maxi down puffer jacket with windproof storm hood/);
    });

    it('High UV modifier (> 5): adds retro oval sunnies, dad cap, and SPF reminder with baby tee and jorts', () => {
      const sunnyUVDay = createMockDay({
        temperatureMax: 23,
        apparentTemperatureMax: 23,
        uvIndexMax: 7.5,
        weatherCode: 0
      });
      const ootd = getOOTDRecommendation(sunnyUVDay);

      expect(ootd.layers.accessories.some(a => a.toLowerCase().includes('sunnies') || a.toLowerCase().includes('sunglasses'))).toBe(true);
      expect(ootd.layers.accessories.some(a => a.toLowerCase().includes('dad cap'))).toBe(true);
      expect(ootd.layers.accessories.some(a => a.toLowerCase().includes('spf') || a.toLowerCase().includes('sunscreen'))).toBe(true);
      expect(ootd.layers.top.toLowerCase()).toMatch(/baby tee/);
      expect(ootd.layers.bottom.toLowerCase()).toMatch(/jorts/);
    });
  });

  describe('Contract Compatibility & Flat Properties', () => {
    it('exposes all required structured fields matching interface contracts', () => {
      const day = createMockDay({ temperatureMax: 18 });
      const ootd = getOOTDRecommendation(day);

      expect(ootd.summary).toBeTypeOf('string');
      expect(ootd.tip).toBeTypeOf('string');
      expect(ootd.layers).toBeDefined();
      expect(ootd.layers.top).toBeTypeOf('string');
      expect(ootd.layers.bottom).toBeTypeOf('string');
      expect(ootd.layers.footwear).toBeTypeOf('string');
      expect(Array.isArray(ootd.layers.accessories)).toBe(true);

      // Flat compatibility aliases
      expect(ootd.top).toBe(ootd.layers.top);
      expect(ootd.bottom).toBe(ootd.layers.bottom);
      expect(ootd.footwear).toBe(ootd.layers.footwear);
      expect(ootd.accessories).toEqual(ootd.layers.accessories);
      expect(ootd.aestheticVibe).toBe(ootd.aesthetic);
      expect(Array.isArray(ootd.colorPalette)).toBe(true);
      expect(Array.isArray(ootd.avoidList)).toBe(true);
    });
  });
});
