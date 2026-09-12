import type { FC } from 'react';
import { Shirt, AlertTriangle, Lightbulb } from 'lucide-react';
import { NormalizedForecastDay, OOTDRecommendation } from '../types/weather';
import { getOOTDRecommendation } from '../engine/ootdEngine';

interface OOTDSectionProps {
  day: NormalizedForecastDay;
  ootd?: OOTDRecommendation;
}

export const OOTDSection: FC<OOTDSectionProps> = ({ day, ootd: propOotd }) => {
  const ootd: OOTDRecommendation = propOotd ?? day.ootd ?? getOOTDRecommendation(day);

  const aestheticTitle = ootd.aesthetic ?? ootd.aestheticVibe ?? 'Daily Fit';
  const proTip = ootd.tip ?? ootd.proTip ?? 'Dress for comfort and vibe.';
  const avoidList = ootd.avoidList ?? [];
  const layers = ootd.layers;

  return (
    <section className="bg-[#E9FBE7] border-3 border-black rounded-3xl p-6 sm:p-8 shadow-neo flex flex-col justify-between">
      <div>
        {/* Header Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="bg-black text-white px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
              <Shirt className="w-3.5 h-3.5 text-yellow-300" />
              <span>Fit Check // OOTD</span>
            </span>
            <span className="bg-white border-2 border-black px-2.5 py-0.5 rounded-xl text-xs font-black text-emerald-800">
              {aestheticTitle}
            </span>
          </div>

          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            {day.dayOfWeek} Edition
          </span>
        </div>

        {/* Outfit Summary Headline */}
        <h3 className="text-xl sm:text-2xl font-black text-gray-900 leading-snug">
          {ootd.summary}
        </h3>

        {/* Color Palette Swatches if available */}
        {ootd.colorPalette && ootd.colorPalette.length > 0 && (
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-black uppercase text-gray-600">Color Palette:</span>
            {ootd.colorPalette.map((color, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-2 py-0.5 bg-white border border-black rounded-lg text-xs font-bold text-gray-800 shadow-2xs"
              >
                {color}
              </span>
            ))}
          </div>
        )}

        {/* Layers Stack */}
        <div className="mt-5 space-y-2.5">
          {/* Outerwear */}
          <div className="bg-white border-2 border-black rounded-2xl p-3 shadow-neo-sm flex items-start gap-3">
            <div className="p-2 bg-yellow-200 border border-black rounded-xl text-sm shrink-0">
              🧥
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-black uppercase text-gray-500 block">
                Outerwear
              </span>
              <p className="text-sm font-bold text-gray-900">
                {layers?.outerwear || ootd.outerwear || 'No jacket needed — stay breezy! ☀️'}
              </p>
            </div>
          </div>

          {/* Top */}
          <div className="bg-white border-2 border-black rounded-2xl p-3 shadow-neo-sm flex items-start gap-3">
            <div className="p-2 bg-pink-200 border border-black rounded-xl text-sm shrink-0">
              👕
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-black uppercase text-gray-500 block">
                Top Layer
              </span>
              <p className="text-sm font-bold text-gray-900">
                {layers?.top || ootd.top || 'Comfortable cotton basic'}
              </p>
            </div>
          </div>

          {/* Bottom */}
          <div className="bg-white border-2 border-black rounded-2xl p-3 shadow-neo-sm flex items-start gap-3">
            <div className="p-2 bg-blue-200 border border-black rounded-xl text-sm shrink-0">
              👖
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-black uppercase text-gray-500 block">
                Bottom
              </span>
              <p className="text-sm font-bold text-gray-900">
                {layers?.bottom || ootd.bottom || 'Relaxed bottoms'}
              </p>
            </div>
          </div>

          {/* Footwear */}
          <div className="bg-white border-2 border-black rounded-2xl p-3 shadow-neo-sm flex items-start gap-3">
            <div className="p-2 bg-purple-200 border border-black rounded-xl text-sm shrink-0">
              👟
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-black uppercase text-gray-500 block">
                Footwear
              </span>
              <p className="text-sm font-bold text-gray-900">
                {layers?.footwear || ootd.footwear || 'Clean daily kicks'}
              </p>
            </div>
          </div>

          {/* Accessories */}
          {((layers?.accessories && layers.accessories.length > 0) || (ootd.accessories && ootd.accessories.length > 0)) && (
            <div className="bg-white border-2 border-black rounded-2xl p-3 shadow-neo-sm flex items-start gap-3">
              <div className="p-2 bg-emerald-200 border border-black rounded-xl text-sm shrink-0">
                🎒
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-black uppercase text-gray-500 block">
                  Accessories
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {(layers?.accessories || ootd.accessories || []).map((acc, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-gray-100 border border-black/40 rounded-lg text-xs font-bold text-gray-800"
                    >
                      {acc}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer: Style Tip & Avoid Items */}
      <div className="mt-5 pt-4 border-t-2 border-black/20 space-y-3">
        {/* Pro Tip */}
        <div className="bg-yellow-200 border-2 border-black rounded-2xl p-3.5 shadow-neo-sm flex items-start gap-2.5">
          <Lightbulb className="w-4 h-4 text-amber-900 shrink-0 mt-0.5" />
          <div className="text-xs font-bold text-amber-950 leading-relaxed">
            <span className="font-black uppercase block text-[10px] tracking-wider text-amber-900">
              Fit Pro-Tip
            </span>
            {proTip}
          </div>
        </div>

        {/* Avoid list */}
        {avoidList.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-black uppercase text-red-600 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              Avoid today:
            </span>
            {avoidList.map((item, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-red-100 border border-red-300 rounded-lg text-xs font-bold text-red-800 line-through"
              >
                {item}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
