import Container from './Container';
import WeatherIcon from './WeatherIcon';
import { format, parseISO } from 'date-fns';
import { convertKtoC, convertKtoF } from '@/utils/convertKelvinToCelsius';
import { getDayOrNightIcon } from '@/utils/getDayOrNightIcon';
import type { WeatherEntry } from '@/types/weather';

interface HourlyForecastProps {
  list?: WeatherEntry[];
  isCelsius: boolean;
}

export default function HourlyForecast({ list, isCelsius }: HourlyForecastProps) {
  return (
    <Container className="p-6">
      <h3 className="text-white/90 font-light text-xl mb-4 tracking-wide">Hourly</h3>
      <div className="flex space-x-6 overflow-x-auto scrollbar-hide pb-2">
        {list?.slice(0, 12).map((entry, i) => (
          <div
            key={i}
            className="flex-shrink-0 text-center space-y-3 min-w-[60px]"
          >
            <p className="text-white/60 text-sm font-light">
              {format(parseISO(entry.dt_txt), "h a")}
            </p>
            <div className="flex justify-center">
              <WeatherIcon
                iconname={getDayOrNightIcon(entry.weather[0].icon, entry.dt_txt)}
                className="w-8 h-8"
              />
            </div>
            <div className="flex items-center justify-center">
              <p className="text-white text-xl font-medium">
                {isCelsius
                  ? convertKtoC(entry.main.temp)
                  : convertKtoF(entry.main.temp)}
              </p>
              <span className="text-xs text-white/60">°{isCelsius ? "C" : "F"}</span>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
