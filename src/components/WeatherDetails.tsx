import { cn } from '@/utils/cn';
import React from 'react'
import { FiDroplet } from 'react-icons/fi';
import { ImMeter } from 'react-icons/im';
import { ChevronDown, MapPin, RefreshCw, Eye, Droplets, Wind, Gauge, Sunrise, Sunset } from 'lucide-react';
import { MdAir } from 'react-icons/md';
import Container from './Container';

type Props = {}

export interface WeatherDetailProps {
  visibility: string;
  humidity: string;
  windSpeed: string;
  airPressure: string;
  sunrise: string;
  sunset: string;
  compact?: boolean;
}

export default function WeatherDetails(props: WeatherDetailProps) {
  
  const {
    visibility = '0km',
    humidity = '0%',
    windSpeed = "0 km/h",
    airPressure = "0 hPa",
    sunrise = "0:00",
    sunset = "0:00",
    compact
  } = props
  
  return (

    <>
      <SingleWeatherDetail
        icon={Eye}
        label='Visibility'
        value={props.visibility}
        unit='km'
      />

      <SingleWeatherDetail
        icon={Droplets}
        label='Humidity'
        value={props.humidity}
        unit='%'
      />

      <SingleWeatherDetail
        icon={Wind}
        label='WindSpeed'
        value={props.windSpeed}
        unit='km/h'
      />

      <SingleWeatherDetail
        icon={Gauge}
        label='Pressure'
        value={props.airPressure}
        unit='hPa'
      />

      <SingleWeatherDetail
        icon={Sunrise}
        label='Sunrise'
        value={props.sunrise}
      />

      <SingleWeatherDetail
        icon={Sunset}
        label='Sunset'
        value={props.sunset}
      />

    </>

  )
}

export interface SingleWeatherDetailProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  unit?: string;
}

function SingleWeatherDetail({ icon: Icon, label, value, unit }: SingleWeatherDetailProps) {
  return (
    <Container className="p-6 flex items-center space-x-4 hover:bg-white/15 transition-all duration-300">
      <div className="p-3 bg-white/20 rounded-full">
        <Icon className="w-5 h-5 text-white/90" />
      </div>
      <div>
        <p className="text-white/60 text-sm font-light tracking-wide">{label}</p>
        <p className="text-white font-medium text-lg">
          {value}<span className="text-white/70 text-sm ml-1">{unit}</span>
        </p>
      </div>
    </Container>
  );
}


function CompactSingleWeatherDetail({ icon: Icon, label, value, unit }: SingleWeatherDetailProps) {
  return (
    <div className='flex items-center gap-2'>
      <div className="p-3 border border-white/20 rounded-full">
        <Icon className="w-5 h-5 text-white/90" />
      </div>
      <div>
        <p className="text-white/60 text-sm font-light tracking-wide">{label}</p>
        <p className="text-white font-medium text-lg">
          {value}<span className="text-white/70 text-sm ml-0.5">{unit}</span>
        </p>
      </div>
    </div>
  );
}

export function CompactWeatherDetails(props: WeatherDetailProps) {
  const {
    visibility = '0km',
    humidity = '0%',
    windSpeed = "0 km/h",
    airPressure = "0 hPa",
  } = props;

  return (
    <div className="grid grid-cols-2  sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
      <CompactSingleWeatherDetail
        icon={Eye}
        label="Visibility"
        value={visibility}
        unit="km"
      />
      <CompactSingleWeatherDetail
        icon={Droplets}
        label="Humidity"
        value={humidity}
        unit="%"
      />
      <CompactSingleWeatherDetail
        icon={Wind}
        label="Wind Speed"
        value={windSpeed}
        unit="km/h"
      />
      <CompactSingleWeatherDetail
        icon={Gauge}
        label="Pressure"
        value={airPressure}
        unit="hPa"
      />
    </div>
  );
}
