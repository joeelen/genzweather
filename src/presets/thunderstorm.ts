import { PresetScenario } from '../types/weather';

export const CHAOTIC_SUMMER_THUNDERSTORM: PresetScenario = {
  id: 'summer-thunderstorm',
  name: 'Chaotic Summer Thunderstorm',
  description: 'Dramatic purple-black clouds, lightning bolts, sudden tropical downpour, cinematic chaos.',
  icon: '⚡',
  themeClass: 'from-purple-600/25 via-indigo-600/15 to-violet-500/20',
  dataset: {
    isPreset: true,
    presetId: 'summer-thunderstorm',
    lastUpdated: '2026-09-11T12:00:00Z',
    location: {
      name: 'Miami',
      region: 'Florida',
      country: 'United States',
      latitude: 25.7617,
      longitude: -80.1918,
      timezone: 'America/New_York'
    },
    current: {
      temperature: 30.5,
      apparentTemperature: 36.2,
      weatherCode: 95,
      conditionLabel: 'Thunderstorm',
      conditionEmoji: '⛈️',
      emoji: '⛈️',
      relativeHumidity: 88,
      windSpeed: 38.0,
      isDay: true,
      precipitation: 16.0
    },
    daily: [
      {
        date: '2026-08-12',
        dayOfWeek: 'Today',
        dayName: 'Today',
        weatherCode: 95,
        conditionCategory: 'thunderstorm',
        conditionLabel: 'Thunderstorm',
        conditionEmoji: '⛈️',
        emoji: '⛈️',
        temperatureMax: 31.5,
        tempMax: 31.5,
        temperatureMin: 24.2,
        tempMin: 24.2,
        apparentTemperatureMax: 38.5,
        apparentTempMax: 38.5,
        apparentTemperatureMin: 27.0,
        apparentTempMin: 27.0,
        precipitationSum: 28.5,
        precipitationProbability: 95,
        precipitationProbabilityMax: 95,
        windSpeedMax: 46.0,
        uvIndexMax: 4.5,
        vibeCheck: {
          headline: 'Sky is currently throwing a temper tantrum ⚡⛈️',
          badge: 'Thunder Chaos',
          tagline: 'Pitch black sky at 3 PM, strobe lightning flashes, and torrential tropical rain bursts.',
          moodColor: '#7C3AED',
          score: 68
        },
        ootd: {
          summary: 'Quick-dry water-resistant camp shirt, nylon shorts, and waterproof slides.',
          layers: {
            top: 'Quick-dry lightweight technical camp shirt',
            bottom: 'Water-repellent nylon amphibious shorts',
            footwear: 'Waterproof slide sandals or EVA foam runners',
            accessories: ['Waterproof phone dry-bag', 'Vented storm umbrella (or leave umbrella, gusts are wild)']
          },
          tip: 'Regular raincoats turn into personal saunas at 31°C; wear fast-drying shorts and breathable tops.',
          aesthetic: 'Tropical Stormcore'
        },
        activities: {
          primary: 'Watching dramatic lightning over the ocean from high-rise cafe',
          secondary: 'Indoor arcade and boba sanctuary',
          isIndoorPreferred: true,
          idealTimeOfDay: 'Afternoon Storm Window (2:30 PM - 5:30 PM)'
        }
      },
      {
        date: '2026-08-13',
        dayOfWeek: 'Tomorrow',
        dayName: 'Tomorrow',
        weatherCode: 96,
        conditionCategory: 'thunderstorm',
        conditionLabel: 'Thunderstorm with Hail',
        conditionEmoji: '⛈️🧊',
        emoji: '⛈️🧊',
        temperatureMax: 30.8,
        tempMax: 30.8,
        temperatureMin: 24.5,
        tempMin: 24.5,
        apparentTemperatureMax: 37.8,
        apparentTempMax: 37.8,
        apparentTemperatureMin: 27.5,
        apparentTempMin: 27.5,
        precipitationSum: 34.0,
        precipitationProbability: 90,
        precipitationProbabilityMax: 90,
        windSpeedMax: 50.0,
        uvIndexMax: 4.0,
        vibeCheck: {
          headline: 'Boss level storm: hail, purple sky, and cinema drama 🟣⚡',
          badge: 'Severe Drama',
          tagline: 'Insane atmospheric energy. Palm trees bending in 50 km/h squalls.',
          moodColor: '#6D28D9',
          score: 60
        },
        ootd: {
          summary: 'Lightweight packable shell with waterproof gym duffel.',
          layers: {
            outerwear: 'Vented ultralight packable storm shell',
            top: 'Moisture-wicking active tank',
            bottom: 'Quick-dry stretch board shorts',
            footwear: 'Teva hurricane waterproof sandals',
            accessories: ['Dry-pack backpack', 'Baseball cap']
          },
          tip: 'Hail pellets and strong gusts make umbrellas useless; take shelter in sturdy buildings.',
          aesthetic: 'Storm Ready'
        },
        activities: {
          primary: 'Indoor bowling or retro roller rink hangout',
          secondary: 'Tropical comfort food feast (empanadas & Cuban coffee)',
          isIndoorPreferred: true,
          idealTimeOfDay: 'Full Afternoon'
        }
      },
      {
        date: '2026-08-14',
        dayOfWeek: 'Fri',
        dayName: 'Fri',
        weatherCode: 81,
        conditionCategory: 'rain',
        conditionLabel: 'Moderate Rain Showers',
        conditionEmoji: '🌧️',
        emoji: '🌧️',
        temperatureMax: 31.0,
        tempMax: 31.0,
        temperatureMin: 24.8,
        tempMin: 24.8,
        apparentTemperatureMax: 37.0,
        apparentTempMax: 37.0,
        apparentTemperatureMin: 27.2,
        apparentTempMin: 27.2,
        precipitationSum: 12.0,
        precipitationProbability: 70,
        precipitationProbabilityMax: 70,
        windSpeedMax: 25.0,
        uvIndexMax: 6.5,
        vibeCheck: {
          headline: 'Heavy steam rising off wet asphalt after the squall 🌴💨',
          badge: 'Tropical Steam',
          tagline: 'High humidity, post-rain freshness, lush palm fronds dripping with raindrops.',
          moodColor: '#8B5CF6',
          score: 74
        },
        ootd: {
          summary: 'Open linen overshirt, ribbed crop top, and relaxed shorts.',
          layers: {
            outerwear: 'Open linen short-sleeve overshirt',
            top: 'Ribbed crop tank',
            bottom: 'Relaxed cotton drawstring shorts',
            footwear: 'Platform slide sandals',
            accessories: ['Sunglasses', 'Mini tote umbrella']
          },
          tip: 'Humidity will be 85%+; keep garments loose and unbuttoned for maximum airflow.',
          aesthetic: 'Lush Tropical'
        },
        activities: {
          primary: 'Lush botanical garden walk with raindrops on giant tropical leaves',
          secondary: 'Iced coffee on covered outdoor patio',
          isIndoorPreferred: false,
          idealTimeOfDay: 'Morning or Late Afternoon'
        }
      },
      {
        date: '2026-08-15',
        dayOfWeek: 'Sat',
        dayName: 'Sat',
        weatherCode: 2,
        conditionCategory: 'cloudy',
        conditionLabel: 'Partly Cloudy',
        conditionEmoji: '⛅',
        emoji: '⛅',
        temperatureMax: 32.2,
        tempMax: 32.2,
        temperatureMin: 25.0,
        tempMin: 25.0,
        apparentTemperatureMax: 38.0,
        apparentTempMax: 38.0,
        apparentTemperatureMin: 27.8,
        apparentTempMin: 27.8,
        precipitationSum: 2.5,
        precipitationProbability: 35,
        precipitationProbabilityMax: 35,
        windSpeedMax: 18.0,
        uvIndexMax: 8.5,
        vibeCheck: {
          headline: 'Storms clear just in time for golden hour beach vibes 🏖️🌅',
          badge: 'Beach Window',
          tagline: 'Vibrant blue waters and pristine sunset colors following the storm system.',
          moodColor: '#A78BFA',
          score: 89
        },
        ootd: {
          summary: 'Crochet beach shirt, board shorts, and slide sandals.',
          layers: {
            top: 'Open-weave crochet knit resort top',
            bottom: 'Retro patterned swim trunks',
            footwear: 'Waterproof slide sandals',
            accessories: ['Polarized sunglasses', 'Beach tote', 'SPF 50 mineral sunscreen']
          },
          tip: 'Sun is blazing hot now that storm clouds passed; sunscreen is vital.',
          aesthetic: 'Resort Beach'
        },
        activities: {
          primary: 'Late afternoon ocean swim & sunset beach hangout',
          secondary: 'Smoothie bowl stop and coastal walk',
          isIndoorPreferred: false,
          idealTimeOfDay: 'Golden Hour (5:30 PM - 7:30 PM)'
        }
      },
      {
        date: '2026-08-16',
        dayOfWeek: 'Sun',
        dayName: 'Sun',
        weatherCode: 80,
        conditionCategory: 'rain',
        conditionLabel: 'Slight Showers',
        conditionEmoji: '🌦️',
        emoji: '🌦️',
        temperatureMax: 31.8,
        tempMax: 31.8,
        temperatureMin: 24.8,
        tempMin: 24.8,
        apparentTemperatureMax: 37.5,
        apparentTempMax: 37.5,
        apparentTemperatureMin: 27.2,
        apparentTempMin: 27.2,
        precipitationSum: 4.0,
        precipitationProbability: 40,
        precipitationProbabilityMax: 40,
        windSpeedMax: 15.0,
        uvIndexMax: 7.8,
        vibeCheck: {
          headline: 'Sun showers and sparkling palm trees 🌦️🌴',
          badge: 'Sun Shower',
          tagline: 'Raining while the sun is out. Rainbow sightings practically guaranteed.',
          moodColor: '#C4B5FD',
          score: 85
        },
        ootd: {
          summary: 'Lightweight camp collar shirt and nylon shorts.',
          layers: {
            top: 'Breezy printed rayon camp collar shirt',
            bottom: 'Elastic waist nylon shorts',
            footwear: 'Slip-on water resistant slides',
            accessories: ['Colorful bucket hat', 'Sunglasses']
          },
          tip: 'Sun showers feel refreshing rather than chilly; embrace the quick splash.',
          aesthetic: 'Miami Casual'
        },
        activities: {
          primary: 'Outdoor brunch under covered patio umbrella',
          secondary: 'Art walk through Wynwood murals',
          isIndoorPreferred: false,
          idealTimeOfDay: 'Morning (10:00 AM - 1:00 PM)'
        }
      }
    ]
  }
};
