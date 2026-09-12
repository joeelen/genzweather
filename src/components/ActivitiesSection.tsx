import type { FC } from 'react';
import { Compass, Clock, Home, Sun } from 'lucide-react';
import { ActivityItem, ActivitySuggestions, NormalizedForecastDay } from '../types/weather';
import { getActivitySuggestions } from '../engine/activityEngine';

interface ActivitiesSectionProps {
  day: NormalizedForecastDay;
  activities?: ActivitySuggestions;
}

export const ActivitiesSection: FC<ActivitiesSectionProps> = ({
  day,
  activities: propActivities
}) => {
  const suggestions: ActivitySuggestions =
    propActivities ?? day.activities ?? getActivitySuggestions(day);

  // Normalize into 3 distinct items
  let items: ActivityItem[] = suggestions.activities || suggestions.items || [];
  if (items.length < 3) {
    items = [
      {
        id: 'act_1',
        name: suggestions.primary || 'Coffee run & aesthetic cafe hangout',
        category: suggestions.isIndoorPreferred ? 'indoor' : 'outdoor',
        energy: 'chill',
        social: 'besties',
        description: 'Take your time enjoying specialty drinks and good background lo-fi playlists.',
        emoji: '☕',
        tag: 'Main Event'
      },
      {
        id: 'act_2',
        name: suggestions.secondary || 'Secondhand thrifting & vinyl browsing',
        category: 'indoor',
        energy: 'moderate',
        social: 'besties',
        description: 'Hunt for vintage jackets, oversized knits, and obscure retro records.',
        emoji: '🛍️',
        tag: 'Side Quest'
      },
      {
        id: 'act_3',
        name: suggestions.tertiary || 'Golden hour acoustic park walk',
        category: suggestions.isIndoorPreferred ? 'indoor' : 'outdoor',
        energy: 'chill',
        social: 'solo',
        description: 'Unwind with headphones on and take in the ambient evening lighting.',
        emoji: '🎧',
        tag: 'Evening Vibe'
      }
    ];
  }

  const roleLabels = ['Main Event', 'Side Quest', 'Bonus Quest'];

  const getEnergyColor = (energy: string) => {
    switch (energy) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'moderate':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'chill':
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  };

  const getSocialColor = (social: string) => {
    switch (social) {
      case 'date':
        return 'bg-pink-100 text-pink-800 border-pink-300';
      case 'besties':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'solo':
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  return (
    <section className="bg-[#F3E8FF] border-3 border-black rounded-3xl p-6 sm:p-8 shadow-neo">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-black text-white px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-yellow-300" />
              <span>Curated Activities</span>
            </span>
            <span
              className={`px-3 py-1 border-2 border-black rounded-xl text-xs font-black flex items-center gap-1 ${
                suggestions.isIndoorPreferred
                  ? 'bg-blue-200 text-blue-900'
                  : 'bg-emerald-200 text-emerald-900'
              }`}
            >
              {suggestions.isIndoorPreferred ? (
                <>
                  <Home className="w-3.5 h-3.5" />
                  <span>Indoor Haven Recommended</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5" />
                  <span>Outdoor Friendly</span>
                </>
              )}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            How to spend {day.dayOfWeek}
          </h3>
        </div>

        {/* Ideal Time of Day */}
        {suggestions.idealTimeOfDay && (
          <div className="flex items-center gap-1.5 bg-white border-2 border-black rounded-2xl px-3.5 py-1.5 shadow-neo-sm text-xs font-extrabold text-gray-800 self-start sm:self-auto">
            <Clock className="w-3.5 h-3.5 text-purple-700" />
            <span>Prime Hours: {suggestions.idealTimeOfDay}</span>
          </div>
        )}
      </div>

      {/* 3 Activity Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {items.slice(0, 3).map((item, idx) => (
          <div
            key={item.id || idx}
            className="bg-white border-2 border-black rounded-2xl p-5 shadow-neo hover:shadow-neo-lg hover:-translate-y-1 transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Role and Type Badges */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-0.5 bg-black text-white rounded-lg text-[10px] font-black uppercase tracking-wider">
                  {roleLabels[idx] ?? 'Activity'}
                </span>
                <span className="px-2 py-0.5 bg-gray-100 border border-black/20 rounded-md text-[10px] font-extrabold uppercase text-gray-700">
                  {item.category === 'indoor' ? '🏛️ Indoor' : '🌳 Outdoor'}
                </span>
              </div>

              {/* Title with Emoji */}
              <div className="flex items-start gap-2.5 my-2">
                <span className="text-2xl shrink-0" role="img" aria-label={item.name}>
                  {item.emoji}
                </span>
                <h4 className="text-base font-black text-gray-900 leading-snug group-hover:text-purple-700 transition-colors">
                  {item.name}
                </h4>
              </div>

              {/* Description */}
              <p className="text-xs font-semibold text-gray-600 leading-relaxed mt-2">
                {item.description}
              </p>
            </div>

            {/* Tags row */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span
                  className={`px-2 py-0.5 border rounded-lg text-[10px] font-bold capitalize ${getEnergyColor(
                    item.energy
                  )}`}
                >
                  ⚡ {item.energy}
                </span>
                <span
                  className={`px-2 py-0.5 border rounded-lg text-[10px] font-bold capitalize ${getSocialColor(
                    item.social
                  )}`}
                >
                  👥 {item.social}
                </span>
              </div>
              {item.tag && (
                <span className="text-[10px] font-extrabold text-gray-500 uppercase">
                  #{item.tag.replace(/\s+/g, '')}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
