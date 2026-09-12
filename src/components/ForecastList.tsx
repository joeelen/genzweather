import type { FC } from 'react';
import { Calendar, Droplets, CheckCircle2 } from 'lucide-react';
import { NormalizedForecastDay } from '../types/weather';
import { getVibeCheck } from '../engine/vibeEngine';

interface ForecastListProps {
  daily: NormalizedForecastDay[];
  selectedDayIdx: number;
  onSelectDay: (index: number) => void;
  formatTemp: (celsius: number) => string;
}

export const ForecastList: FC<ForecastListProps> = ({
  daily,
  selectedDayIdx,
  onSelectDay,
  formatTemp
}) => {
  return (
    <section className="mt-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <span className="bg-black text-white px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-yellow-300" />
            <span>Multi-Day Forecast</span>
          </span>
          <span className="text-xs font-bold text-gray-500">
            Click any day to inspect full vibe check & fits
          </span>
        </div>

        <span className="text-xs font-extrabold text-gray-600 bg-white border border-black/20 px-2.5 py-1 rounded-lg self-start sm:self-auto">
          {daily.length} Days Available
        </span>
      </div>

      {/* Responsive Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-3 sm:gap-4">
        {daily.map((day, idx) => {
          const isSelected = selectedDayIdx === idx;
          const vibe = day.vibeCheck ?? getVibeCheck(day);
          const hasRainRisk = day.precipitationProbability > 15;

          return (
            <button
              key={`${day.date}-${idx}`}
              type="button"
              onClick={() => onSelectDay(idx)}
              className={`text-left p-4 rounded-2xl transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-yellow-300 border-3 border-black shadow-neo -translate-y-1.5 ring-2 ring-black'
                  : 'bg-white hover:bg-yellow-50 border-2 border-black shadow-neo-sm hover:shadow-neo hover:-translate-y-1 active:translate-y-0'
              }`}
            >
              {/* Selected indicator chip */}
              {isSelected && (
                <span className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 bg-black text-white text-[9px] font-black rounded-md uppercase tracking-wider">
                  <CheckCircle2 className="w-2.5 h-2.5 text-yellow-300" />
                  Active
                </span>
              )}

              <div>
                {/* Day Header */}
                <div className="flex items-baseline justify-between gap-1">
                  <span className="text-xs sm:text-sm font-black text-gray-900 uppercase tracking-tight block">
                    {day.dayOfWeek}
                  </span>
                  <span className="text-[10px] font-bold text-gray-500">
                    {day.date.slice(5)}
                  </span>
                </div>

                {/* Condition Emoji */}
                <div className="my-2.5 flex items-center justify-center p-2 bg-black/5 rounded-xl">
                  <span className="text-4xl block transform hover:scale-110 transition-transform" role="img" aria-label={day.conditionLabel}>
                    {day.conditionEmoji}
                  </span>
                </div>

                {/* Condition Label */}
                <div className="text-[11px] font-extrabold text-gray-700 truncate mb-2">
                  {day.conditionLabel}
                </div>
              </div>

              {/* Temperatures & Vibe Badge */}
              <div className="pt-2 border-t border-black/10">
                <div className="flex items-baseline justify-between gap-1">
                  <span className="text-lg font-black text-gray-900">
                    {formatTemp(day.temperatureMax)}
                  </span>
                  <span className="text-xs font-bold text-gray-600">
                    {formatTemp(day.temperatureMin)}
                  </span>
                </div>

                {/* Micro indicators: Rain & Vibe Score */}
                <div className="flex items-center justify-between gap-1 mt-2 text-[10px] font-extrabold">
                  {hasRainRisk ? (
                    <span className="flex items-center gap-0.5 text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                      <Droplets className="w-2.5 h-2.5" />
                      {day.precipitationProbability}%
                    </span>
                  ) : (
                    <span className="text-gray-400">Dry</span>
                  )}

                  {vibe.score !== undefined && (
                    <span className="bg-purple-100 text-purple-900 border border-purple-300 px-1.5 py-0.5 rounded">
                      ⚡{vibe.score}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
