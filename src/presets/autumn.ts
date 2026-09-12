import { PresetScenario } from '../types/weather';

export const AUTUMN_SWEATER_WEATHER: PresetScenario = {
  id: 'sweater-weather',
  name: 'Crisp Autumn Sweater Weather',
  description: 'Golden foliage, brisk breezes, and peak knitwear season besties.',
  icon: '🍂',
  themeClass: 'from-amber-500/20 via-orange-500/10 to-yellow-500/20',
  dataset: {
    isPreset: true,
    presetId: 'sweater-weather',
    lastUpdated: '2026-09-11T12:00:00Z',
    location: {
      name: 'Woodstock',
      region: 'Vermont',
      country: 'United States',
      latitude: 43.6248,
      longitude: -72.5187,
      timezone: 'America/New_York'
    },
    current: {
      temperature: 14.8,
      apparentTemperature: 14.2,
      weatherCode: 1,
      conditionLabel: 'Mainly Clear',
      conditionEmoji: '🌤️',
      emoji: '🌤️',
      relativeHumidity: 54,
      windSpeed: 11.2,
      isDay: true,
      precipitation: 0.0
    },
    daily: [
      {
        date: '2026-10-14',
        dayOfWeek: 'Today',
        dayName: 'Today',
        weatherCode: 1,
        conditionCategory: 'clear',
        conditionLabel: 'Mainly Clear',
        conditionEmoji: '🌤️',
        emoji: '🌤️',
        temperatureMax: 15.6,
        tempMax: 15.6,
        temperatureMin: 5.4,
        tempMin: 5.4,
        apparentTemperatureMax: 15.0,
        apparentTempMax: 15.0,
        apparentTemperatureMin: 4.1,
        apparentTempMin: 4.1,
        precipitationSum: 0.0,
        precipitationProbability: 10,
        precipitationProbabilityMax: 10,
        windSpeedMax: 12.4,
        uvIndexMax: 3.8,
        vibeCheck: {
          headline: 'Sweater weather is officially here besties 🍂',
          badge: 'Cozy Core',
          tagline: 'Cinnamon iced latte in hand, zero humidity, pristine main-character autumn stroll.',
          moodColor: '#D97706',
          score: 92
        },
        ootd: {
          summary: 'Oversized chunky knit cardigan, wide-leg vintage denim, and Boston clogs.',
          layers: {
            outerwear: 'Corduroy fleece-lined overshirt',
            top: 'Ribbed cream turtleneck',
            bottom: 'Baggy thrifted medium-wash jeans',
            footwear: 'Birkenstock Boston clogs with wool socks',
            accessories: ['Canvas tote bag', 'Tortoise-shell sunglasses', 'Chapped lips defense balm']
          },
          tip: 'Layering is everything today; shed the overshirt at peak afternoon sun.',
          aesthetic: 'Cozy Cabincore'
        },
        activities: {
          primary: 'Thrifting & apple cider doughnut crawl',
          secondary: 'Golden hour scenic overlook foliage walk',
          isIndoorPreferred: false,
          idealTimeOfDay: 'Afternoon (1:00 PM - 4:30 PM)'
        }
      },
      {
        date: '2026-10-15',
        dayOfWeek: 'Tomorrow',
        dayName: 'Tomorrow',
        weatherCode: 2,
        conditionCategory: 'cloudy',
        conditionLabel: 'Partly Cloudy',
        conditionEmoji: '⛅',
        emoji: '⛅',
        temperatureMax: 14.2,
        tempMax: 14.2,
        temperatureMin: 4.8,
        tempMin: 4.8,
        apparentTemperatureMax: 13.5,
        apparentTempMax: 13.5,
        apparentTemperatureMin: 3.5,
        apparentTempMin: 3.5,
        precipitationSum: 0.1,
        precipitationProbability: 15,
        precipitationProbabilityMax: 15,
        windSpeedMax: 14.1,
        uvIndexMax: 3.2,
        vibeCheck: {
          headline: 'Soft clouds and Gilmore Girls energy ☕🍁',
          badge: 'Autumn Chill',
          tagline: 'Gentle breeze rustling golden birch leaves. Prime playlist weather.',
          moodColor: '#B45309',
          score: 88
        },
        ootd: {
          summary: 'Heavyweight cable-knit crewneck and relaxed cords.',
          layers: {
            outerwear: 'Vintage quilted barn jacket',
            top: 'Heavyweight olive cable-knit crewneck',
            bottom: 'Brown relaxed corduroy pants',
            footwear: 'Blundstone 500 leather boots',
            accessories: ['Fisherman beanie', 'Leather crossbody pouch']
          },
          tip: 'Corduroy blocks the brisk afternoon gusts better than loose weave trousers.',
          aesthetic: 'Vintage Heritage'
        },
        activities: {
          primary: 'Secondhand bookstore browsing & specialty pour-over',
          secondary: 'Riverside covered bridge photo walk',
          isIndoorPreferred: false,
          idealTimeOfDay: 'Midday (11:00 AM - 3:00 PM)'
        }
      },
      {
        date: '2026-10-16',
        dayOfWeek: 'Thu',
        dayName: 'Thu',
        weatherCode: 3,
        conditionCategory: 'cloudy',
        conditionLabel: 'Overcast',
        conditionEmoji: '☁️',
        emoji: '☁️',
        temperatureMax: 13.0,
        tempMax: 13.0,
        temperatureMin: 6.2,
        tempMin: 6.2,
        apparentTemperatureMax: 12.1,
        apparentTempMax: 12.1,
        apparentTemperatureMin: 5.0,
        apparentTempMin: 5.0,
        precipitationSum: 0.4,
        precipitationProbability: 25,
        precipitationProbabilityMax: 25,
        windSpeedMax: 10.5,
        uvIndexMax: 2.5,
        vibeCheck: {
          headline: 'Grey sky moodboard & lo-fi playlist immersion ☁️🎧',
          badge: 'Moody Minimal',
          tagline: 'Muted lighting makes every fall photo look cinematic without filters.',
          moodColor: '#78716C',
          score: 84
        },
        ootd: {
          summary: 'Cropped boxy puffer jacket with pleated wide trousers.',
          layers: {
            outerwear: 'Matte cropped boxy down jacket',
            top: 'Waffle-knit thermal crewneck',
            bottom: 'Wide-leg pleated wool trousers',
            footwear: 'New Balance 990v5 in classic grey',
            accessories: ['Over-ear wireless headphones', 'Thermal travel mug']
          },
          tip: 'Overcast skies keep temps steady; wear breathable layers so you do not overheat indoors.',
          aesthetic: 'Moody Gorpcore'
        },
        activities: {
          primary: 'Cozy indie cafe work sprint with dirty chai',
          secondary: 'Antique market exploration',
          isIndoorPreferred: true,
          idealTimeOfDay: 'Afternoon (2:00 PM - 5:00 PM)'
        }
      },
      {
        date: '2026-10-17',
        dayOfWeek: 'Fri',
        dayName: 'Fri',
        weatherCode: 0,
        conditionCategory: 'clear',
        conditionLabel: 'Clear Sky',
        conditionEmoji: '☀️',
        emoji: '☀️',
        temperatureMax: 16.5,
        tempMax: 16.5,
        temperatureMin: 3.8,
        tempMin: 3.8,
        apparentTemperatureMax: 16.0,
        apparentTempMax: 16.0,
        apparentTemperatureMin: 2.6,
        apparentTempMin: 2.6,
        precipitationSum: 0.0,
        precipitationProbability: 5,
        precipitationProbabilityMax: 5,
        windSpeedMax: 9.2,
        uvIndexMax: 4.1,
        vibeCheck: {
          headline: 'Crisp morning frost yields to immaculate golden sun ✨🍂',
          badge: 'Peak Foliage',
          tagline: 'Bright blue skies bouncing off crimson sugar maples. Total visual feast.',
          moodColor: '#F59E0B',
          score: 95
        },
        ootd: {
          summary: 'Fleece zip jacket over graphic tee with carpenter pants.',
          layers: {
            outerwear: 'Deep-pile retro fleece zip jacket',
            top: 'Heavyweight boxy vintage graphic tee',
            bottom: 'Off-white canvas carpenter pants',
            footwear: 'Salomon XT-6 sneakers',
            accessories: ['Dad cap', 'Aesthetic sunglasses', 'Compact camera']
          },
          tip: 'Morning starts at 4°C, so keep the fleece zipped till noon when it hits 16°C.',
          aesthetic: 'Street Outdoors'
        },
        activities: {
          primary: 'Pumpkin patch picking & outdoor cider bar',
          secondary: 'Sunset bonfire with s’mores',
          isIndoorPreferred: false,
          idealTimeOfDay: 'Full Afternoon (12:00 PM - 5:30 PM)'
        }
      },
      {
        date: '2026-10-18',
        dayOfWeek: 'Sat',
        dayName: 'Sat',
        weatherCode: 51,
        conditionCategory: 'drizzle',
        conditionLabel: 'Light Drizzle',
        conditionEmoji: '🌦️',
        emoji: '🌦️',
        temperatureMax: 12.8,
        tempMax: 12.8,
        temperatureMin: 7.0,
        tempMin: 7.0,
        apparentTemperatureMax: 11.5,
        apparentTempMax: 11.5,
        apparentTemperatureMin: 5.8,
        apparentTempMin: 5.8,
        precipitationSum: 2.2,
        precipitationProbability: 60,
        precipitationProbabilityMax: 60,
        windSpeedMax: 13.8,
        uvIndexMax: 2.0,
        vibeCheck: {
          headline: 'Aesthetic drizzle on fall leaves & warm cinnamon vibes 🌧️🍁',
          badge: 'Drizzle Day',
          tagline: 'Gentle misty rain bringing out the richest earthy autumn smells.',
          moodColor: '#9A3412',
          score: 82
        },
        ootd: {
          summary: 'Waxed canvas jacket with waterproof boots and umbrella.',
          layers: {
            outerwear: 'Waxed cotton heritage jacket with corduroy collar',
            top: 'Chunky rollneck wool sweater',
            bottom: 'Water-resistant dark wash denim',
            footwear: 'Treaded waterproof duck boots',
            accessories: ['Windproof wooden-handle umbrella', 'Wool blend socks']
          },
          tip: 'Waxed jacket sheds drizzle without needing a noisy synthetic shell.',
          aesthetic: 'Classic Wet-Weather'
        },
        activities: {
          primary: 'Baking sourdough cinnamon rolls at home',
          secondary: 'Rainy afternoon museum or art gallery visit',
          isIndoorPreferred: true,
          idealTimeOfDay: 'Morning to Mid-Afternoon'
        }
      }
    ]
  }
};
