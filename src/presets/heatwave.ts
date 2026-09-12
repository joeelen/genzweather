import { PresetScenario } from '../types/weather';

export const SCORCHING_HEATWAVE: PresetScenario = {
  id: 'scorching-heatwave',
  name: 'Scorching Heatwave',
  description: 'Triple-digit dry heat, blinding sunlight, maximum hydration, emotional support iced drinks.',
  icon: '🔥',
  themeClass: 'from-orange-600/20 via-red-500/15 to-yellow-500/20',
  dataset: {
    isPreset: true,
    presetId: 'scorching-heatwave',
    lastUpdated: '2026-09-11T12:00:00Z',
    location: {
      name: 'Palm Springs',
      region: 'California',
      country: 'United States',
      latitude: 33.8303,
      longitude: -116.5453,
      timezone: 'America/Los_Angeles'
    },
    current: {
      temperature: 41.2,
      apparentTemperature: 43.5,
      weatherCode: 0,
      conditionLabel: 'Clear Sky',
      conditionEmoji: '☀️',
      emoji: '☀️',
      relativeHumidity: 16,
      windSpeed: 8.5,
      isDay: true,
      precipitation: 0.0
    },
    daily: [
      {
        date: '2026-07-20',
        dayOfWeek: 'Today',
        dayName: 'Today',
        weatherCode: 0,
        conditionCategory: 'clear',
        conditionLabel: 'Clear Sky',
        conditionEmoji: '☀️',
        emoji: '☀️',
        temperatureMax: 42.5,
        tempMax: 42.5,
        temperatureMin: 27.8,
        tempMin: 27.8,
        apparentTemperatureMax: 44.8,
        apparentTempMax: 44.8,
        apparentTemperatureMin: 28.5,
        apparentTempMin: 28.5,
        precipitationSum: 0.0,
        precipitationProbability: 0,
        precipitationProbabilityMax: 0,
        windSpeedMax: 14.2,
        uvIndexMax: 11.5,
        vibeCheck: {
          headline: 'Actual furnace outside besties stay in AC 🥵🔥',
          badge: 'Melting Core',
          tagline: 'Extreme dry desert heat. Sidewalks are hot enough to fry eggs.',
          moodColor: '#DC2626',
          score: 45
        },
        ootd: {
          summary: 'Ultra-breathable open linen shirt, drawstring shorts, and UV shades.',
          layers: {
            outerwear: 'Unbuttoned featherweight linen shirt',
            top: 'Organic cotton ribbed crop tank',
            bottom: 'Loose linen-blend drawstring shorts',
            footwear: 'Ergonomic EVA waterproof slides',
            accessories: ['UV400 polarized sunglasses', 'Insulated 40oz hydro flask', 'Wide-brim bucket hat']
          },
          tip: 'Pure linen and light colors reflect solar radiation; keep skin covered from intense UV.',
          aesthetic: 'Resort Minimal'
        },
        activities: {
          primary: 'Shaded pool club lounge with frozen matcha coladas',
          secondary: 'Air-conditioned vintage mid-century furniture shopping',
          isIndoorPreferred: true,
          idealTimeOfDay: 'Early Morning (before 9:00 AM) or Late Evening (after 8:00 PM)'
        }
      },
      {
        date: '2026-07-21',
        dayOfWeek: 'Tomorrow',
        dayName: 'Tomorrow',
        weatherCode: 0,
        conditionCategory: 'clear',
        conditionLabel: 'Clear Sky',
        conditionEmoji: '☀️',
        emoji: '☀️',
        temperatureMax: 43.1,
        tempMax: 43.1,
        temperatureMin: 28.5,
        tempMin: 28.5,
        apparentTemperatureMax: 45.6,
        apparentTempMax: 45.6,
        apparentTemperatureMin: 29.2,
        apparentTempMin: 29.2,
        precipitationSum: 0.0,
        precipitationProbability: 0,
        precipitationProbabilityMax: 0,
        windSpeedMax: 16.0,
        uvIndexMax: 12.0,
        vibeCheck: {
          headline: 'Sun is violently disrespecting us today 🕶️💀',
          badge: 'Extreme Heat',
          tagline: 'UV Index 12.0 is off the charts. Reapply SPF 50 every 90 minutes minimum.',
          moodColor: '#EF4444',
          score: 40
        },
        ootd: {
          summary: 'Breezy camp-collar silk-blend top and relaxed poplin shorts.',
          layers: {
            top: 'Breezy camp-collar poplin shirt',
            bottom: 'Relaxed cotton-twill shorts',
            footwear: 'Open-toe slide sandals',
            accessories: ['SPF 50+ mineral mist', 'Acetate cat-eye sunglasses', 'Cotton tote']
          },
          tip: 'Avoid dark dyes completely today; black absorbs maximum thermal radiation.',
          aesthetic: 'Desert Minimal'
        },
        activities: {
          primary: 'Movie theater marathon with cranked AC',
          secondary: 'Iced smoothie bowl tasting',
          isIndoorPreferred: true,
          idealTimeOfDay: 'Indoor All Day'
        }
      },
      {
        date: '2026-07-22',
        dayOfWeek: 'Wed',
        dayName: 'Wed',
        weatherCode: 1,
        conditionCategory: 'clear',
        conditionLabel: 'Mainly Clear',
        conditionEmoji: '🌤️',
        emoji: '🌤️',
        temperatureMax: 41.8,
        tempMax: 41.8,
        temperatureMin: 27.2,
        tempMin: 27.2,
        apparentTemperatureMax: 43.9,
        apparentTempMax: 43.9,
        apparentTemperatureMin: 28.0,
        apparentTempMin: 28.0,
        precipitationSum: 0.0,
        precipitationProbability: 0,
        precipitationProbabilityMax: 0,
        windSpeedMax: 12.5,
        uvIndexMax: 11.2,
        vibeCheck: {
          headline: 'High noon is lava, golden hour is iconic 🌅🏜️',
          badge: 'Desert Sizzle',
          tagline: 'Once the sun sinks behind the mountains, evening breeze feels therapeutic.',
          moodColor: '#F97316',
          score: 65
        },
        ootd: {
          summary: 'Loose crochet knit resort top with flowy linen pants.',
          layers: {
            top: 'Breathable crochet mesh knit top',
            bottom: 'High-waisted wide leg linen trousers',
            footwear: 'Woven leather mule slides',
            accessories: ['Tinted sunset shades', 'Handheld rechargeable mini fan']
          },
          tip: 'Linen trousers protect legs from blistering car seats and blazing ambient sun.',
          aesthetic: 'Sunset Resort'
        },
        activities: {
          primary: 'Dusk poolside dip under string lights',
          secondary: 'Late night desert stargazing session',
          isIndoorPreferred: false,
          idealTimeOfDay: 'Twilight (7:30 PM - 10:00 PM)'
        }
      },
      {
        date: '2026-07-23',
        dayOfWeek: 'Thu',
        dayName: 'Thu',
        weatherCode: 0,
        conditionCategory: 'clear',
        conditionLabel: 'Clear Sky',
        conditionEmoji: '☀️',
        emoji: '☀️',
        temperatureMax: 40.5,
        tempMax: 40.5,
        temperatureMin: 26.4,
        tempMin: 26.4,
        apparentTemperatureMax: 42.0,
        apparentTempMax: 42.0,
        apparentTemperatureMin: 27.0,
        apparentTempMin: 27.0,
        precipitationSum: 0.0,
        precipitationProbability: 0,
        precipitationProbabilityMax: 0,
        windSpeedMax: 11.0,
        uvIndexMax: 11.0,
        vibeCheck: {
          headline: 'Emotional support iced matcha is mandatory 🍵🧊',
          badge: 'Dry Heat',
          tagline: 'Hydration checkpoints required every hour. Electrolytes on deck.',
          moodColor: '#EA580C',
          score: 55
        },
        ootd: {
          summary: 'Lightweight sleeveless knit tank and relaxed seersucker shorts.',
          layers: {
            top: 'Featherweight ribbed jersey tank',
            bottom: 'Seersucker drawstring beach shorts',
            footwear: 'Cushioned recovery slides',
            accessories: ['Thermal water tumbler', 'Minimalist baseball cap']
          },
          tip: 'Electrolyte packets in your hydro flask will prevent heat fatigue.',
          aesthetic: 'Sporty Summer'
        },
        activities: {
          primary: 'Art museum audio tour in refrigerated galleries',
          secondary: 'Iced boba tea social hangout',
          isIndoorPreferred: true,
          idealTimeOfDay: 'Midday (12:00 PM - 4:00 PM)'
        }
      },
      {
        date: '2026-07-24',
        dayOfWeek: 'Fri',
        dayName: 'Fri',
        weatherCode: 0,
        conditionCategory: 'clear',
        conditionLabel: 'Clear Sky',
        conditionEmoji: '☀️',
        emoji: '☀️',
        temperatureMax: 39.8,
        tempMax: 39.8,
        temperatureMin: 25.8,
        tempMin: 25.8,
        apparentTemperatureMax: 41.2,
        apparentTempMax: 41.2,
        apparentTemperatureMin: 26.2,
        apparentTempMin: 26.2,
        precipitationSum: 0.0,
        precipitationProbability: 0,
        precipitationProbabilityMax: 0,
        windSpeedMax: 13.5,
        uvIndexMax: 10.8,
        vibeCheck: {
          headline: 'Warm desert night vibes unlocking soon 🌴✨',
          badge: 'Summer Friday',
          tagline: 'Temps dip under 38°C right in time for weekend rooftop patio energy.',
          moodColor: '#FB923C',
          score: 72
        },
        ootd: {
          summary: 'Relaxed resort button-down with lightweight chino shorts.',
          layers: {
            top: 'Open collar printed viscose shirt',
            bottom: 'Tailored lightweight stretch chino shorts',
            footwear: 'Canvas low-top espadrilles',
            accessories: ['Gold chain necklace', 'Designer sunglasses']
          },
          tip: 'Viscose fabric drapes elegantly without sticking when transitioning indoors/outdoors.',
          aesthetic: 'Palm Oasis'
        },
        activities: {
          primary: 'Outdoor misted restaurant patio dinner',
          secondary: 'Night swim party with chill playlist',
          isIndoorPreferred: false,
          idealTimeOfDay: 'Evening (7:00 PM - 11:00 PM)'
        }
      }
    ]
  }
};
