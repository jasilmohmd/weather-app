import { cn } from '@/utils/cn'
import Image from 'next/image'
import React from 'react'

type IconKey =
  | "01d" | "01n" | "02d" | "02n"
  | "03d" | "03n" | "04d" | "04n"
  | "09d" | "09n" | "10d" | "10n"
  | "11d" | "11n" | "13d" | "13n"
  | "50d" | "50n";

interface WeatherIconProps extends React.HTMLProps<HTMLDivElement> {
  iconname: IconKey | string; // string fallback for unknowns
}

export default function WeatherIcon({ iconname, className, ...rest }: WeatherIconProps) {
  const iconMap: Record<IconKey, string> = {
    "01d": "☀️", "01n": "🌙", "02d": "⛅", "02n": "☁️",
    "03d": "☁️", "03n": "☁️", "04d": "☁️", "04n": "☁️",
    "09d": "🌧️", "09n": "🌧️", "10d": "🌦️", "10n": "🌧️",
    "11d": "⛈️", "11n": "⛈️", "13d": "❄️", "13n": "❄️",
    "50d": "🌫️", "50n": "🌫️"
  };

  return (
    <div
      className={`flex items-center justify-center text-4xl filter drop-shadow-sm ${className || ''}`}
      {...rest}
    >
      {iconMap[iconname as IconKey] || "☀️"}
    </div>
  );
}
