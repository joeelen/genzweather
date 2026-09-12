import { PresetScenario } from '../types/weather';

export const GLOOMY_RAINY_DAY: PresetScenario = {
  id: 'gloomy-rainy-day',
  name: 'Gloomy Rainy Day',
  description: 'Non-stop pattering rain, grey mist, lo-fi beats, gorpcore waterproof drip, coffee shop sheltering.',
  icon: '🌧️',
  themeClass: 'from-blue-600/20 via-slate-600/15 to-teal-500/20',
  dataset: {
    isPreset: true,
    presetId: 'gloomy-rainy-day',
    lastUpdated: '2026-09-11T12:00:00Z',
    location: {
      name: 'Seattle',
      region: 'Washington',
      country: 'United States',
      latitude: 47.6062,
      longitude: -122.3321,
      timezone: 'America/Los_Angeles'
    },
    current: {
      temperature: 11.4,
      apparentTemperature: 10.2,
      weatherCode: 63,
      conditionLabel: 'Moderate Rain',
      conditionEmoji: '🌧️',
      emoji: '🌧️',
      relativeHumidity: 92,
      windSpeed: 18.5,
      isDay: true,
      precipitation: 4.8
    },
    daily: [
      {
        date: '2026-11-04',
        dayOfWeek: 'Today',
        dayName: 'Today',
        weatherCode: 63,
        conditionCategory: 'rain',
        conditionLabel: 'Moderate Rain',
        conditionEmoji: '🌧️',
        emoji: '🌧️',
        temperatureMax: 12.2,
        tempMax: 12.2,
        temperatureMin: 8.4,
        tempMin: 8.4,
        apparentTemperatureMax: 10.8,
        apparentTempMax: 10.8,
        apparentTemperatureMin: 6.9,
        apparentTempMin: 6.9,
        precipitationSum: 14.6,
        precipitationProbability: 95,
        precipitationProbabilityMax: 95,
        windSpeedMax: 22.4,
        uvIndexMax: 1.2,
        vibeCheck: {
          headline: 'Full Gorpcore downpour mode activated 🌧️☔',
          badge: 'Main Character Rain',
          tagline: 'Windows streaked with heavy rain, steady lo-fi rhythm, ultimate cozy nesting mood.',
          moodColor: '#3B82F6',
          score: 78
        },
        ootd: {
          summary: 'Waterproof Gore-Tex hooded shell, technical cargo pants, and trail runners.',
          layers: {
            outerwear: '3-layer technical Gore-Tex rain jacket with taped seams',
            top: 'Fleece-lined heavyweight crewneck',
            bottom: 'Water-repellent nylon utility cargo pants',
            footwear: 'Waterproof Salomon XT-6 GTX or Blundstone 585 boots',
            accessories: ['Reinforced windproof umbrella', 'Waterproof roll-top backpack', 'Wool beanie']
          },
          tip: 'Standard sneakers will get soaked through in 10 minutes; choose seam-sealed GTX footwear.',
          aesthetic: 'Technical Gorpcore'
        },
        activities: {
          primary: 'Indie cafe corner table with warm spiced latte & journal',
          secondary: 'Record store vinyl digging session',
          isIndoorPreferred: true,
          idealTimeOfDay: 'Afternoon (1:00 PM - 5:00 PM)'
        }
      },
      {
        date: '2026-11-05',
        dayOfWeek: 'Tomorrow',
        dayName: 'Tomorrow',
        weatherCode: 65,
        conditionCategory: 'rain',
        conditionLabel: 'Heavy Rain',
        conditionEmoji: '🌧️🌊',
        emoji: '🌧️🌊',
        temperatureMax: 11.5,
        tempMax: 11.5,
        temperatureMin: 8.0,
        tempMin: 8.0,
        apparentTemperatureMax: 9.8,
        apparentTempMax: 9.8,
        apparentTemperatureMin: 6.0,
        apparentTempMin: 6.0,
        precipitationSum: 22.0,
        precipitationProbability: 100,
        precipitationProbabilityMax: 100,
        windSpeedMax: 28.0,
        uvIndexMax: 0.8,
        vibeCheck: {
          headline: 'Total soaked chaos outside, pure hibernation inside 🌊🛋️',
          badge: 'Downpour Alert',
          tagline: 'Sheets of rain pounding roofs. Cancel outdoor obligations guilt-free.',
          moodColor: '#1D4ED8',
          score: 70
        },
        ootd: {
          summary: 'Long rubberized rain trench with lug-sole boots.',
          layers: {
            outerwear: 'Rubberized rain mac coat with deep storm hood',
            top: 'Oversized fleece quarter-zip pullover',
            bottom: 'Heavyweight sweatpants (for inside) or coated utility pants',
            footwear: 'Tall rubber Chelsea rain boots with thick cushioned socks',
            accessories: ['Heavy-duty storm umbrella', 'Waterproof phone case pouch']
          },
          tip: 'Keep pant cuffs tucked or cropped so wet sidewalks do not wick water up your legs.',
          aesthetic: 'Storm Armor'
        },
        activities: {
          primary: 'Binge-watching mystery miniseries under weighted blanket',
          secondary: 'Simmering homemade vegetable ramen',
          isIndoorPreferred: true,
          idealTimeOfDay: 'All Day Hibernation'
        }
      },
      {
        date: '2026-11-06',
        dayOfWeek: 'Fri',
        dayName: 'Fri',
        weatherCode: 53,
        conditionCategory: 'drizzle',
        conditionLabel: 'Moderate Drizzle',
        conditionEmoji: '🌧️',
        emoji: '🌧️',
        temperatureMax: 12.8,
        tempMax: 12.8,
        temperatureMin: 9.1,
        tempMin: 9.1,
        apparentTemperatureMax: 11.6,
        apparentTempMax: 11.6,
        apparentTemperatureMin: 7.8,
        apparentTempMin: 7.8,
        precipitationSum: 5.4,
        precipitationProbability: 75,
        precipitationProbabilityMax: 75,
        windSpeedMax: 16.5,
        uvIndexMax: 1.5,
        vibeCheck: {
          headline: 'Misty drizzle & moody grey aesthetic photoshoots 🌫️📸',
          badge: 'Mist Mode',
          tagline: 'Soft, fine mist hanging in the cedar trees. High humidity, great hair day for curls.',
          moodColor: '#0284C7',
          score: 80
        },
        ootd: {
          summary: 'Cropped anorak windbreaker with wide corduroy trousers.',
          layers: {
            outerwear: 'Water-resistant hooded colorblock anorak',
            top: 'Classic waffle thermal long-sleeve',
            bottom: 'Wide-leg dark corduroy trousers',
            footwear: 'Doc Martens 1461 waterproof leather oxfords',
            accessories: ['Corduroy bucket hat', 'Canvas tote with waterproof lining']
          },
          tip: 'A water-repellent bucket hat handles drizzle without the hassle of opening an umbrella.',
          aesthetic: 'Urban Explorer'
        },
        activities: {
          primary: 'Aesthetic wet pavement photography & coffee stroll',
          secondary: 'Pottery or ceramic studio workshop',
          isIndoorPreferred: true,
          idealTimeOfDay: 'Midday (11:30 AM - 3:30 PM)'
        }
      },
      {
        date: '2026-11-07',
        dayOfWeek: 'Sat',
        dayName: 'Sat',
        weatherCode: 80,
        conditionCategory: 'rain',
        conditionLabel: 'Slight Showers',
        conditionEmoji: '🌦️',
        emoji: '🌦️',
        temperatureMax: 13.4,
        tempMax: 13.4,
        temperatureMin: 8.2,
        tempMin: 8.2,
        apparentTemperatureMax: 12.4,
        apparentTempMax: 12.4,
        apparentTemperatureMin: 7.0,
        apparentTempMin: 7.0,
        precipitationSum: 3.1,
        precipitationProbability: 60,
        precipitationProbabilityMax: 60,
        windSpeedMax: 14.0,
        uvIndexMax: 2.1,
        vibeCheck: {
          headline: 'Sun breaks through rain clouds creating double rainbows 🌈✨',
          badge: 'Sun Showers',
          tagline: 'Intermittent brief showers with golden sunlight glinting off wet leaves.',
          moodColor: '#0D9488',
          score: 86
        },
        ootd: {
          summary: 'Packable windbreaker over vintage hoodie with relaxed jeans.',
          layers: {
            outerwear: 'Lightweight packable shell windbreaker',
            top: 'Washed black oversized hoodie',
            bottom: 'Loose straight-leg medium wash jeans',
            footwear: 'New Balance 2002R Gore-Tex sneakers',
            accessories: ['Compact umbrella in sling bag', 'Baseball cap']
          },
          tip: 'Showers are brief; packable layers let you adapt fast as skies clear.',
          aesthetic: 'Casual Street'
        },
        activities: {
          primary: 'Farmers market stroll between sunbreaks',
          secondary: 'Matcha bakery crawl with friends',
          isIndoorPreferred: false,
          idealTimeOfDay: 'Morning (10:00 AM - 1:00 PM)'
        }
      },
      {
        date: '2026-11-08',
        dayOfWeek: 'Sun',
        dayName: 'Sun',
        weatherCode: 61,
        conditionCategory: 'rain',
        conditionLabel: 'Slight Rain',
        conditionEmoji: '🌧️',
        emoji: '🌧️',
        temperatureMax: 12.0,
        tempMax: 12.0,
        temperatureMin: 7.5,
        tempMin: 7.5,
        apparentTemperatureMax: 11.0,
        apparentTempMax: 11.0,
        apparentTemperatureMin: 6.2,
        apparentTempMin: 6.2,
        precipitationSum: 6.0,
        precipitationProbability: 80,
        precipitationProbabilityMax: 80,
        windSpeedMax: 15.2,
        uvIndexMax: 1.4,
        vibeCheck: {
          headline: 'Sunday reset vibes: rain sounds, soup, and journaling 🥣🌧️',
          badge: 'Sunday Reset',
          tagline: 'Gentle, steady patter of rain. Perfect backdrop for self-care routines.',
          moodColor: '#475569',
          score: 83
        },
        ootd: {
          summary: 'Soft fleece zip jacket, relaxed sweatpants, and slip-on clogs.',
          layers: {
            outerwear: 'Fleece sherpa zip jacket (if running quick errand)',
            top: 'Organic cotton oversized long-sleeve tee',
            bottom: 'Heavyweight brushed cotton sweatpants',
            footwear: 'Fleece-lined Birkenstock Boston clogs',
            accessories: ['Ceramic mug', 'Cozy knit socks']
          },
          tip: 'Keep fabrics ultra-soft for ultimate tactile comfort during rainy resets.',
          aesthetic: 'Loungewear Chic'
        },
        activities: {
          primary: 'Weekly planning, journaling, and homemade soup simmering',
          secondary: 'Board games or puzzle session with ambient playlist',
          isIndoorPreferred: true,
          idealTimeOfDay: 'Afternoon to Evening'
        }
      }
    ]
  }
};
