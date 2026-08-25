'use client'

import React, { useState } from 'react'
import Searchbox from './Searchbox';
import axios from 'axios';
import { useAtom } from 'jotai';
import { isCelsiusAtom, placeAtom } from '@/app/atom';
import { MapPin } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { City, WeatherEntry } from '@/types/weather';
import { findCities, getForecastByCoords } from '@/services/weatherApi';

type Props = { location?: string, data?: WeatherEntry }

export default function Navbar({ location, data }: Props) {

  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  //
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestion] = useState(false);
  //
  const [, setPlace] = useAtom(placeAtom);
  const [isCelsius, setIsCelsius] = useAtom(isCelsiusAtom);


  async function handleInputChange(value: string) {
    setCity(value);
    if (value.length > 3) {
      try {
        const cities = await findCities(value);

        setSuggestions(cities.map((item: City) => item.name));
        setError("");
        setShowSuggestion(true);

      } catch (error:unknown) {
        if (axios.isAxiosError(error) && error.response) {
          setError(error.response.data?.message || "Failed to fetch suggestions.");
        } else if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unexpected error occurred.");
        }
        setSuggestions([]);
        setShowSuggestion(false);
      }
    }
    else {
      setSuggestions([]);
      setShowSuggestion(false);
    }
  }

  function handleSuggestionClick(value: string) {
    setCity(value);
    setShowSuggestion(false);
  }

  function handleCurrentLocation() {

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await getForecastByCoords(latitude, longitude);
          setPlace(response.city.name);
        } catch (error: unknown) {
          if (axios.isAxiosError(error) && error.response) {
            setError(error.response.data?.message || "Failed to load your location weather.");
          } else if (error instanceof Error) {
            setError(error.message);
          } else {
            setError("An unexpected error occurred.");
          }
        }
      },
      () => {
        setError("Unable to retrieve your location. Check location permissions.");
      }
    );

  }

  function handleSubmitSearch(e: React.FormEvent<HTMLFormElement>) {

    e.preventDefault();

    if (suggestions.length < 1) {
      setError("Location not found");
    }
    else {
      setError("");
      setPlace(city);
      setShowSuggestion(false);
    }

  }

  return (

    <>
      <nav className="bg-transparent backdrop-blur-sm my-4">
        <div className='h-[70px] w-full flex justify-between items-center max-w-7xl px-3 mx-auto'>

          <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-between gap-16">

            <button className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200" onClick={handleCurrentLocation} title='Your Current Location'>
              <MapPin className="w-6 h-6 text-white/80" />
            </button>

            <div className="text-center">
              <h1 className="text-white font-light text-lg tracking-wide">{location}</h1>
              <p className="text-white/60 text-sm font-light">
                {format(parseISO(data?.dt_txt ?? ""), "EEEE")}, {format(parseISO(data?.dt_txt ?? ""), "MMMM dd")}
              </p>
            </div>
            <button
              onClick={() => setIsCelsius(!isCelsius)}
              className="text-white/80 font-light text-sm px-2 py-1 hover:bg-white/10 rounded-full transition-colors duration-200"
            >
              °{isCelsius ? 'C' : 'F'}
            </button>
          </div>

          {/*  */}
          <section className="ml-auto flex gap-2 items-center">

            <div className='relative hidden md:flex'>
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
                  error
                }}
              />
            </div>

          </section>

        </div>
      </nav>

      <section className='flex max-w-7xl px-3 md:hidden justify-center'>
        <div className='relative'>
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
              error
            }}
          />
        </div>
      </section>

    </>

  )
}


function SuggestionBox({
  showSuggestions,
  suggestions,
  handleSuggestionClick,
  error
}: {
  showSuggestions: boolean;
  suggestions: string[];
  handleSuggestionClick: (item: string) => void;
  error: string;
}) {
  return (
    <>
      {((showSuggestions && suggestions.length >= 1) || error) && (
        <ul className='mb-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white absolute top-[50px] left-0 min-w-[200px] flex flex-col gap-1 p-1 z-50'>
          {error && suggestions.length < 1 && (
            <li className='text-red-500 p-1'>{error}</li>
          )}
          {suggestions.map((item, i) => (
            <li
              key={i}
              onClick={() => handleSuggestionClick(item)}
              className='cursor-pointer p-2 hover:bg-gray-200/20 rounded-xl'
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </>
  )
}