'use client'

import Container from "@/components/Container";
import ForecastWeatherDetails from "@/components/ForecastWeatherDetails";
import Navbar from "@/components/Navbar";
import WeatherDetails from "@/components/WeatherDetails";
import WeatherIcon from "@/components/WeatherIcon";
import { convertKtoC, convertKtoF } from "@/utils/convertKelvinToCelcius";
import { getDayOrNightIcon } from "@/utils/getDayOrNightIcon";
import { metersToKilometers } from "@/utils/metersToKilometers";
import { convertSpeed } from "@/utils/speedInMpsToKmph";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format, parseISO } from 'date-fns';
import { isCelsiusAtom, loadingCityAtom, placeAtom } from "./atom";
import { useAtom } from "jotai";
import { useEffect } from "react";
import React from 'react';
import Footer from "@/components/Footer";
import { safeFormat, safeFormatUnix } from "@/utils/safeFormat";

// https://api.openweathermap.org/data/2.5/forecast?q=pune&appid=7caaebc1b01f226342be04bbee229a65&cnt=2

export interface WeatherResponse {
  cod: string;
  message: number;
  cnt: number;
  list: WeatherEntry[];
  city: City;
}

export interface WeatherEntry {
  dt: number;
  main: MainWeather;
  weather: WeatherDescription[];
  clouds: Clouds;
  wind: Wind;
  visibility: number;
  pop: number;
  sys: Sys;
  dt_txt: string;
}

export interface MainWeather {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  sea_level: number;
  grnd_level: number;
  humidity: number;
  temp_kf: number;
}

export interface WeatherDescription {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface Clouds {
  all: number;
}

export interface Wind {
  speed: number;
  deg: number;
  gust: number;
}

export interface Sys {
  pod: string;
}

export interface City {
  id: number;
  name: string;
  coord: Coordinates;
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
}

export interface Coordinates {
  lat: number;
  lon: number;
}


export default function Home() {

  const [isCelsius] = useAtom(isCelsiusAtom);

  const [place] = useAtom(placeAtom);
  const [loadingCity] = useAtom(loadingCityAtom);

  const { isPending, error, data, refetch } = useQuery<WeatherResponse>({
    queryKey: ['repoData'],
    queryFn: async () => {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`
      )

      return data;
    }
  })

  useEffect(() => {
    refetch();
  }, [place, refetch])

  const firstdata = data?.list[0];



  const uniqueDates = [
    ...new Set(
      data?.list.map(
        (entry) => new Date(entry.dt * 1000).toISOString().split("T")[0]
      )
    )
  ];

  // Filtering data to get the first entry after 6 am for each unique date
  const firstDataForEachDate = uniqueDates.map((date) => {
    return data?.list.find((entry) => {
      const entryDate = new Date(entry.dt * 1000).toISOString().split("T")[0];
      const entryTime = new Date(entry.dt * 1000).getHours();
      return entryDate === date && entryTime >= 6;
    });
  });


  if (isPending) return (
    <div className="flex items-center min-h-screen justify-center">
      <p className="animate-bounce text-2xl text-gray-500">Loading...</p>
    </div>
  )

  if (error) return 'An error has occurred: ' + error.message

  return (
    <div className={`flex flex-col min-h-screen bg-gradient-to-br transition-all duration-500 ${firstdata?.weather[0].main === 'Clear' ? 'from-amber-300 via-orange-400 to-red-400' : firstdata?.weather[0].main === 'Clouds' ? 'from-amber-300 via-orange-400 to-red-400' : 'from-amber-300 via-orange-400 to-red-400'}`}>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>



      <Navbar location={data.city.name} data={firstdata} />

      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-6 w-full pb-10 pt-4">

        {loadingCity ? <WeatherSkeleton /> : (
          <>

            {/* today data*/}
            <section className="space-y-4">

              <div className="flex justify-center">
                <div className="flex flex-col">


                  {/* Main Weather Card */}
                  <div className="relative z-10 px-6 space-y-8 m-4">
                    <div className="text-center space-y-6 max-w-sm mx-auto pt-24 px-14">
                      <WeatherIcon
                        iconname={getDayOrNightIcon(
                          firstdata?.weather[0].icon ?? "",
                          firstdata?.dt_txt ?? ""
                        )}
                        className="w-24 h-24 absolute left-0 top-0"
                      />
                      <div className="space-y-2">
                        <div className="flex items-center justify-center space-x-2">
                          <span className="text-white text-8xl font-extralight tracking-tighter">
                            {isCelsius
                              ? convertKtoC(firstdata?.main.temp ?? 273.15)
                              : convertKtoF(firstdata?.main.temp ?? 273.15)}
                          </span>
                          <span className="text-white/70 text-3xl font-light mt-4">
                            °{isCelsius ? 'C' : 'F'}
                          </span>
                        </div>
                        <p className="text-white/80 text-xl font-light capitalize tracking-wide">
                          {firstdata?.weather[0].description}
                        </p>
                        <p className="text-white/60 text-sm font-light">
                          Feels like {isCelsius
                            ? convertKtoC(firstdata?.main.feels_like ?? 273.15)
                            : convertKtoF(firstdata?.main.feels_like ?? 273.15)}°
                          <br />
                          H: {isCelsius
                            ? convertKtoC(firstdata?.main.temp_max ?? 273.15)
                            : convertKtoF(firstdata?.main.temp_max ?? 273.15)}°
                          L: {isCelsius
                            ? convertKtoC(firstdata?.main.temp_min ?? 273.15)
                            : convertKtoF(firstdata?.main.temp_min ?? 273.15)}°
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pb-safe">

                {/* Weather Details Card */}

                <WeatherDetails
                  visibility={metersToKilometers(firstdata?.visibility ?? 1000)}
                  airPressure={`${firstdata?.main.pressure}`}
                  humidity={`${firstdata?.main.humidity}`}
                  windSpeed={convertSpeed(firstdata?.wind.speed ?? 0)}
                  sunrise={safeFormatUnix(data.city.sunrise, "h:mm a")}
                  sunset={safeFormatUnix(data.city.sunrise, "h:mm a")}
                />


              </div>


              {/* Hourly Forecast */}
              <Container className="p-6">
                <h3 className="text-white/90 font-light text-xl mb-4 tracking-wide">Hourly</h3>
                <div className="flex space-x-6 overflow-x-auto scrollbar-hide pb-2">
                  {data?.list.slice(0, 12).map((d, i) => (
                    <div
                      key={i}
                      className="flex-shrink-0 text-center space-y-3 min-w-[60px]"
                    >
                      <p className="text-white/60 text-sm font-light">
                        {format(parseISO(d.dt_txt), "h a")}
                      </p>
                      <div className="flex justify-center">
                        <WeatherIcon
                          iconname={getDayOrNightIcon(d.weather[0].icon, d.dt_txt)}
                          className="w-8 h-8"
                        />
                      </div>
                      <div className="flex items-center justify-center">
                        <p className="text-white text-xl font-medium">
                          {isCelsius
                            ? convertKtoC(d?.main.temp ?? 273.15)
                            : convertKtoF(d?.main.temp ?? 273.15)}
                        </p>
                        <span className="text-xs text-white/60">°{isCelsius ? "C" : "F"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Container>
            </section>

            {/* 7 day forecast */}
            <section className="flex w-full flex-col gap-4">
              <Container className='p-6'>
                <h2 className="text-white/90 font-light text-xl mb-4 tracking-wide">5-Day Forecast</h2>
                <div className="grid grid-cols-1 gap-6 p-2 pb-6">
                  {firstDataForEachDate.slice(1,6).map((d, i, ar) => (
                    <React.Fragment key={i}>
                      <ForecastWeatherDetails
                        description={d?.weather[0].description ?? ""}
                        weatherIcon={d?.weather[0].icon ?? "01d"}
                        date={safeFormat(d?.dt_txt , "dd MMM")}
                        day={safeFormat(d?.dt_txt , "EEEE")}
                        feels_like={d?.main.feels_like ?? 0}
                        temp={d?.main.temp ?? 0}
                        temp_min={d?.main.temp_min ?? 0}
                        temp_max={d?.main.temp_max ?? 0}
                        visibility={metersToKilometers(d?.visibility ?? 1000)}
                        airPressure={`${d?.main.pressure}`}
                        humidity={`${d?.main.humidity}`}
                        windSpeed={convertSpeed(d?.wind.speed ?? 0)}
                        sunrise={safeFormatUnix(data.city.sunrise, "h:mm a")}
                        sunset={safeFormatUnix(data.city.sunrise, "h:mm a")}
                        isCelsius={isCelsius}
                      />
                      {i < ar.length - 1 && <hr className="border-white/20" />}
                    </React.Fragment>

                  ))}
                </div>
              </Container>
            </section>
          </>
        )}

        {/* Bottom safe area */}
        <div className="h-8"></div>

        <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .pb-safe {
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>

      </main>

      <Footer />
    </div>
  );
}


function WeatherSkeleton() {
  return (
    <main className="px-3 max-w-7xl mx-auto flex flex-col gap-6 w-full pb-10 pt-4">
      {/* Today data skeleton */}
      <section className="space-y-4">

        {/* Main Weather Card Skeleton */}
        <div className="flex justify-center">
          <div className="flex flex-col">
            <div className="relative z-10 px-6 space-y-8 m-4">
              <div className="text-center space-y-6 max-w-sm mx-auto pt-24 px-14">
                {/* Weather Icon Skeleton */}
                <div className="w-24 h-24 absolute left-0 top-0 bg-white/20 rounded-full animate-pulse"></div>

                <div className="space-y-2">
                  {/* Temperature Skeleton */}
                  <div className="flex items-center justify-center space-x-2">
                    <div className="h-24 w-40 bg-white/20 rounded-2xl animate-pulse"></div>
                    <div className="h-8 w-8 bg-white/20 rounded animate-pulse mt-4"></div>
                  </div>

                  {/* Weather Description Skeleton */}
                  <div className="h-6 w-48 bg-white/20 rounded-xl animate-pulse mx-auto"></div>

                  {/* Feels Like + High/Low Skeleton */}
                  <div className="space-y-1">
                    <div className="h-4 w-32 bg-white/20 rounded animate-pulse mx-auto"></div>
                    <div className="h-4 w-24 bg-white/20 rounded animate-pulse mx-auto"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Weather Details Grid Skeleton */}
        <div className="grid grid-cols-2 gap-4 pb-safe">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-3xl shadow-2xl p-6 flex items-center space-x-4 animate-pulse">
              <div className="p-3 bg-white/20 rounded-full">
                <div className="w-5 h-5 bg-white/30 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3 w-16 bg-white/20 rounded"></div>
                <div className="h-5 w-12 bg-white/20 rounded"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Hourly Forecast Skeleton */}
        <div className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-3xl shadow-2xl p-6">
          <div className="h-6 w-16 bg-white/20 rounded animate-pulse mb-4"></div>
          <div className="flex space-x-6 overflow-x-auto scrollbar-hide pb-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 text-center space-y-3 min-w-[60px] animate-pulse">
                <div className="h-4 w-12 bg-white/20 rounded mx-auto"></div>
                <div className="w-8 h-8 bg-white/20 rounded-full mx-auto"></div>
                <div className="h-6 w-10 bg-white/20 rounded mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7-Day Forecast Skeleton */}
      <section className="flex w-full flex-col gap-4">
        <div className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-3xl shadow-2xl p-6">
          <div className="h-6 w-32 bg-white/20 rounded animate-pulse mb-4"></div>
          <div className="grid grid-cols-1 gap-6 p-2 pb-6">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i}>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-10 p-4 animate-pulse">
                  <div className="flex items-center gap-6 md:gap-10">
                    {/* Day and Date Skeleton */}
                    <div className="flex flex-col items-center space-y-1">
                      <div className="h-6 w-20 bg-white/20 rounded"></div>
                      <div className="h-4 w-16 bg-white/20 rounded"></div>
                    </div>

                    {/* Temperature Skeleton */}
                    <div className="flex items-center space-x-1">
                      <div className="h-8 w-12 bg-white/20 rounded"></div>
                      <div className="h-4 w-4 bg-white/20 rounded"></div>
                    </div>

                    {/* Weather Icon and Description Skeleton */}
                    <div className="text-center sm:text-left space-y-2">
                      <div className="w-12 h-12 bg-white/20 rounded-full mx-auto sm:mx-0"></div>
                      <div className="h-4 w-24 bg-white/20 rounded mx-auto sm:mx-0"></div>
                      <div className="h-3 w-20 bg-white/20 rounded mx-auto sm:mx-0"></div>
                    </div>
                  </div>

                  {/* Compact Weather Details Skeleton */}
                  <div className="flex justify-center lg:justify-end items-center gap-4 mt-2 lg:mt-0">
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                      {Array.from({ length: 4 }).map((_, j) => (
                        <div key={j} className="flex items-center gap-2">
                          <div className="p-3 border border-white/20 rounded-full">
                            <div className="w-5 h-5 bg-white/20 rounded"></div>
                          </div>
                          <div className="space-y-1">
                            <div className="h-3 w-12 bg-white/20 rounded"></div>
                            <div className="h-4 w-8 bg-white/20 rounded"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {i < 6 && <hr className="border-white/20" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom safe area */}
      <div className="h-8"></div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .pb-safe {
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
    </main>
  );
}