import React from 'react'
import WeatherIcon from './WeatherIcon'
import { CompactWeatherDetails, WeatherDetailProps } from './WeatherDetails';
import { convertKtoC, convertKtoF } from '@/utils/convertKelvinToCelcius';


export interface ForecastWeatherDetailsProps extends WeatherDetailProps {
  weatherIcon: string;
  date: string;
  day: string;
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  description: string;
  isCelsius: boolean;
}

export default function ForecastWeatherDetails(props: ForecastWeatherDetailsProps) {

  const {
    weatherIcon = "02d",
    date = "19.09",
    day = "Tuesday",
    temp,
    feels_like,
    temp_min,
    temp_max,
    description,
    isCelsius
  } = props

  return (

    <section className="flex flex-col sm:flex-row items-center justify-between gap-10 p-4">
      <div className="flex items-center gap-6 md:gap-10">
        <div className="flex flex-col items-center">
          <p className="text-white text-xl font-light min-w-[80px]">{day}</p>
          <p className="text-white/50 font-light min-w-[80px]">{date}</p>
        </div>

        <div className="flex items-center">
          <span className="text-3xl text-white font-light">
            {isCelsius ? convertKtoC(temp) : convertKtoF(temp)}
          </span>
          <span className="text-sm text-white/60">°{isCelsius ? "C" : "F"}</span>
        </div>

        <div className="text-center sm:text-left">
          <WeatherIcon iconname={weatherIcon} className="w-12 h-12 mx-auto sm:mx-0" />
          <p className="capitalize text-white/80 font-light min-w-[80px]">{description}</p>
          <p className='text-xs text-white/50'>Feels like {isCelsius
            ? convertKtoC(feels_like ?? 273.15)
            : convertKtoF(feels_like ?? 273.15)}°</p>
          <p className="flex gap-2 text-xs text-white/50 justify-center sm:justify-start">
            <span>
              H: {isCelsius ? convertKtoC(temp_max) : convertKtoF(temp_max)}°
            </span>
            <span>
              L: {isCelsius ? convertKtoC(temp_min) : convertKtoF(temp_min)}°
            </span>
          </p>
        </div>
      </div>

      <div className="flex justify-center lg:justify-end items-center gap-4 mt-2 lg:mt-0">
        <div className="">
          <CompactWeatherDetails {...props} />
        </div>
      </div>
    </section>

  )
}