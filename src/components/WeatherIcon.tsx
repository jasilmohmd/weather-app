
import React from 'react'

type IconKey =
  | "01d" | "01n" | "02d" | "02n"
  | "03d" | "03n" | "04d" | "04n"
  | "09d" | "09n" | "10d" | "10n"
  | "11d" | "11n" | "13d" | "13n"
  | "50d" | "50n";

const ICON_NAMES: Record<IconKey, string> = {
  "01d": "Sunny", "01n": "Clear night",
  "02d": "Partly cloudy", "02n": "Partly cloudy night",
  "03d": "Cloudy", "03n": "Cloudy",
  "04d": "Overcast", "04n": "Overcast",
  "09d": "Showers", "09n": "Showers",
  "10d": "Rain", "10n": "Rain",
  "11d": "Thunderstorm", "11n": "Thunderstorm",
  "13d": "Snow", "13n": "Snow",
  "50d": "Mist", "50n": "Mist",
};

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
      role="img"
      aria-label={ICON_NAMES[iconname as IconKey] || "Weather icon"}
      className={`flex items-center justify-center text-4xl filter drop-shadow-sm ${className || ''}`}
      {...rest}
    >
      {iconMap[iconname as IconKey] || "☀️"}
    </div>
  );
}
