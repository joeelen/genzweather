import type { FC } from 'react';
import { MapPin, Droplets, Wind, Sun, ArrowUp, ArrowDown, RotateCcw } from 'lucide-react';
import { LocationInfo, NormalizedForecastDay, VibeCheck } from '../types/weather';
import { getVibeCheck } from '../engine/vibeEngine';

interface TodayHeroProps {
  day: NormalizedForecastDay;
  location: LocationInfo;
  formatTemp: (celsius: number) => string;
  isTodaySelected: boolean;
  onResetToToday?: () => void;
}

export const TodayHero: FC<TodayHeroProps> = ({
  day,
  location,
  formatTemp,
  isTodaySelected,
  onResetToToday
}) => {
  // Ensure vibeCheck exists
  const vibe: VibeCheck = day.vibeCheck ?? getVibeCheck(day);
  const vibeScore = vibe.score ?? 70;

  // Dynamic mood-based color theming
  const getMoodStyling = (mood?: string) => {
    switch (mood) {
      case 'heat':
        return {
          bg: 'bg-orange-100',
          accent: 'bg-orange-300',
          badgeBg: 'bg-orange-200',
          pillBg: 'bg-orange-50'
        };
      case 'rain':
        return {
          bg: 'bg-blue-100',
          accent: 'bg-blue-300',
          badgeBg: 'bg-blue-200',
          pillBg: 'bg-blue-50'
        };
      case 'snow':
        return {
          bg: 'bg-cyan-100',
          accent: 'bg-cyan-300',
          badgeBg: 'bg-cyan-200',
          pillBg: 'bg-cyan-50'
        };
      case 'storm':
        return {
          bg: 'bg-purple-100',
          accent: 'bg-purple-300',
          badgeBg: 'bg-purple-200',
          pillBg: 'bg-purple-50'
        };
      case 'sunny':
        return {
          bg: 'bg-amber-100',
          accent: 'bg-yellow-300',
          badgeBg: 'bg-yellow-200',
          pillBg: 'bg-yellow-50'
        };
      case 'mild_cloudy':
      default:
        return {
          bg: 'bg-lime-100',
          accent: 'bg-lime-300',
          badgeBg: 'bg-lime-200',
          pillBg: 'bg-lime-50'
        };
    }
  };

  const theme = getMoodStyling(vibe.mood);

  // Helper for UV rating
  const getUvLevel = (uv: number) => {
    if (uv >= 8) return 'Very High';
    if (uv >= 6) return 'High';
    if (uv >= 3) return 'Moderate';
    return 'Low';
  };

  return (
    <article
      className={`${theme.bg} border-3 border-black rounded-3xl p-6 sm:p-8 shadow-neo transition-all relative overflow-hidden flex flex-col justify-between`}
    >
      {/* Top Bar: Location + Day / Time indicator */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          {/* Location Chip */}
          <div className="flex items-center gap-2 bg-white border-2 border-black rounded-2xl px-3.5 py-1.5 shadow-neo-sm">
            <MapPin className="w-4 h-4 text-purple-700 shrink-0" />
            <span className="text-sm font-black text-gray-900 tracking-tight">
              {location.name}
              {location.region ? `, ${location.region}` : ''}
              {location.country ? ` (${location.country})` : ''}
            </span>
          </div>

          {/* Day selection badge */}
          <div className="flex items-center gap-2">
            {!isTodaySelected && onResetToToday && (
              <button
                onClick={onResetToToday}
                className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-yellow-200 border-2 border-black rounded-xl text-xs font-black shadow-neo-sm active:translate-y-0.5 transition-all"
                title="Return to today's forecast"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Today</span>
              </button>
            )}
            <span className="px-3 py-1 bg-black text-white rounded-xl text-xs font-black uppercase tracking-wider">
              {day.dayOfWeek} • {day.date}
            </span>
          </div>
        </div>

        {/* Hero Content Bento Grid: Temperatures + Condition Emoji */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-baseline gap-3">
              <span className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-gray-900 leading-none">
                {formatTemp(day.temperatureMax)}
              </span>
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-sm font-extrabold text-gray-700 bg-white/80 border border-black/30 px-2 py-0.5 rounded-lg">
                  <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
                  <span>Low {formatTemp(day.temperatureMin)}</span>
                </div>
                <div className="flex items-center gap-1 text-sm font-extrabold text-gray-700 bg-white/80 border border-black/30 px-2 py-0.5 rounded-lg">
                  <ArrowUp className="w-3.5 h-3.5 text-amber-600" />
                  <span>Feels {formatTemp(day.apparentTemperatureMax)}</span>
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <span className="text-lg font-black text-gray-800 uppercase tracking-tight">
                {day.conditionLabel}
              </span>
            </div>
          </div>

          {/* Condition Emoji Bento Box */}
          <div className="flex flex-col items-center justify-center p-5 bg-white border-3 border-black rounded-3xl shadow-neo self-start sm:self-center shrink-0">
            <span className="text-6xl sm:text-7xl block transform hover:scale-110 transition-transform cursor-default" role="img" aria-label={day.conditionLabel}>
              {day.conditionEmoji}
            </span>
          </div>
        </div>

        {/* Vibe Check Bento Box */}
        <div className="mt-6 pt-5 border-t-2 border-black/20">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className={`inline-block px-3 py-1 ${theme.badgeBg} border-2 border-black rounded-xl text-xs font-black uppercase tracking-wider`}>
                {vibe.badge || 'Vibe Check'}
              </span>
              {vibe.tier && (
                <span className="bg-white border-2 border-black text-black px-2.5 py-0.5 rounded-xl text-xs font-bold">
                  {vibe.tier}
                </span>
              )}
            </div>

            {/* Vibe Score Badge */}
            <div className="flex items-center gap-1.5 bg-black text-white px-3 py-1 rounded-xl text-xs font-black">
              <span>VIBE SCORE:</span>
              <span className="text-yellow-300 text-sm font-black">{vibeScore}/100</span>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-snug">
            {vibe.headline}
          </h2>
          <p className="text-sm font-bold text-gray-700 mt-1.5 leading-relaxed">
            {vibe.tagline}
          </p>
        </div>
      </div>

      {/* Non-Cluttered Micro-Metrics Bento Bar */}
      <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t-2 border-black/20">
        <div className={`${theme.pillBg} border-2 border-black rounded-2xl p-3 shadow-neo-sm text-center`}>
          <div className="flex items-center justify-center gap-1 text-xs font-extrabold text-gray-600 mb-1">
            <Droplets className="w-3.5 h-3.5 text-blue-600" />
            <span>Rain Risk</span>
          </div>
          <div className="text-base sm:text-lg font-black text-gray-900">
            {day.precipitationProbability}%
          </div>
          {day.precipitationSum > 0 && (
            <div className="text-[11px] font-bold text-gray-600">
              {day.precipitationSum} mm
            </div>
          )}
        </div>

        <div className={`${theme.pillBg} border-2 border-black rounded-2xl p-3 shadow-neo-sm text-center`}>
          <div className="flex items-center justify-center gap-1 text-xs font-extrabold text-gray-600 mb-1">
            <Wind className="w-3.5 h-3.5 text-emerald-600" />
            <span>Wind Speed</span>
          </div>
          <div className="text-base sm:text-lg font-black text-gray-900">
            {Math.round(day.windSpeedMax)} km/h
          </div>
          <div className="text-[11px] font-bold text-gray-600">
            {day.windSpeedMax > 35 ? 'High Wind' : 'Breezy'}
          </div>
        </div>

        <div className={`${theme.pillBg} border-2 border-black rounded-2xl p-3 shadow-neo-sm text-center`}>
          <div className="flex items-center justify-center gap-1 text-xs font-extrabold text-gray-600 mb-1">
            <Sun className="w-3.5 h-3.5 text-amber-600" />
            <span>UV Index</span>
          </div>
          <div className="text-base sm:text-lg font-black text-gray-900">
            {day.uvIndexMax.toFixed(1)}
          </div>
          <div className="text-[11px] font-bold text-gray-600">
            {getUvLevel(day.uvIndexMax)}
          </div>
        </div>
      </div>
    </article>
  );
};
