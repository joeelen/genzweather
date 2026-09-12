import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Navbar } from '../components/Navbar';
import { PresetBar } from '../components/PresetBar';
import { TodayHero } from '../components/TodayHero';
import { OOTDSection } from '../components/OOTDSection';
import { ActivitiesSection } from '../components/ActivitiesSection';
import { ForecastList } from '../components/ForecastList';
import { AUTUMN_SWEATER_WEATHER, PRESET_SCENARIOS } from '../presets/presetData';
import { SCORCHING_HEATWAVE } from '../presets/heatwave';

describe('Gen-Z Weather UI Components Test Suite', () => {
  const sampleDay = AUTUMN_SWEATER_WEATHER.dataset.daily[0];
  const sampleLocation = AUTUMN_SWEATER_WEATHER.dataset.location;
  const formatTempC = (c: number) => `${Math.round(c)}°C`;
  const formatTempF = (c: number) => `${Math.round((c * 9) / 5 + 32)}°F`;

  // =========================================================================
  // 1. Navbar Component Tests
  // =========================================================================
  describe('Navbar Component', () => {
    it('renders brand logo and punchy title', () => {
      render(
        <Navbar
          unit="celsius"
          onToggleUnit={vi.fn()}
          onSelectCity={vi.fn()}
          onSearchSubmit={vi.fn()}
          onGeolocation={vi.fn()}
        />
      );

      expect(screen.getByText('Gen-Z Weather')).toBeInTheDocument();
      expect(screen.getByText(/no boring charts/i)).toBeInTheDocument();
    });

    it('handles temperature unit toggle interaction', () => {
      const toggleMock = vi.fn();
      render(
        <Navbar
          unit="celsius"
          onToggleUnit={toggleMock}
          onSelectCity={vi.fn()}
          onSearchSubmit={vi.fn()}
          onGeolocation={vi.fn()}
        />
      );

      // Mobile button has aria-label 'Toggle temperature unit', desktop has 'Set Fahrenheit'
      const fahrenheitBtn = screen.getByRole('button', { name: /set fahrenheit/i });
      fireEvent.click(fahrenheitBtn);
      expect(toggleMock).toHaveBeenCalled();
    });

    it('triggers geolocation callback when geolocation button is clicked', () => {
      const geoMock = vi.fn();
      render(
        <Navbar
          unit="celsius"
          onToggleUnit={vi.fn()}
          onSelectCity={vi.fn()}
          onSearchSubmit={vi.fn()}
          onGeolocation={geoMock}
        />
      );

      const geoBtns = screen.getAllByTitle(/geolocation/i);
      expect(geoBtns.length).toBeGreaterThan(0);
      fireEvent.click(geoBtns[0]);
      expect(geoMock).toHaveBeenCalled();
    });

    it('allows searching and calls onSearchSubmit upon form submission', () => {
      const searchSubmitMock = vi.fn();
      render(
        <Navbar
          unit="celsius"
          onToggleUnit={vi.fn()}
          onSelectCity={vi.fn()}
          onSearchSubmit={searchSubmitMock}
          onGeolocation={vi.fn()}
        />
      );

      const input = screen.getByRole('textbox', { name: /search city/i });
      fireEvent.change(input, { target: { value: 'Reykjavik' } });
      expect((input as HTMLInputElement).value).toBe('Reykjavik');

      const submitBtn = screen.getByRole('button', { name: /submit search/i });
      fireEvent.click(submitBtn);
      expect(searchSubmitMock).toHaveBeenCalledWith('Reykjavik');
    });
  });

  // =========================================================================
  // 2. PresetBar Component Tests
  // =========================================================================
  describe('PresetBar Component', () => {
    it('renders all 6 preset pills with icons and titles', () => {
      render(
        <PresetBar
          presets={PRESET_SCENARIOS}
          activePresetId="autumn-sweater-weather"
          onSelectPreset={vi.fn()}
        />
      );

      for (const preset of PRESET_SCENARIOS) {
        expect(screen.getByText(preset.name)).toBeInTheDocument();
      }
    });

    it('triggers onSelectPreset with the clicked preset ID', () => {
      const selectMock = vi.fn();
      render(
        <PresetBar
          presets={PRESET_SCENARIOS}
          activePresetId="autumn-sweater-weather"
          onSelectPreset={selectMock}
        />
      );

      const heatwaveBtn = screen.getByText('Scorching Heatwave');
      fireEvent.click(heatwaveBtn);
      expect(selectMock).toHaveBeenCalledWith('scorching-heatwave');
    });
  });

  // =========================================================================
  // 3. TodayHero Component Tests
  // =========================================================================
  describe('TodayHero Component', () => {
    it('displays location name, temperatures, condition emoji, and Vibe Check', () => {
      render(
        <TodayHero
          day={sampleDay}
          location={sampleLocation}
          formatTemp={formatTempC}
          isTodaySelected={true}
        />
      );

      // Location
      expect(screen.getByText(/Woodstock/i)).toBeInTheDocument();

      // High & Low temperatures
      expect(screen.getByText(formatTempC(sampleDay.temperatureMax))).toBeInTheDocument();
      expect(screen.getByText(new RegExp(`Low ${formatTempC(sampleDay.temperatureMin)}`, 'i'))).toBeInTheDocument();
      expect(screen.getByText(new RegExp(`Feels ${formatTempC(sampleDay.apparentTemperatureMax)}`, 'i'))).toBeInTheDocument();

      // Condition label and emoji
      expect(screen.getByText(sampleDay.conditionLabel)).toBeInTheDocument();
      expect(screen.getByText(sampleDay.conditionEmoji)).toBeInTheDocument();

      // Vibe Check headline & score
      expect(screen.getByText(sampleDay.vibeCheck!.headline)).toBeInTheDocument();
      expect(screen.getByText(/VIBE SCORE:/i)).toBeInTheDocument();

      // Non-cluttered micro-metrics
      expect(screen.getByText(/Rain Risk/i)).toBeInTheDocument();
      expect(screen.getByText(/Wind Speed/i)).toBeInTheDocument();
      expect(screen.getByText(/UV Index/i)).toBeInTheDocument();
    });

    it('renders return-to-today button when viewing a future day', () => {
      const resetMock = vi.fn();
      render(
        <TodayHero
          day={sampleDay}
          location={sampleLocation}
          formatTemp={formatTempC}
          isTodaySelected={false}
          onResetToToday={resetMock}
        />
      );

      const todayBtn = screen.getByTitle(/return to today/i);
      expect(todayBtn).toBeInTheDocument();
      fireEvent.click(todayBtn);
      expect(resetMock).toHaveBeenCalled();
    });

    it('correctly formats temperatures in Fahrenheit', () => {
      render(
        <TodayHero
          day={sampleDay}
          location={sampleLocation}
          formatTemp={formatTempF}
          isTodaySelected={true}
        />
      );

      expect(screen.getByText('60°F')).toBeInTheDocument();
      expect(screen.getByText(/Low 42°F/i)).toBeInTheDocument();
    });
  });

  // =========================================================================
  // 4. OOTDSection Component Tests
  // =========================================================================
  describe('OOTDSection Component', () => {
    it('displays aesthetic title, outfit summary, layers, and pro tip', () => {
      render(<OOTDSection day={sampleDay} ootd={sampleDay.ootd} />);

      expect(screen.getByText(/Fit Check/i)).toBeInTheDocument();
      expect(screen.getByText(sampleDay.ootd!.summary)).toBeInTheDocument();
      expect(screen.getByText(sampleDay.ootd!.layers.top)).toBeInTheDocument();
      expect(screen.getByText(sampleDay.ootd!.layers.bottom)).toBeInTheDocument();
      expect(screen.getByText(sampleDay.ootd!.layers.footwear)).toBeInTheDocument();
      expect(screen.getByText(sampleDay.ootd!.tip)).toBeInTheDocument();
    });

    it('displays avoid list when available for extreme scenarios', () => {
      const hotDay = SCORCHING_HEATWAVE.dataset.daily[0];
      render(<OOTDSection day={hotDay} ootd={hotDay.ootd} />);

      if (hotDay.ootd?.avoidList && hotDay.ootd.avoidList.length > 0) {
        expect(screen.getByText(/Avoid today:/i)).toBeInTheDocument();
        for (const avoidItem of hotDay.ootd.avoidList) {
          expect(screen.getByText(avoidItem)).toBeInTheDocument();
        }
      }
    });
  });

  // =========================================================================
  // 5. ActivitiesSection Component Tests
  // =========================================================================
  describe('ActivitiesSection Component', () => {
    it('renders 3 curated activities with tags and time-of-day prime hours', () => {
      render(<ActivitiesSection day={sampleDay} activities={sampleDay.activities} />);

      expect(screen.getByText(/Curated Activities/i)).toBeInTheDocument();
      expect(screen.getByText(sampleDay.activities!.primary)).toBeInTheDocument();
      expect(screen.getByText(sampleDay.activities!.secondary)).toBeInTheDocument();
      expect(screen.getByText(/Prime Hours:/i)).toBeInTheDocument();
    });

    it('indicates indoor preference when weather requires indoor sanctuary', () => {
      const rainyDay = {
        ...sampleDay,
        precipitationSum: 15,
        weatherCode: 65,
        activities: {
          ...sampleDay.activities!,
          isIndoorPreferred: true
        }
      };
      render(<ActivitiesSection day={rainyDay} activities={rainyDay.activities} />);

      expect(screen.getByText(/Indoor Haven Recommended/i)).toBeInTheDocument();
    });
  });

  // =========================================================================
  // 6. ForecastList Component Tests
  // =========================================================================
  describe('ForecastList Component', () => {
    it('renders all days in multi-day forecast sequence', () => {
      render(
        <ForecastList
          daily={AUTUMN_SWEATER_WEATHER.dataset.daily}
          selectedDayIdx={0}
          onSelectDay={vi.fn()}
          formatTemp={formatTempC}
        />
      );

      for (const day of AUTUMN_SWEATER_WEATHER.dataset.daily) {
        expect(screen.getAllByText(day.dayOfWeek).length).toBeGreaterThan(0);
      }
    });

    it('invokes onSelectDay when a future day card is clicked', () => {
      const selectDayMock = vi.fn();
      render(
        <ForecastList
          daily={AUTUMN_SWEATER_WEATHER.dataset.daily}
          selectedDayIdx={0}
          onSelectDay={selectDayMock}
          formatTemp={formatTempC}
        />
      );

      const dayCards = screen.getAllByRole('button');
      // Click day index 1 (second card)
      fireEvent.click(dayCards[1]);
      expect(selectDayMock).toHaveBeenCalledWith(1);
    });

    it('marks active day card with Active badge', () => {
      render(
        <ForecastList
          daily={AUTUMN_SWEATER_WEATHER.dataset.daily}
          selectedDayIdx={2}
          onSelectDay={vi.fn()}
          formatTemp={formatTempC}
        />
      );

      expect(screen.getByText('Active')).toBeInTheDocument();
    });
  });
});
