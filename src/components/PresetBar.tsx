import type { FC } from 'react';
import { Zap } from 'lucide-react';
import { PresetScenario } from '../types/weather';

interface PresetBarProps {
  presets: PresetScenario[];
  activePresetId?: string;
  onSelectPreset: (id: string) => void;
}

export const PresetBar: FC<PresetBarProps> = ({
  presets,
  activePresetId,
  onSelectPreset
}) => {
  return (
    <section className="bg-[#FFF8E7] border-b-2 border-black py-3 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        {/* Label badge */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="flex items-center gap-1 bg-black text-white px-2.5 py-1 rounded-xl text-xs font-black uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
            <span>Preset Vibes</span>
          </div>
        </div>

        {/* Scrollable preset pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full pb-1 sm:pb-0 scrollbar-thin scrollbar-thumb-black">
          {presets.map((preset) => {
            const isActive = activePresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset.id)}
                type="button"
                className={`group flex items-center gap-2 px-3.5 py-1.5 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition-all border-2 border-black ${
                  isActive
                    ? 'bg-black text-white shadow-neo -translate-y-0.5 ring-2 ring-yellow-400'
                    : 'bg-white text-gray-900 hover:bg-yellow-100 shadow-neo-sm hover:-translate-y-0.5 active:translate-y-0'
                }`}
                title={preset.description}
              >
                <span className="text-base" role="img" aria-label={preset.name}>
                  {preset.icon}
                </span>
                <span>{preset.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
