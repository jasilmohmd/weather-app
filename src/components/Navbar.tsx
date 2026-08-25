'use client';

import React, { useEffect, useRef, useState } from 'react';
import Searchbox from './Searchbox';
import axios from 'axios';
import { useAtom } from 'jotai';
import { isCelsiusAtom, placeAtom, recentSearchesAtom, savedPlacesAtom } from '@/app/atom';
import { MapPin, Star, Sun, Moon, Monitor } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { City, WeatherEntry } from '@/types/weather';
import { findCities, getForecastByCoords } from '@/services/weatherApi';
import { MAX_SAVED_PLACES, pushRecent, removePlace } from '@/utils/recentSearches';
import { Theme, themeAtom } from '@/app/atom';

type Props = { location?: string; data?: WeatherEntry };

export default function Navbar({ location, data }: Props) {
  const [city, setCity] = useState('');
  const [error, setError] = useState('');
  //
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestion] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  //
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestSeqRef = useRef(0);
  const [, setPlace] = useAtom(placeAtom);
  const [savedPlaces, setSavedPlaces] = useAtom(savedPlacesAtom);
  const [recentSearches, setRecentSearches] = useAtom(recentSearchesAtom);
  const [isCelsius, setIsCelsius] = useAtom(isCelsiusAtom);
  const [theme, setTheme] = useAtom(themeAtom);

  const nextTheme: Theme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';

  const isPinned = location ? savedPlaces.includes(location) : false;

  function selectPlace(name: string) {
    setPlace(name);
    setRecentSearches(pushRecent(recentSearches, name));
  }

  function togglePin() {
    if (!location) return;
    if (savedPlaces.includes(location)) {
      setSavedPlaces(removePlace(savedPlaces, location));
    } else {
      setSavedPlaces([location, ...savedPlaces].slice(0, MAX_SAVED_PLACES));
    }
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  async function fetchSuggestions(value: string) {
    const seq = ++requestSeqRef.current;
    try {
      const cities = await findCities(value);
      if (seq !== requestSeqRef.current) return;

      setSuggestions(cities.map((item: City) => item.name));
      setError('');
      setShowSuggestion(true);
      setActiveIndex(-1);
    } catch (error: unknown) {
      if (seq !== requestSeqRef.current) return;
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data?.message || 'Failed to fetch suggestions.');
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred.');
      }
      setSuggestions([]);
      setShowSuggestion(false);
    }
  }

  function handleInputChange(value: string) {
    setCity(value);
    setActiveIndex(-1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.length > 3) {
      debounceRef.current = setTimeout(() => {
        void fetchSuggestions(value);
      }, 300);
    } else {
      requestSeqRef.current++;
      setSuggestions([]);
      setShowSuggestion(false);
      setError('');
    }
  }

  function handleSuggestionClick(value: string) {
    setCity(value);
    setShowSuggestion(false);
    setActiveIndex(-1);
  }

  function handleCurrentLocation() {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await getForecastByCoords(latitude, longitude);
          selectPlace(response.city.name);
        } catch (error: unknown) {
          if (axios.isAxiosError(error) && error.response) {
            setError(error.response.data?.message || 'Failed to load your location weather.');
          } else if (error instanceof Error) {
            setError(error.message);
          } else {
            setError('An unexpected error occurred.');
          }
        }
      },
      () => {
        setError('Unable to retrieve your location. Check location permissions.');
      }
    );
  }

  function handleSubmitSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (suggestions.length < 1) {
      setError('Location not found');
    } else {
      setError('');
      selectPlace(city);
      setShowSuggestion(false);
    }
  }

  function handleSearchKeyDown(e: React.KeyboardEvent) {
    if (!showSuggestions || suggestions.length < 1) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      const item = suggestions[activeIndex];
      if (item) {
        setCity(item);
        selectPlace(item);
        setShowSuggestion(false);
        setActiveIndex(-1);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestion(false);
      setActiveIndex(-1);
    }
  }

  return (
    <>
      <nav className="bg-transparent backdrop-blur-sm my-4">
        <div className="h-[70px] w-full flex justify-between items-center max-w-7xl px-3 mx-auto">
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-between gap-16">
            <button
              className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200"
              onClick={handleCurrentLocation}
              aria-label="Use my current location"
              title="Your Current Location"
            >
              <MapPin className="w-6 h-6 text-white/80" />
            </button>

            <div className="text-center">
              <h1 className="text-white font-light text-lg tracking-wide">{location}</h1>
              <p className="text-white/60 text-sm font-light">
                {format(parseISO(data?.dt_txt ?? ''), 'EEEE')},{' '}
                {format(parseISO(data?.dt_txt ?? ''), 'MMMM dd')}
              </p>
            </div>
            <button
              onClick={() => setIsCelsius(!isCelsius)}
              aria-label={`Switch to degrees ${isCelsius ? 'Fahrenheit' : 'Celsius'}`}
              title={`Switch to °${isCelsius ? 'F' : 'C'}`}
              className="text-white/80 font-light text-sm px-2 py-1 hover:bg-white/10 rounded-full transition-colors duration-200"
            >
              °{isCelsius ? 'C' : 'F'}
            </button>

            <button
              onClick={togglePin}
              disabled={!location}
              aria-label={isPinned ? 'Unpin current city' : 'Pin current city'}
              title={isPinned ? 'Unpin current city' : 'Pin current city'}
              className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200 disabled:opacity-40"
            >
              <Star className="w-5 h-5 text-white/80" fill={isPinned ? 'currentColor' : 'none'} />
            </button>

            <button
              onClick={() => setTheme(nextTheme)}
              aria-label={`Theme: ${theme}. Switch to ${nextTheme}`}
              title={`Theme: ${theme}`}
              className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200"
            >
              {theme === 'light' ? (
                <Sun className="w-5 h-5 text-white/80" />
              ) : theme === 'dark' ? (
                <Moon className="w-5 h-5 text-white/80" />
              ) : (
                <Monitor className="w-5 h-5 text-white/80" />
              )}
            </button>
          </div>

          {/*  */}
          <section className="ml-auto flex gap-2 items-center">
            <div className="relative hidden md:flex" onKeyDown={handleSearchKeyDown}>
              {/* Search box */}
              <Searchbox
                value={city}
                onSubmit={handleSubmitSearch}
                onChange={(e) => handleInputChange(e.target.value)}
              />
              <SuggestionBox
                {...{
                  showSuggestions,
                  suggestions,
                  handleSuggestionClick,
                  error,
                  activeIndex,
                }}
              />
            </div>
          </section>
        </div>
      </nav>

      <section className="flex max-w-7xl px-3 md:hidden justify-center">
        <div className="relative" onKeyDown={handleSearchKeyDown}>
          {/* Search box */}
          <Searchbox
            value={city}
            onSubmit={handleSubmitSearch}
            onChange={(e) => handleInputChange(e.target.value)}
          />
          <SuggestionBox
            {...{
              showSuggestions,
              suggestions,
              handleSuggestionClick,
              error,
              activeIndex,
            }}
          />
        </div>
      </section>
    </>
  );
}

function SuggestionBox({
  showSuggestions,
  suggestions,
  handleSuggestionClick,
  error,
  activeIndex,
}: {
  showSuggestions: boolean;
  suggestions: string[];
  handleSuggestionClick: (item: string) => void;
  error: string;
  activeIndex: number;
}) {
  return (
    <>
      {((showSuggestions && suggestions.length >= 1) || error) && (
        <ul
          role="listbox"
          aria-label="City suggestions"
          className="mb-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white absolute top-[50px] left-0 min-w-[200px] flex flex-col gap-1 p-1 z-50"
        >
          {error && suggestions.length < 1 && (
            <li role="alert" className="text-red-500 p-1">
              {error}
            </li>
          )}
          {suggestions.map((item, i) => (
            <li key={`${item}-${i}`} role="option" aria-selected={i === activeIndex}>
              <button
                type="button"
                onClick={() => handleSuggestionClick(item)}
                className={`w-full text-left cursor-pointer p-2 rounded-xl transition-colors ${
                  i === activeIndex ? 'bg-gray-200/20' : 'hover:bg-gray-200/20'
                }`}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
