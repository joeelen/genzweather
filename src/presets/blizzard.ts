import { PresetScenario } from '../types/weather';

export const SUBZERO_BLIZZARD: PresetScenario = {
  id: 'subzero-blizzard',
  name: 'Subzero Blizzard',
  description: 'Freezing Arctic front, howling snow squalls, marshmallow maxi puffer mode, survival core.',
  icon: '❄️',
  themeClass: 'from-cyan-600/20 via-sky-500/15 to-blue-600/20',
  dataset: {
    isPreset: true,
    presetId: 'subzero-blizzard',
    lastUpdated: '2026-09-11T12:00:00Z',
    location: {
      name: 'Reykjavík',
      region: 'Capital Region',
      country: 'Iceland',
      latitude: 64.1466,
      longitude: -21.9426,
      timezone: 'Atlantic/Reykjavik'
    },
    current: {
      temperature: -7.2,
      apparentTemperature: -16.5,
      weatherCode: 75,
      conditionLabel: 'Heavy Snow',
      conditionEmoji: '❄️💨',
      emoji: '❄️💨',
      relativeHumidity: 88,
      windSpeed: 42.0,
      isDay: true,
      precipitation: 8.5
    },
    daily: [
      {
        date: '2026-01-18',
        dayOfWeek: 'Today',
        dayName: 'Today',
        weatherCode: 75,
        conditionCategory: 'snow',
        conditionLabel: 'Heavy Snow',
        conditionEmoji: '❄️💨',
        emoji: '❄️💨',
        temperatureMax: -4.5,
        tempMax: -4.5,
        temperatureMin: -12.0,
        tempMin: -12.0,
        apparentTemperatureMax: -14.2,
        apparentTempMax: -14.2,
        apparentTemperatureMin: -22.5,
        apparentTempMin: -22.5,
        precipitationSum: 18.0,
        precipitationProbability: 95,
        precipitationProbabilityMax: 95,
        windSpeedMax: 48.5,
        uvIndexMax: 0.2,
        vibeCheck: {
          headline: 'Full Marshmallow Puffer survival mode activated 🥶❄️',
          badge: 'Arctic Squall',
          tagline: 'Wind chill feels like -22°C. Eyelashes frosting over in seconds.',
          moodColor: '#06B6D4',
          score: 62
        },
        ootd: {
          summary: 'Floor-length duvet puffer, merino thermal base, balaclava, and Arctic boots.',
          layers: {
            outerwear: '700-fill waterproof maxi down puffer with insulated storm hood',
            top: 'Merino wool 250g thermal base layer + heavyweight fleece sweater',
            bottom: 'Thermal leggings beneath windproof insulated snow pants',
            footwear: 'Shearling-lined Sorel / Moon Boots rated to -30°C',
            accessories: ['Cashmere balaclava', 'Ski goggles (for blizzard squalls)', 'Heated touch-screen mittens']
          },
          tip: 'Zero exposed skin is the golden rule; frostbite risk hits within 15 minutes in this wind chill.',
          aesthetic: 'Arctic Expedition'
        },
        activities: {
          primary: 'Geothermal hot spring lagoon soak surrounded by snowbanks',
          secondary: 'Cinnamon pastry and hot chocolate in wood-paneled bakery',
          isIndoorPreferred: true,
          idealTimeOfDay: 'Midday (11:00 AM - 2:00 PM when Arctic twilight is brightest)'
        }
      },
      {
        date: '2026-01-19',
        dayOfWeek: 'Tomorrow',
        dayName: 'Tomorrow',
        weatherCode: 86,
        conditionCategory: 'snow',
        conditionLabel: 'Heavy Snow Showers',
        conditionEmoji: '❄️🌪️',
        emoji: '❄️🌪️',
        temperatureMax: -5.0,
        tempMax: -5.0,
        temperatureMin: -14.2,
        tempMin: -14.2,
        apparentTemperatureMax: -15.8,
        apparentTempMax: -15.8,
        apparentTemperatureMin: -24.0,
        apparentTempMin: -24.0,
        precipitationSum: 12.5,
        precipitationProbability: 90,
        precipitationProbabilityMax: 90,
        windSpeedMax: 52.0,
        uvIndexMax: 0.2,
        vibeCheck: {
          headline: 'Whiteout gusts and apocalyptic snow drifts 🌪️❄️',
          badge: 'Whiteout Warning',
          tagline: 'Streets blanketed in fresh powder drifts. City sounds completely muffled.',
          moodColor: '#0891B2',
          score: 58
        },
        ootd: {
          summary: 'Expedition technical parka with fleece neck gaiter and snow boots.',
          layers: {
            outerwear: 'Technical Arctic expedition parka with storm flaps',
            top: 'Waffle thermal base + polar fleece hoodie',
            bottom: 'Fleece-lined softshell water-resistant trousers',
            footwear: 'Lug-sole insulated snow boots with ice grips',
            accessories: ['Thick cable-knit beanie', 'Windproof ski gloves', 'Insulated thermos']
          },
          tip: 'Treaded boots with ice-traction cleats prevent treacherous slips on hidden glaze ice.',
          aesthetic: 'Extreme Survival'
        },
        activities: {
          primary: 'Traditional Finnish sauna & cold plunge circuit',
          secondary: 'Cozy hearthside reading with spiced chai',
          isIndoorPreferred: true,
          idealTimeOfDay: 'Afternoon Indoor'
        }
      },
      {
        date: '2026-01-20',
        dayOfWeek: 'Wed',
        dayName: 'Wed',
        weatherCode: 73,
        conditionCategory: 'snow',
        conditionLabel: 'Moderate Snow',
        conditionEmoji: '❄️',
        emoji: '❄️',
        temperatureMax: -3.8,
        tempMax: -3.8,
        temperatureMin: -10.5,
        tempMin: -10.5,
        apparentTemperatureMax: -11.0,
        apparentTempMax: -11.0,
        apparentTemperatureMin: -18.2,
        apparentTempMin: -18.2,
        precipitationSum: 8.0,
        precipitationProbability: 80,
        precipitationProbabilityMax: 80,
        windSpeedMax: 30.0,
        uvIndexMax: 0.3,
        vibeCheck: {
          headline: 'Snow globe magic: gentle flakes and quiet beauty 🌨️✨',
          badge: 'Winter Wonderland',
          tagline: 'Winds dying down while huge fluffy snowflakes drift through the streetlamps.',
          moodColor: '#22D3EE',
          score: 75
        },
        ootd: {
          summary: 'Boxy down puffer, chunky ribbed scarf, and fleece-lined denim.',
          layers: {
            outerwear: 'Matte boxy down puffer jacket',
            top: 'Chunky wool fisherman sweater',
            bottom: 'Flannel-lined relaxed straight jeans',
            footwear: 'Waterproof shearling boots',
            accessories: ['Oversized wool fringe scarf', 'Fleece ear-warmers']
          },
          tip: 'Fluffy snow brushes right off; shake down before stepping into heated rooms.',
          aesthetic: 'Scandi Winter'
        },
        activities: {
          primary: 'Snowy downtown boutique stroll and specialty cocoa run',
          secondary: 'Building aesthetic snowman in the park',
          isIndoorPreferred: false,
          idealTimeOfDay: 'Midday (12:00 PM - 2:30 PM)'
        }
      },
      {
        date: '2026-01-21',
        dayOfWeek: 'Thu',
        dayName: 'Thu',
        weatherCode: 71,
        conditionCategory: 'snow',
        conditionLabel: 'Light Snow',
        conditionEmoji: '🌨️',
        emoji: '🌨️',
        temperatureMax: -2.5,
        tempMax: -2.5,
        temperatureMin: -8.0,
        tempMin: -8.0,
        apparentTemperatureMax: -7.5,
        apparentTempMax: -7.5,
        apparentTemperatureMin: -14.0,
        apparentTempMin: -14.0,
        precipitationSum: 3.2,
        precipitationProbability: 55,
        precipitationProbabilityMax: 55,
        windSpeedMax: 20.0,
        uvIndexMax: 0.4,
        vibeCheck: {
          headline: 'Powder dusting on rooftops and crisp mountain air 🏔️❄️',
          badge: 'Powder Day',
          tagline: 'Crisp, refreshing chill that wakes up your whole soul.',
          moodColor: '#67E8F9',
          score: 82
        },
        ootd: {
          summary: 'Shearling flight jacket, wool knit, and corduroy pants.',
          layers: {
            outerwear: 'Faux shearling-lined aviator jacket',
            top: 'Merino crewneck sweater',
            bottom: 'Heavyweight wide corduroy trousers',
            footwear: 'Lace-up leather winter boots',
            accessories: ['Chunky ribbed beanie', 'Leather insulated gloves']
          },
          tip: 'Shearling provides wind blocking plus plush warmth with vintage styling.',
          aesthetic: 'Vintage Alpine'
        },
        activities: {
          primary: 'Ice skating on illuminated outdoor city rink',
          secondary: 'Fondue dinner with friends',
          isIndoorPreferred: false,
          idealTimeOfDay: 'Afternoon (1:00 PM - 4:00 PM)'
        }
      },
      {
        date: '2026-01-22',
        dayOfWeek: 'Fri',
        dayName: 'Fri',
        weatherCode: 1,
        conditionCategory: 'clear',
        conditionLabel: 'Mainly Clear',
        conditionEmoji: '🌤️',
        emoji: '🌤️',
        temperatureMax: -1.8,
        tempMax: -1.8,
        temperatureMin: -9.5,
        tempMin: -9.5,
        apparentTemperatureMax: -6.0,
        apparentTempMax: -6.0,
        apparentTemperatureMin: -15.0,
        apparentTempMin: -15.0,
        precipitationSum: 0.0,
        precipitationProbability: 10,
        precipitationProbabilityMax: 10,
        windSpeedMax: 15.0,
        uvIndexMax: 0.6,
        vibeCheck: {
          headline: 'Clear Arctic skies with high Northern Lights potential 🌌✨',
          badge: 'Aurora Night',
          tagline: 'Zero cloud cover tonight. Dark sky parks will reveal emerald auroras.',
          moodColor: '#A5F3FC',
          score: 90
        },
        ootd: {
          summary: 'Insulated down parka, wool layers, and thermal boots for night sky viewing.',
          layers: {
            outerwear: 'Heavyweight down parka with reflective trim',
            top: 'Double-knit wool thermal turtleneck',
            bottom: 'Thermal base + fleece cargo pants',
            footwear: 'Extreme cold weather insulated snow boots',
            accessories: ['Camera tripod', 'Hand warmers in pockets', 'Balaclava']
          },
          tip: 'Sitting still for aurora photos gets cold fast; activate chemical hand warmers early.',
          aesthetic: 'Night Expedition'
        },
        activities: {
          primary: 'Northern lights aurora hunting expedition outside city lights',
          secondary: 'Stargazing with thermos of hot spiced apple cider',
          isIndoorPreferred: false,
          idealTimeOfDay: 'Night (9:00 PM - Midnight)'
        }
      }
    ]
  }
};
