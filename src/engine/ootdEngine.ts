import { NormalizedForecastDay, OOTDRecommendation, OOTDLayers } from '../types/weather';

export type TemperatureBand =
  | 'SUBZERO'    // < 0°C
  | 'CHILLY'     // 0°C - 10°C
  | 'MILD_CRISP' // 11°C - 17°C
  | 'WARM'       // 18°C - 24°C
  | 'HOT'        // 25°C - 32°C
  | 'SCORCHING'; // > 32°C

/**
 * Evaluates the appropriate temperature band based on apparent or actual temperature.
 */
export function getTemperatureBand(temp: number): TemperatureBand {
  if (temp < 0) return 'SUBZERO';
  if (temp <= 10) return 'CHILLY';
  if (temp <= 17) return 'MILD_CRISP';
  if (temp <= 24) return 'WARM';
  if (temp <= 32) return 'HOT';
  return 'SCORCHING';
}

/**
 * Pure function: Translates daily weather forecast metrics into a stylish,
 * context-aware Outfit of the Day (OOTD) recommendation.
 */
export function getOOTDRecommendation(day: NormalizedForecastDay): OOTDRecommendation {
  const effectiveTemp = day.apparentTemperatureMax ?? day.temperatureMax;
  const band = getTemperatureBand(effectiveTemp);

  const isRainCode = [51, 53, 55, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(day.weatherCode);
  const isWet = day.precipitationSum > 0 || day.precipitationProbability >= 40 || isRainCode;
  const isSnowCode = [71, 73, 75, 77, 85, 86].includes(day.weatherCode);
  const isSnowOrFreezing = isSnowCode || effectiveTemp < 0;
  const isHighWind = day.windSpeedMax > 35;
  const isHighUV = day.uvIndexMax > 5 || (day.uvIndexMax >= 5 && effectiveTemp >= 20);

  let aesthetic = 'Casual Drip';
  let summary = '';
  let outerwear: string | undefined = undefined;
  let top = '';
  let bottom = '';
  let footwear = '';
  const accessories: string[] = [];
  const avoidList: string[] = [];
  let colorPalette: string[] = [];
  let tip = '';

  // 1. Base Layer Configuration based on 6 Temperature Bands
  switch (band) {
    case 'SUBZERO': {
      aesthetic = 'Gorpcore Arctic Patrol';
      summary = 'Heavyweight down parka with thermal fleece layers and subzero insulated snow boots.';
      outerwear = 'Heavyweight maxi down puffer jacket';
      top = 'Chunky cable knit sweater over thermal base layer';
      bottom = 'Fleece-lined utility cargo pants with thermal leggings';
      footwear = 'Lug-sole thermal snow boots with ice grip';
      accessories.push(
        'Fleece-lined ribbed beanie',
        'Touchscreen thermal gloves',
        'Chunky blanket scarf'
      );
      colorPalette = ['#0F172A', '#38BDF8', '#E2E8F0', '#94A3B8'];
      tip = 'Thermal base layers are non-negotiable; trap body heat before stepping outside.';
      avoidList.push('Shorts', 'Open-toe slides', 'Raw canvas sneakers', 'Single-layer cotton socks');
      break;
    }

    case 'CHILLY': {
      aesthetic = 'Downtown Indie Sleaze';
      summary = 'Boxy cropped puffer jacket, oversized vintage graphic hoodie, and platform Chelsea boots.';
      outerwear = 'Cropped boxy puffer jacket or vintage leather bomber';
      top = 'Oversized heavyweight graphic hoodie';
      bottom = 'Baggy dark-wash vintage denim';
      footwear = 'Platform Chelsea boots or lug-sole leather boots';
      accessories.push(
        'Ribbed knit beanie',
        'Crossbody nylon messenger sling',
        'Hydrating lip balm'
      );
      colorPalette = ['#1E293B', '#475569', '#A855F7', '#CBD5E1'];
      tip = 'Layer the hoodie under the jacket so you can adjust comfortably indoors.';
      avoidList.push('Linen shorts', 'Open-toe sandals', 'Single thin tee without layers');
      break;
    }

    case 'MILD_CRISP': {
      aesthetic = 'Immaculate Coffee Core';
      summary = 'Oversized relaxed trench coat, layered knit zip cardigan, and relaxed carpenter denim.';
      outerwear = 'Oversized relaxed trench coat or canvas chore jacket';
      top = 'Baby tee layered under chunky knit zip cardigan';
      bottom = 'Baggy carpenter jeans or relaxed pleated trousers';
      footwear = 'Low-profile retro terrace sneakers or chunky loafers';
      accessories.push(
        'Heavyweight canvas tote bag',
        'Wire-frame oval sunglasses',
        'Layered silver chain'
      );
      colorPalette = ['#78350F', '#D97706', '#FEF3C7', '#15803D'];
      tip = 'Prime sweater weather; shed the trench at peak afternoon warmth.';
      avoidList.push('Heavy down puffers', 'Beach flip-flops', 'Winter thermal gloves');
      break;
    }

    case 'WARM': {
      aesthetic = 'Main Character Streetwear';
      summary = 'Washed baby tee, baggy denim jorts, retro skate sneakers, and vintage dad cap.';
      outerwear = undefined;
      top = 'Vintage washed baby tee or boxy ribbed tank';
      bottom = 'Relaxed baggy denim jorts or lightweight parachute pants';
      footwear = 'Retro skate kicks or chunky platform canvas sneakers';
      accessories.push(
        'Retro oval sunnies',
        'Vintage washed dad cap',
        'Nylon shoulder bag'
      );
      colorPalette = ['#0369A1', '#38BDF8', '#FEF08A', '#F97316'];
      tip = 'Breezy and relaxed; pack a lightweight long-sleeve if you stay out past sunset.';
      avoidList.push('Heavy wool coats', 'Thermal boots', 'Fleece beanies');
      break;
    }

    case 'HOT': {
      aesthetic = 'Euro Summer Sun-Kissed';
      summary = 'Open breezy linen button-up, drawstring linen shorts, and cushioned platform sandals.';
      outerwear = undefined;
      top = 'Breathable linen short-sleeve button-up or crochet halter';
      bottom = 'Airy linen drawstring shorts or flowy cotton midi skirt';
      footwear = 'Cushioned platform slides or Birkenstock sandals';
      accessories.push(
        'UV400 cat-eye sunnies',
        'Woven raffia tote bag',
        'SPF 50 glow sunscreen stick'
      );
      colorPalette = ['#BE123C', '#FB7185', '#FDE047', '#34D399'];
      tip = 'Lightweight natural fibers let your skin breathe and prevent heat buildup.';
      avoidList.push('Black polyester hoodies', 'Leather boots', 'Heavy denim jeans', 'Unbreathable synthetics');
      break;
    }

    case 'SCORCHING': {
      aesthetic = 'Liquid Linen Survival Mode';
      summary = 'Ultra-light organic cotton tank, breezy linen shorts, and breathable slides.';
      outerwear = undefined;
      top = 'Featherweight organic cotton tank or breathable mesh tee';
      bottom = 'Ultra-light airy linen shorts or gauze pants';
      footwear = 'Breathable foam slides or lightweight EVA sandals';
      accessories.push(
        'Polarized retro sunglasses',
        'Packable sun bucket hat',
        '32oz insulated iced Hydro Flask'
      );
      colorPalette = ['#EA580C', '#F97316', '#FEF08A', '#FFFFFF'];
      tip = 'Hydration is mandatory; seek shade during peak UV hours.';
      avoidList.push('Any outerwear', 'Tight synthetic clothes', 'Heavy boots', 'Dark heavyweight denim');
      break;
    }
  }

  // 2. Weather Condition & Metric Modifiers

  // Rain / Wet Elements Modifier
  if (isWet) {
    if (band === 'WARM' || band === 'HOT' || band === 'SCORCHING') {
      footwear = 'Water-resistant platform slides or waterproof trail sneakers';
      if (!outerwear) {
        outerwear = 'Lightweight packable waterproof shell jacket';
      }
    } else {
      footwear = 'Waterproof platform Chelsea boots with lug treads';
      if (!outerwear || !outerwear.toLowerCase().includes('water')) {
        outerwear = 'Water-resistant oversized trench jacket';
      }
    }

    if (!isHighWind) {
      if (!accessories.some(a => a.toLowerCase().includes('umbrella'))) {
        accessories.unshift('Compact wind-resistant umbrella');
      }
    }

    if (!avoidList.some(a => a.toLowerCase().includes('suede'))) {
      avoidList.unshift('Raw suede shoes', 'White canvas sneakers', 'Puddle-grazing hems');
    }

    if (!tip.toLowerCase().includes('rain') && !tip.toLowerCase().includes('water')) {
      tip = 'Wet pavement alert: avoid raw suede and keep your waterproof footwear locked in.';
    }
  }

  // Snow or Freezing Modifier
  if (isSnowOrFreezing) {
    outerwear = 'Heavyweight maxi down puffer jacket';
    footwear = 'Lug-sole thermal snow boots with ice grip';

    if (!accessories.some(a => a.toLowerCase().includes('beanie'))) {
      accessories.unshift('Fleece-lined beanie');
    }
    if (!accessories.some(a => a.toLowerCase().includes('gloves'))) {
      accessories.push('Touchscreen thermal gloves');
    }
    if (!accessories.some(a => a.toLowerCase().includes('base layer'))) {
      accessories.push('Thermal base layers');
    }

    if (!avoidList.some(a => a.toLowerCase().includes('shorts'))) {
      avoidList.push('Shorts', 'Open-toe slides');
    }
    tip = 'Subzero freeze: thermal base layers and waterproof snow boots are essential armor.';
  }

  // High Wind Modifier (> 35 km/h)
  if (isHighWind) {
    if (band === 'SUBZERO') {
      outerwear = 'Heavyweight maxi down puffer jacket with windproof storm hood';
    } else if (band !== 'SCORCHING' && band !== 'HOT') {
      outerwear = 'Windproof hooded technical shell jacket';
    }

    // Replace loose dad caps / floppy straw hats with secure beanie or claw clip
    const filteredAcc = accessories.filter(
      a => !a.toLowerCase().includes('dad cap') && !a.toLowerCase().includes('bucket hat')
    );
    filteredAcc.push('Windproof snug beanie or heavy-duty claw clip');
    accessories.length = 0;
    accessories.push(...filteredAcc);

    avoidList.unshift('Standard fragile umbrellas that invert', 'Loose hats that fly away');
    tip = `⚠️ Wind is ${Math.round(day.windSpeedMax)} km/h! Umbrellas will invert instantly. Rely on a windproof hooded shell with drawstrings instead.`;
  }

  // High Heat / UV Modifier (> 5)
  if (isHighUV && band !== 'SUBZERO' && band !== 'CHILLY') {
    if (!accessories.some(a => a.toLowerCase().includes('sunnies') || a.toLowerCase().includes('sunglasses'))) {
      accessories.unshift('Retro oval sunnies');
    }
    if (!accessories.some(a => a.toLowerCase().includes('dad cap') || a.toLowerCase().includes('bucket hat'))) {
      accessories.push('Low-profile vintage dad cap');
    }
    if (!accessories.some(a => a.toLowerCase().includes('sunscreen') || a.toLowerCase().includes('spf'))) {
      accessories.push('SPF 50 glow sunscreen stick');
    }

    if (band === 'WARM' || band === 'MILD_CRISP') {
      top = 'Breathable organic cotton baby tee';
      bottom = 'Relaxed baggy denim jorts';
    }

    if (!tip.toLowerCase().includes('uv') && !tip.toLowerCase().includes('wind')) {
      tip = 'High UV index: don retro oval sunnies and reapply SPF throughout the day.';
    }
  }

  const layers: OOTDLayers = {
    outerwear,
    top,
    bottom,
    footwear,
    accessories
  };

  return {
    summary,
    layers,
    tip,
    aesthetic,
    // Direct top-level fields for flat property access & backward compatibility
    outerwear,
    top,
    bottom,
    footwear,
    accessories,
    aestheticVibe: aesthetic,
    colorPalette,
    avoidList,
    proTip: tip
  };
}
