import { NormalizedForecastDay, ActivitySuggestions, ActivityItem } from '../types/weather';

export interface ActivityDefinition extends ActivityItem {
  minTemp?: number;
  maxTemp?: number;
  maxPrecip?: number;
  maxWind?: number;
  suitability: (day: NormalizedForecastDay) => number;
}

/**
 * Curated catalog of indoor and outdoor activities with suitability scoring.
 */
export const ACTIVITY_CATALOG: ActivityDefinition[] = [
  // --- INDOOR ACTIVITIES ---
  {
    id: 'act_matcha_crawl',
    name: 'Aesthetic Specialty Matcha Cafe Crawl',
    category: 'indoor',
    energy: 'chill',
    social: 'besties',
    description: 'Hit the local minimalist specialty cafe for iced strawberry oat matcha and freshly baked pastries.',
    emoji: '🍵',
    tag: 'Cafe Aesthetic',
    suitability: (day) => {
      const temp = day.apparentTemperatureMax ?? day.temperatureMax;
      let score = 80;
      if (temp >= 10 && temp <= 26) score += 15;
      if (day.precipitationSum > 0) score += 10;
      return score;
    }
  },
  {
    id: 'act_thrift_shopping',
    name: 'Vintage Bins Thrifting & Archive Hunting',
    category: 'indoor',
    energy: 'moderate',
    social: 'besties',
    description: 'Raid curated thrift boutiques and vintage bins for 90s leather bombers and oversized carpenter denim.',
    emoji: '🛍️',
    tag: 'Fashion Hunt',
    suitability: (day) => {
      let score = 75;
      if (day.precipitationSum > 2 || day.precipitationProbability > 50) score += 20;
      const temp = day.apparentTemperatureMax ?? day.temperatureMax;
      if (temp < 15) score += 10;
      return score;
    }
  },
  {
    id: 'act_vinyl_session',
    name: 'Cozy Vinyl Crates & Lofi Listening Session',
    category: 'indoor',
    energy: 'chill',
    social: 'solo',
    description: 'Dig through dusty record crates for vintage indie albums, then spin them over warm herbal tea.',
    emoji: '📻',
    tag: 'Audiophile Vibe',
    suitability: (day) => {
      let score = 70;
      if (day.precipitationSum > 0 || day.weatherCode >= 51) score += 25;
      const temp = day.apparentTemperatureMax ?? day.temperatureMax;
      if (temp < 12) score += 15;
      return score;
    }
  },
  {
    id: 'act_modern_museum',
    name: 'Modern Art Gallery & Architecture Walk',
    category: 'indoor',
    energy: 'moderate',
    social: 'date',
    description: 'Wander whisper-quiet contemporary art galleries in high-aesthetic air-conditioned haven.',
    emoji: '🏛️',
    tag: 'High Art Culture',
    suitability: (day) => {
      const temp = day.apparentTemperatureMax ?? day.temperatureMax;
      let score = 70;
      if (temp > 30) score += 30; // AC sanctuary in heatwave
      if (day.precipitationSum > 5 || day.weatherCode >= 95) score += 20;
      return score;
    }
  },
  {
    id: 'act_indoor_bouldering',
    name: 'Indoor Bouldering Gym Session',
    category: 'indoor',
    energy: 'high',
    social: 'besties',
    description: 'Send colorful climbing routes with good music, chalk bags, and zero meteorological friction.',
    emoji: '🧗',
    tag: 'Active Energy',
    suitability: (day) => {
      let score = 65;
      if (day.precipitationSum > 2 || day.windSpeedMax > 30) score += 20;
      return score;
    }
  },
  {
    id: 'act_movie_marathon',
    name: 'A24 Indie Cinema & Popcorn Marathon',
    category: 'indoor',
    energy: 'chill',
    social: 'solo',
    description: 'Curate a triple-feature film night with butter popcorn, fuzzy blankets, and studio headphones.',
    emoji: '🎬',
    tag: 'Cozy Cinema',
    suitability: (day) => {
      const temp = day.apparentTemperatureMax ?? day.temperatureMax;
      let score = 65;
      if (temp < 5 || day.precipitationSum > 6 || day.weatherCode >= 95) score += 30;
      return score;
    }
  },
  {
    id: 'act_ramen_crawl',
    name: 'Steamy Tonkotsu Ramen Bar Crawl',
    category: 'indoor',
    energy: 'chill',
    social: 'besties',
    description: 'Slurp rich 18-hour broth, soft-boiled ajitsuke tamago, and fragrant chili crisp at a cozy counter.',
    emoji: '🍜',
    tag: 'Comfort Food',
    suitability: (day) => {
      const temp = day.apparentTemperatureMax ?? day.temperatureMax;
      let score = 65;
      if (temp < 10) score += 30;
      if (day.precipitationSum > 2) score += 15;
      return score;
    }
  },
  {
    id: 'act_cinnamon_bake',
    name: 'Brown Butter Cinnamon Pastry Bake',
    category: 'indoor',
    energy: 'chill',
    social: 'besties',
    description: 'Warm the kitchen with brown butter dough and vanilla glaze while the elements rage outside.',
    emoji: '🥐',
    tag: 'Kitchen Therapy',
    suitability: (day) => {
      const temp = day.apparentTemperatureMax ?? day.temperatureMax;
      let score = 60;
      if (temp < 0 || (day.weatherCode >= 95 && day.weatherCode <= 99)) score += 35;
      return score;
    }
  },

  // --- OUTDOOR ACTIVITIES ---
  {
    id: 'act_golden_picnic',
    name: 'Golden Hour Checkered Blanket Picnic',
    category: 'outdoor',
    energy: 'chill',
    social: 'besties',
    description: 'Unroll a checkered blanket with sourdough focaccia, fresh strawberries, and retro Polaroid cameras.',
    emoji: '🧺',
    tag: 'Sunset Picnic',
    minTemp: 16,
    maxTemp: 28,
    maxPrecip: 0.5,
    maxWind: 25,
    suitability: (day) => {
      const temp = day.apparentTemperatureMax ?? day.temperatureMax;
      if (temp < 16 || temp > 28 || day.precipitationSum > 0.5 || day.windSpeedMax > 25) return 0;
      let score = 90;
      if ([0, 1].includes(day.weatherCode)) score += 15;
      return score;
    }
  },
  {
    id: 'act_skate_session',
    name: 'Sunset Boardwalk Skate & Cruiser Run',
    category: 'outdoor',
    energy: 'high',
    social: 'besties',
    description: 'Glide along smooth pavement trails or local bowls while the pink and violet sky sets in.',
    emoji: '🛹',
    tag: 'Urban Motion',
    minTemp: 15,
    maxTemp: 28,
    maxPrecip: 0.2,
    maxWind: 22,
    suitability: (day) => {
      const temp = day.apparentTemperatureMax ?? day.temperatureMax;
      if (temp < 15 || temp > 28 || day.precipitationSum > 0.2 || day.windSpeedMax > 22) return 0;
      let score = 85;
      if ([0, 1].includes(day.weatherCode)) score += 10;
      return score;
    }
  },
  {
    id: 'act_rooftop_hangout',
    name: 'Sunset Skyline Rooftop Hangout',
    category: 'outdoor',
    energy: 'chill',
    social: 'date',
    description: 'Catch the 360-degree twilight views with mocktails and a curated dream-pop soundtrack.',
    emoji: '🌇',
    tag: 'Skyline Golden',
    minTemp: 17,
    maxTemp: 32,
    maxPrecip: 0.5,
    maxWind: 25,
    suitability: (day) => {
      const temp = day.apparentTemperatureMax ?? day.temperatureMax;
      if (temp < 17 || temp > 32 || day.precipitationSum > 0.5 || day.windSpeedMax > 25) return 0;
      let score = 88;
      if ([0, 1].includes(day.weatherCode)) score += 12;
      return score;
    }
  },
  {
    id: 'act_beach_day',
    name: 'Sun-Kissed Beach Day & Ocean Dip',
    category: 'outdoor',
    energy: 'moderate',
    social: 'besties',
    description: 'Soak in coastal sunshine with beach towels, tote bags, SPF 50, and refreshing cold drinks.',
    emoji: '🏖️',
    tag: 'Coastal Glow',
    minTemp: 24,
    maxTemp: 36,
    maxPrecip: 0.1,
    maxWind: 25,
    suitability: (day) => {
      const temp = day.apparentTemperatureMax ?? day.temperatureMax;
      if (temp < 24 || temp > 36 || day.precipitationSum > 0.1 || day.windSpeedMax > 25) return 0;
      let score = 92;
      if ([0, 1].includes(day.weatherCode)) score += 15;
      return score;
    }
  },
  {
    id: 'act_bike_ride',
    name: 'Scenic Riverfront Bike Path Ride',
    category: 'outdoor',
    energy: 'high',
    social: 'besties',
    description: 'Pedal down winding greenway trails with sunglasses on and a fresh breeze on your face.',
    emoji: '🚲',
    tag: 'Greenway Cruise',
    minTemp: 14,
    maxTemp: 27,
    maxPrecip: 0.5,
    maxWind: 24,
    suitability: (day) => {
      const temp = day.apparentTemperatureMax ?? day.temperatureMax;
      if (temp < 14 || temp > 27 || day.precipitationSum > 0.5 || day.windSpeedMax > 24) return 0;
      let score = 82;
      return score;
    }
  },
  {
    id: 'act_dog_walk',
    name: 'Neighborhood Dog-Watching Hot Girl Walk',
    category: 'outdoor',
    energy: 'moderate',
    social: 'solo',
    description: 'Get 10,000 steps through tree-lined streets, spot cute neighborhood dogs, and listen to podcasts.',
    emoji: '🐕',
    tag: 'Step Goal',
    minTemp: 12,
    maxTemp: 26,
    maxPrecip: 0.5,
    maxWind: 25,
    suitability: (day) => {
      const temp = day.apparentTemperatureMax ?? day.temperatureMax;
      if (temp < 12 || temp > 26 || day.precipitationSum > 0.5 || day.windSpeedMax > 25) return 0;
      let score = 84;
      return score;
    }
  }
];

/**
 * Pure function: Selects 3 curated activities tailored to daily weather conditions,
 * strictly disqualifying outdoor activities during storms, heavy rain, or subzero blizzard.
 */
export function getActivitySuggestions(day: NormalizedForecastDay): ActivitySuggestions {
  const temp = day.apparentTemperatureMax ?? day.temperatureMax;
  const isStorm = (day.weatherCode >= 95 && day.weatherCode <= 99) || (day.precipitationSum > 8 && day.windSpeedMax > 35);
  const isHeavyRain = day.precipitationSum > 4 || [63, 65, 81, 82].includes(day.weatherCode);
  const isBlizzard = (temp < 0 && (day.precipitationSum > 0 || [71, 73, 75, 77, 85, 86].includes(day.weatherCode))) || temp < -5;
  const isSevereWind = day.windSpeedMax > 38;
  const isSevereHeat = temp > 34;

  // Outdoor activities are strictly disqualified under hazardous or adverse weather
  const disqualifyOutdoors = isStorm || isHeavyRain || isBlizzard || isSevereWind || isSevereHeat || day.precipitationSum > 1.5;

  const isIndoorPreferred = disqualifyOutdoors || temp < 10 || day.precipitationProbability >= 50;

  // Filter and score candidates
  const eligibleActivities = ACTIVITY_CATALOG.filter((item) => {
    if (disqualifyOutdoors && item.category === 'outdoor') {
      return false;
    }
    const score = item.suitability(day);
    return score > 0;
  });

  // Sort by suitability score descending
  const sorted = [...eligibleActivities].sort((a, b) => {
    return b.suitability(day) - a.suitability(day);
  });

  // Guarantee at least 3 distinct activities (fall back to indoor staples if needed)
  const selected: ActivityItem[] = [];
  for (const item of sorted) {
    if (selected.length < 3 && !selected.some(s => s.id === item.id)) {
      selected.push({
        id: item.id,
        name: item.name,
        category: item.category,
        energy: item.energy,
        social: item.social,
        description: item.description,
        emoji: item.emoji,
        tag: item.tag
      });
    }
  }

  // If fewer than 3, pad with indoor staples
  if (selected.length < 3) {
    const indoorStaples = ACTIVITY_CATALOG.filter(a => a.category === 'indoor');
    for (const item of indoorStaples) {
      if (selected.length < 3 && !selected.some(s => s.id === item.id)) {
        selected.push({
          id: item.id,
          name: item.name,
          category: item.category,
          energy: item.energy,
          social: item.social,
          description: item.description,
          emoji: item.emoji,
          tag: item.tag
        });
      }
    }
  }

  // Calculate contextual ideal time of day
  let idealTimeOfDay = 'Afternoon (1:00 PM - 4:30 PM)';
  if (temp > 30) {
    idealTimeOfDay = 'Early Morning (8:00 AM - 10:30 AM) or Late Evening';
  } else if (temp < 5) {
    idealTimeOfDay = 'Midday Peak Sun (11:30 AM - 2:30 PM)';
  } else if (isIndoorPreferred) {
    idealTimeOfDay = 'All Day Cozy (Anytime Indoors)';
  } else if (temp >= 18 && temp <= 27 && [0, 1].includes(day.weatherCode)) {
    idealTimeOfDay = 'Golden Hour (5:00 PM - 7:30 PM)';
  }

  const primary = selected[0]?.name ?? 'Aesthetic Specialty Matcha Cafe Crawl';
  const secondary = selected[1]?.name ?? 'Vintage Bins Thrifting & Archive Hunting';
  const tertiary = selected[2]?.name ?? 'Cozy Vinyl Crates & Lofi Listening Session';

  return {
    primary,
    secondary,
    tertiary,
    isIndoorPreferred,
    idealTimeOfDay,
    activities: selected,
    items: selected
  };
}
