import { useState, useEffect, useRef } from 'react';
import type { FC, FormEvent } from 'react';
import { Search, Compass, Sparkles, MapPin, X, Loader2 } from 'lucide-react';
import { GeocodedCity, TemperatureUnit } from '../types/weather';
import { searchCities, formatLocationName } from '../services/geocodingService';

interface NavbarProps {
  unit: TemperatureUnit;
  onToggleUnit: () => void;
  onSelectCity: (city: GeocodedCity) => void;
  onSearchSubmit: (query: string) => void;
  onGeolocation: () => void;
  isLocating?: boolean;
  isLoadingWeather?: boolean;
  currentLocationName?: string;
}

export const Navbar: FC<NavbarProps> = ({
  unit,
  onToggleUnit,
  onSelectCity,
  onSearchSubmit,
  onGeolocation,
  isLocating = false,
  isLoadingWeather = false,
  currentLocationName
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<GeocodedCity[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced autocomplete search
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    let isMounted = true;
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchCities(trimmed, { count: 5 });
        if (isMounted) {
          setSuggestions(results);
          setShowDropdown(results.length > 0);
        }
      } catch (err) {
        if (isMounted) {
          setSuggestions([]);
        }
      } finally {
        if (isMounted) {
          setIsSearching(false);
        }
      }
    }, 280);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [query]);

  // Click outside to close autocomplete dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed.length >= 2) {
      setShowDropdown(false);
      onSearchSubmit(trimmed);
    }
  };

  const handleSelectSuggestion = (city: GeocodedCity) => {
    setQuery(city.name);
    setShowDropdown(false);
    onSelectCity(city);
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  return (
    <header className="border-b-3 border-black bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
        {/* Brand Logo */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-yellow-300 border-2 border-black rounded-2xl flex items-center justify-center shadow-neo-sm transform -rotate-2 hover:rotate-0 transition-transform">
              <span className="text-2xl" role="img" aria-label="lightning bolt">
                ⚡
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight uppercase leading-none">
                  Gen-Z Weather
                </h1>
                <span className="hidden sm:inline-block bg-pink-200 border border-black text-[10px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                  VIBE OS
                </span>
              </div>
              <p className="text-xs font-bold text-gray-600 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-600 inline" />
                no boring charts, just vibes & fits
              </p>
            </div>
          </div>

          {/* Mobile Geolocation + Unit Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={onGeolocation}
              disabled={isLocating}
              aria-label="Use my location"
              className="p-2 bg-purple-100 hover:bg-purple-200 border-2 border-black rounded-xl shadow-neo-sm active:translate-y-0.5 transition-all disabled:opacity-60"
              title="Use current geolocation"
            >
              {isLocating ? (
                <Loader2 className="w-5 h-5 text-purple-700 animate-spin" />
              ) : (
                <MapPin className="w-5 h-5 text-purple-700" />
              )}
            </button>
            <button
              onClick={onToggleUnit}
              aria-label="Toggle temperature unit"
              className="px-3 py-1.5 bg-yellow-300 hover:bg-yellow-400 border-2 border-black rounded-xl shadow-neo-sm font-black text-sm active:translate-y-0.5 transition-all"
            >
              {unit === 'celsius' ? '°C' : '°F'}
            </button>
          </div>
        </div>

        {/* City Search Bar with Autocomplete */}
        <div className="relative w-full md:max-w-md" ref={dropdownRef}>
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <div className="absolute left-3.5 text-gray-500 pointer-events-none flex items-center">
              {isSearching || isLoadingWeather ? (
                <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
              ) : (
                <Search className="w-4 h-4 text-black" />
              )}
            </div>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => {
                if (suggestions.length > 0) setShowDropdown(true);
              }}
              placeholder={currentLocationName ? `Search city (current: ${currentLocationName})...` : "Search city (e.g. Tokyo, London, Miami)..."}
              aria-label="Search city name"
              className="w-full pl-10 pr-20 py-2.5 bg-white border-2 border-black rounded-2xl shadow-neo-sm focus:shadow-neo focus:outline-none text-sm font-bold text-gray-900 placeholder:text-gray-400 transition-all"
            />
            <div className="absolute right-2.5 flex items-center gap-1">
              {query && (
                <button
                  type="button"
                  onClick={handleClear}
                  aria-label="Clear query"
                  className="p-1 text-gray-500 hover:text-black hover:bg-gray-100 rounded-full"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="submit"
                aria-label="Submit search"
                className="px-2.5 py-1 bg-black text-white rounded-lg text-xs font-black uppercase hover:bg-gray-800 transition-colors"
              >
                Go
              </button>
            </div>
          </form>

          {/* Autocomplete Suggestions Dropdown */}
          {showDropdown && suggestions.length > 0 && (
            <ul
              className="absolute left-0 right-0 mt-2 bg-white border-2 border-black rounded-2xl shadow-neo py-2 z-50 max-h-64 overflow-y-auto"
              role="listbox"
            >
              {suggestions.map((city) => (
                <li key={`${city.id}-${city.latitude}-${city.longitude}`}>
                  <button
                    type="button"
                    onClick={() => handleSelectSuggestion(city)}
                    className="w-full text-left px-4 py-2 hover:bg-yellow-100 flex items-center justify-between gap-2 text-sm font-bold text-gray-900 border-b border-gray-100 last:border-b-0 transition-colors"
                  >
                    <span className="flex items-center gap-2 truncate">
                      <MapPin className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                      <span className="truncate">{formatLocationName(city)}</span>
                    </span>
                    <span className="text-[10px] uppercase font-black px-1.5 py-0.5 bg-gray-100 border border-black/20 rounded">
                      {city.country_code ?? 'GEO'}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Desktop Geolocation & Unit Controls */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onGeolocation}
            disabled={isLocating}
            aria-label="Use my location"
            className="flex items-center gap-2 px-3.5 py-2 bg-purple-100 hover:bg-purple-200 border-2 border-black rounded-2xl shadow-neo-sm hover:shadow-neo active:translate-y-0.5 transition-all text-xs font-black uppercase disabled:opacity-60"
            title="Use current device geolocation"
          >
            {isLocating ? (
              <Loader2 className="w-4 h-4 text-purple-700 animate-spin" />
            ) : (
              <Compass className="w-4 h-4 text-purple-700" />
            )}
            <span>{isLocating ? 'Locating...' : 'My Location'}</span>
          </button>

          {/* Unit Toggle Pill */}
          <div className="flex items-center bg-gray-100 border-2 border-black rounded-2xl p-1 shadow-neo-sm">
            <button
              onClick={() => unit !== 'celsius' && onToggleUnit()}
              aria-label="Set Celsius"
              className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${
                unit === 'celsius'
                  ? 'bg-yellow-300 text-black border border-black shadow-xs'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              °C
            </button>
            <button
              onClick={() => unit !== 'fahrenheit' && onToggleUnit()}
              aria-label="Set Fahrenheit"
              className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${
                unit === 'fahrenheit'
                  ? 'bg-yellow-300 text-black border border-black shadow-xs'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              °F
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
