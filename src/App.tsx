import { useState, useCallback, useRef } from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { PresetBar } from './components/PresetBar';
import { TodayHero } from './components/TodayHero';
import { OOTDSection } from './components/OOTDSection';
import { ActivitiesSection } from './components/ActivitiesSection';
import { ForecastList } from './components/ForecastList';
import { PRESET_SCENARIOS, DEFAULT_PRESET, getPresetById } from './presets/presetData';
import { WeatherDataset, TemperatureUnit, GeocodedCity } from './types/weather';
import { searchCities } from './services/geocodingService';
import { fetchWeatherForecast } from './services/openMeteoService';

interface ToastState {
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function App() {
  const [unit, setUnit] = useState<TemperatureUnit>('celsius');
  const [activePresetId, setActivePresetId] = useState<string>(DEFAULT_PRESET.id);
  const [dataset, setDataset] = useState<WeatherDataset>(DEFAULT_PRESET.dataset);
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(0);
  const [isLoadingWeather, setIsLoadingWeather] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const activeRequestIdRef = useRef<number>(0);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((current) => (current?.message === message ? null : current));
    }, 4000);
  }, []);

  const formatTemp = useCallback(
    (celsius: number): string => {
      if (unit === 'fahrenheit') {
        const f = Math.round((celsius * 9) / 5 + 32);
        return `${f}°F`;
      }
      return `${Math.round(celsius)}°C`;
    },
    [unit]
  );

  const handleToggleUnit = () => {
    setUnit((prev) => (prev === 'celsius' ? 'fahrenheit' : 'celsius'));
  };

  const handleSelectPreset = (id: string) => {
    activeRequestIdRef.current++; // Invalidate any in-flight live weather requests
    setIsLoadingWeather(false);
    const preset = getPresetById(id);
    if (preset) {
      setActivePresetId(preset.id);
      setDataset(preset.dataset);
      setSelectedDayIdx(0);
      showToast(`Switched to preset: ${preset.name}`, 'success');
    }
  };

  const handleSelectCity = async (city: GeocodedCity) => {
    const requestId = ++activeRequestIdRef.current;
    setIsLoadingWeather(true);
    try {
      const newDataset = await fetchWeatherForecast({
        name: city.name,
        region: city.admin1,
        country: city.country,
        latitude: city.latitude,
        longitude: city.longitude,
        timezone: city.timezone ?? 'auto'
      });
      if (requestId !== activeRequestIdRef.current) return;
      setDataset(newDataset);
      setActivePresetId('');
      setSelectedDayIdx(0);
      showToast(`Loaded live forecast for ${city.name}, ${city.country}!`, 'success');
    } catch (err) {
      if (requestId !== activeRequestIdRef.current) return;
      console.warn('City forecast fetch failed, falling back:', err);
      showToast('Live weather temporarily unavailable. Showing offline fallback.', 'error');
    } finally {
      if (requestId === activeRequestIdRef.current) {
        setIsLoadingWeather(false);
      }
    }
  };

  const handleSearchSubmit = async (query: string) => {
    const trimmed = query.trim();
    if (trimmed.length < 2) return;

    const requestId = ++activeRequestIdRef.current;
    setIsLoadingWeather(true);
    try {
      const results = await searchCities(trimmed, { count: 1 });
      if (requestId !== activeRequestIdRef.current) return;
      if (results && results.length > 0) {
        const city = results[0];
        const newDataset = await fetchWeatherForecast({
          name: city.name,
          region: city.admin1,
          country: city.country,
          latitude: city.latitude,
          longitude: city.longitude,
          timezone: city.timezone ?? 'auto'
        });
        if (requestId !== activeRequestIdRef.current) return;
        setDataset(newDataset);
        setActivePresetId('');
        setSelectedDayIdx(0);
        showToast(`Loaded live forecast for ${city.name}, ${city.country}!`, 'success');
      } else {
        showToast(`No city found matching "${trimmed}". Try another name.`, 'error');
      }
    } catch (err) {
      if (requestId !== activeRequestIdRef.current) return;
      console.warn('Search failed:', err);
      showToast('Search request encountered an error.', 'error');
    } finally {
      if (requestId === activeRequestIdRef.current) {
        setIsLoadingWeather(false);
      }
    }
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser.', 'error');
      return;
    }

    const requestId = ++activeRequestIdRef.current;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          if (requestId !== activeRequestIdRef.current) return;
          const { latitude, longitude } = position.coords;
          const newDataset = await fetchWeatherForecast({
            name: 'Local Coordinates',
            country: 'Current Area',
            latitude,
            longitude,
            timezone: 'auto'
          });
          if (requestId !== activeRequestIdRef.current) return;
          setDataset(newDataset);
          setActivePresetId('');
          setSelectedDayIdx(0);
          showToast('Loaded weather for your current location!', 'success');
        } catch (err) {
          if (requestId !== activeRequestIdRef.current) return;
          console.warn('Geolocation weather fetch failed:', err);
          showToast('Could not fetch weather for coordinates.', 'error');
        } finally {
          if (requestId === activeRequestIdRef.current) {
            setIsLocating(false);
          }
        }
      },
      (geoError) => {
        if (requestId !== activeRequestIdRef.current) return;
        console.warn('Geolocation error:', geoError);
        setIsLocating(false);
        showToast('Location permission denied or unavailable. Use city search instead.', 'info');
      },
      { timeout: 10000 }
    );
  };

  const activeDay = dataset.daily[selectedDayIdx] ?? dataset.daily[0] ?? DEFAULT_PRESET.dataset.daily[0];

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-gray-900 font-sans flex flex-col justify-between">
      {/* Top Navbar */}
      <div>
        <Navbar
          unit={unit}
          onToggleUnit={handleToggleUnit}
          onSelectCity={handleSelectCity}
          onSearchSubmit={handleSearchSubmit}
          onGeolocation={handleGeolocation}
          isLocating={isLocating}
          isLoadingWeather={isLoadingWeather}
          currentLocationName={dataset.location.name}
        />

        {/* Presets Scenario Bar */}
        <PresetBar
          presets={PRESET_SCENARIOS}
          activePresetId={activePresetId}
          onSelectPreset={handleSelectPreset}
        />

        {/* Toast Banner Alert */}
        {toast && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-3">
            <div
              className={`p-3 rounded-2xl border-2 border-black shadow-neo flex items-center justify-between gap-3 text-xs sm:text-sm font-bold ${
                toast.type === 'success'
                  ? 'bg-emerald-200 text-emerald-950'
                  : toast.type === 'error'
                  ? 'bg-rose-200 text-rose-950'
                  : 'bg-yellow-200 text-yellow-950'
              }`}
            >
              <div className="flex items-center gap-2">
                {toast.type === 'success' ? (
                  <CheckCircle className="w-4 h-4 text-emerald-800 shrink-0" />
                ) : toast.type === 'error' ? (
                  <AlertCircle className="w-4 h-4 text-rose-800 shrink-0" />
                ) : (
                  <Info className="w-4 h-4 text-yellow-800 shrink-0" />
                )}
                <span>{toast.message}</span>
              </div>
              <button
                onClick={() => setToast(null)}
                className="p-1 hover:bg-black/10 rounded-lg text-black"
                aria-label="Dismiss toast"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Top Bento Row: Today / Selected Day Hero + OOTD Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Today / Active Day Hero Bento Card */}
            <div className="lg:col-span-7 flex">
              <div className="w-full">
                <TodayHero
                  day={activeDay}
                  location={dataset.location}
                  formatTemp={formatTemp}
                  isTodaySelected={selectedDayIdx === 0}
                  onResetToToday={() => setSelectedDayIdx(0)}
                />
              </div>
            </div>

            {/* OOTD Fit Check Bento Card */}
            <div className="lg:col-span-5 flex">
              <div className="w-full">
                <OOTDSection day={activeDay} ootd={activeDay.ootd} />
              </div>
            </div>
          </div>

          {/* Middle Bento Row: Curated Activities */}
          <ActivitiesSection day={activeDay} activities={activeDay.activities} />

          {/* Bottom Bento Row: Multi-Day Forecast Grid */}
          <ForecastList
            daily={dataset.daily}
            selectedDayIdx={selectedDayIdx}
            onSelectDay={(idx) => setSelectedDayIdx(idx)}
            formatTemp={formatTemp}
          />
        </main>
      </div>

      {/* Playful Gen-Z Footer */}
      <footer className="border-t-3 border-black bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-gray-600">
          <div className="flex items-center gap-2">
            <span className="p-1 bg-yellow-300 border border-black rounded-lg text-xs">💅</span>
            <span>Built with zero boring charts, just immaculate fits & vibes</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] uppercase tracking-wider">
            <span>Free & Open-Meteo Powered</span>
            <span>•</span>
            <span>Neo-Brutalist Pop UI</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
