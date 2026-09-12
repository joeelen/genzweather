import { PresetScenario } from '../types/weather';

export const GOLDEN_HOUR_SPRING: PresetScenario = {
  id: 'golden-hour-spring',
  name: 'Golden Hour Spring Breeze',
  description: 'Dopamine dressing, cherry blossoms, outdoor park picnics, perfect 21°C weather.',
  icon: '🌸',
  themeClass: 'from-pink-500/20 via-rose-400/10 to-emerald-400/20',
  dataset: {
    isPreset: true,
    presetId: 'golden-hour-spring',
    lastUpdated: '2026-09-11T12:00:00Z',
    location: {
      name: 'Kyoto',
      region: 'Kansai',
      country: 'Japan',
      latitude: 35.0116,
      longitude: 135.7681,
      timezone: 'Asia/Tokyo'
    },
    current: {
      temperature: 21.5,
      apparentTemperature: 21.0,
      weatherCode: 1,
      conditionLabel: 'Mainly Clear',
      conditionEmoji: '🌤️',
      emoji: '🌤️',
      relativeHumidity: 48,
      windSpeed: 9.4,
      isDay: true,
      precipitation: 0.0
    },
    daily: [
      {
        date: '2026-04-08',
        dayOfWeek: 'Today',
        dayName: 'Today',
        weatherCode: 1,
        conditionCategory: 'clear',
        conditionLabel: 'Mainly Clear',
        conditionEmoji: '🌤️',
        emoji: '🌤️',
        temperatureMax: 22.0,
        tempMax: 22.0,
        temperatureMin: 11.8,
        tempMin: 11.8,
        apparentTemperatureMax: 21.5,
        apparentTempMax: 21.5,
        apparentTemperatureMin: 11.0,
        apparentTempMin: 11.0,
        precipitationSum: 0.0,
        precipitationProbability: 5,
        precipitationProbabilityMax: 5,
        windSpeedMax: 10.2,
        uvIndexMax: 5.8,
        vibeCheck: {
          headline: 'Dopamine dressing & cherry blossom picnics 🌸✨',
          badge: 'Spring Bloom',
          tagline: 'Gentle petal showers in the breeze. The weather literally could not be more perfect.',
          moodColor: '#F472B6',
          score: 98
        },
        ootd: {
          summary: 'Lightweight pastel cardigan, baby tee, pleated midi skirt, and platform loafers.',
          layers: {
            outerwear: 'Cropped butter-yellow knit cardigan',
            top: 'Fitted white baby tee',
            bottom: 'Flowy pleated pastel sage midi skirt',
            footwear: 'Chunky lug-sole platform loafers with frilly ankle socks',
            accessories: ['Woven wicker shoulder bag', 'Tortoise cat-eye sunglasses', 'Rose lip oil']
          },
          tip: 'Cardigan is easy to drape over shoulders once the afternoon warms to 22°C.',
          aesthetic: 'Coquette Bloom'
        },
        activities: {
          primary: 'Cherry blossom picnic by Kamo River with matcha treats',
          secondary: 'Vintage thrifting through narrow historic alleys',
          isIndoorPreferred: false,
          idealTimeOfDay: 'Golden Hour (4:30 PM - 6:30 PM)'
        }
      },
      {
        date: '2026-04-09',
        dayOfWeek: 'Tomorrow',
        dayName: 'Tomorrow',
        weatherCode: 0,
        conditionCategory: 'clear',
        conditionLabel: 'Clear Sky',
        conditionEmoji: '☀️',
        emoji: '☀️',
        temperatureMax: 23.2,
        tempMax: 23.2,
        temperatureMin: 12.5,
        tempMin: 12.5,
        apparentTemperatureMax: 22.8,
        apparentTempMax: 22.8,
        apparentTemperatureMin: 11.8,
        apparentTempMin: 11.8,
        precipitationSum: 0.0,
        precipitationProbability: 0,
        precipitationProbabilityMax: 0,
        windSpeedMax: 8.5,
        uvIndexMax: 6.2,
        vibeCheck: {
          headline: 'Sunlight filtering through bamboo groves 🎋☀️',
          badge: 'Golden Glow',
          tagline: 'Crystal clear spring sunlight with zero humidity. Prime photography conditions.',
          moodColor: '#EC4899',
          score: 96
        },
        ootd: {
          summary: 'Oversized linen shirt over ribbed tank with wide-leg ecru trousers.',
          layers: {
            outerwear: 'Breezy lilac oversized linen button-down',
            top: 'Fitted ribbed knit tank',
            bottom: 'High-waisted ecru wide-leg denim',
            footwear: 'Adidas Sambas in cream/green',
            accessories: ['Minimalist canvas tote', 'Oval wire sunglasses']
          },
          tip: 'Linen keeps you cool in direct sunlight and adds effortless movement in photos.',
          aesthetic: 'Clean Spring'
        },
        activities: {
          primary: 'Morning bamboo forest walk before tourist rush',
          secondary: 'Ceremonial matcha whisking class',
          isIndoorPreferred: false,
          idealTimeOfDay: 'Morning (8:30 AM - 11:30 AM)'
        }
      },
      {
        date: '2026-04-10',
        dayOfWeek: 'Sat',
        dayName: 'Sat',
        weatherCode: 2,
        conditionCategory: 'cloudy',
        conditionLabel: 'Partly Cloudy',
        conditionEmoji: '⛅',
        emoji: '⛅',
        temperatureMax: 21.0,
        tempMax: 21.0,
        temperatureMin: 13.0,
        tempMin: 13.0,
        apparentTemperatureMax: 20.5,
        apparentTempMax: 20.5,
        apparentTemperatureMin: 12.2,
        apparentTempMin: 12.2,
        precipitationSum: 0.0,
        precipitationProbability: 10,
        precipitationProbabilityMax: 10,
        windSpeedMax: 11.5,
        uvIndexMax: 5.0,
        vibeCheck: {
          headline: 'Soft spring breeze rustling cafe awnings 🍃☕',
          badge: 'Breeze Mode',
          tagline: 'Delightful 21°C balance where you never feel too hot or chilly.',
          moodColor: '#FB7185',
          score: 93
        },
        ootd: {
          summary: 'Lightweight denim jacket, graphic tee, and tiered floral skirt.',
          layers: {
            outerwear: 'Vintage washed denim trucker jacket',
            top: 'Soft cotton graphic tee',
            bottom: 'Tiered floral print midi skirt',
            footwear: 'Classic Converse Chuck 70 high-tops',
            accessories: ['Silk hair ribbon', 'Crossbody camera bag']
          },
          tip: 'Denim jacket handles the evening breeze perfectly when eating outdoors.',
          aesthetic: 'Romantic Indie'
        },
        activities: {
          primary: 'Canalside cafe hopping and strawberry mochi tasting',
          secondary: 'Botanical garden flower gazing',
          isIndoorPreferred: false,
          idealTimeOfDay: 'Afternoon (1:00 PM - 5:00 PM)'
        }
      },
      {
        date: '2026-04-11',
        dayOfWeek: 'Sun',
        dayName: 'Sun',
        weatherCode: 1,
        conditionCategory: 'clear',
        conditionLabel: 'Mainly Clear',
        conditionEmoji: '🌤️',
        emoji: '🌤️',
        temperatureMax: 22.8,
        tempMax: 22.8,
        temperatureMin: 12.0,
        tempMin: 12.0,
        apparentTemperatureMax: 22.2,
        apparentTempMax: 22.2,
        apparentTemperatureMin: 11.4,
        apparentTempMin: 11.4,
        precipitationSum: 0.0,
        precipitationProbability: 5,
        precipitationProbabilityMax: 5,
        windSpeedMax: 9.0,
        uvIndexMax: 6.0,
        vibeCheck: {
          headline: 'Peak weekend brunch and farmers market energy 🧺🍓',
          badge: 'Sunday Bloom',
          tagline: 'Everyone is outside smiling. Vitamin D levels restored to 100%.',
          moodColor: '#F43F5E',
          score: 97
        },
        ootd: {
          summary: 'Cropped crochet short sleeve top with straight leg jeans.',
          layers: {
            top: 'Handmade floral crochet knit short sleeve top',
            bottom: 'High-rise straight leg vintage wash jeans',
            footwear: 'Woven fisherman sandals',
            accessories: ['Beaded necklace', 'Canvas market tote', 'Sunglasses']
          },
          tip: 'Fisherman sandals keep feet cool while offering all-day walking support.',
          aesthetic: 'Artisan Chic'
        },
        activities: {
          primary: 'Outdoor craft market browsing and artisanal gelato',
          secondary: 'Sunset hillside temple viewpoint walk',
          isIndoorPreferred: false,
          idealTimeOfDay: 'Midday to Golden Hour'
        }
      },
      {
        date: '2026-04-12',
        dayOfWeek: 'Mon',
        dayName: 'Mon',
        weatherCode: 2,
        conditionCategory: 'cloudy',
        conditionLabel: 'Partly Cloudy',
        conditionEmoji: '⛅',
        emoji: '⛅',
        temperatureMax: 20.5,
        tempMax: 20.5,
        temperatureMin: 11.2,
        tempMin: 11.2,
        apparentTemperatureMax: 19.8,
        apparentTempMax: 19.8,
        apparentTemperatureMin: 10.5,
        apparentTempMin: 10.5,
        precipitationSum: 0.0,
        precipitationProbability: 15,
        precipitationProbabilityMax: 15,
        windSpeedMax: 12.0,
        uvIndexMax: 4.8,
        vibeCheck: {
          headline: 'Pleasant spring calm before the seasonal showers 🌸🍵',
          badge: 'Gentle Spring',
          tagline: 'Mellow skies, comfortable temps, perfect backdrop for a productive week kick-off.',
          moodColor: '#FDA4AF',
          score: 91
        },
        ootd: {
          summary: 'Oversized blazer over fitted tee with tailored pleated shorts.',
          layers: {
            outerwear: 'Oversized beige linen-blend blazer',
            top: 'Fine ribbed crewneck tee',
            bottom: 'High-waisted tailored pleated shorts',
            footwear: 'Classic white leather court sneakers',
            accessories: ['Structured shoulder bag', 'Tortoise glasses']
          },
          tip: 'An oversized blazer elevates a casual base into effortless smart-casual chic.',
          aesthetic: 'City Chic'
        },
        activities: {
          primary: 'Open-air patio iced coffee work session',
          secondary: 'Evening quiet canal walk',
          isIndoorPreferred: false,
          idealTimeOfDay: 'Afternoon (2:00 PM - 5:00 PM)'
        }
      }
    ]
  }
};
