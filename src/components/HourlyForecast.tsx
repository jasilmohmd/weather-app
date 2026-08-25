import Container from './Container';
import { useI18n } from '@/hooks/useI18n';
import WeatherIcon from './WeatherIcon';
import { format, parseISO } from 'date-fns';
import { convertKtoC, convertKtoF } from '@/utils/convertKelvinToCelsius';
import { getDayOrNightIcon } from '@/utils/getDayOrNightIcon';
import type { WeatherEntry } from '@/types/weather';

const SLOT_COUNT = 24;

interface HourlyForecastProps {
  list?: WeatherEntry[];
  isCelsius: boolean;
}

export default function HourlyForecast({ list, isCelsius }: HourlyForecastProps) {
  const { t, dateLocale } = useI18n();
  const slots = list?.slice(0, SLOT_COUNT);
  const firstDay = slots?.[0] ? parseISO(slots[0].dt_txt).toDateString() : null;

  return (
    <Container className="p-6">
      <h3 className="text-white/90 font-light text-xl mb-4 tracking-wide">{t.hourly.heading}</h3>
      <div className="flex space-x-6 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory">
        {slots?.map((entry, i) => {
          const date = parseISO(entry.dt_txt);
          const isNewDay =
            firstDay !== null &&
            i > 0 &&
            slots[i - 1] !== undefined &&
            parseISO(slots[i - 1].dt_txt).toDateString() !== date.toDateString();

          return (
            <div key={i} className="flex-shrink-0 text-center space-y-3 min-w-[60px] snap-start">
              {isNewDay && (
                <p className="text-white/40 text-[10px] uppercase tracking-widest">
                  {format(date, 'EEE', { locale: dateLocale })}
                </p>
              )}
              <p className="text-white/60 text-sm font-light">
                {format(date, 'h a', { locale: dateLocale })}
              </p>
              <div className="flex justify-center">
                <WeatherIcon
                  iconname={getDayOrNightIcon(entry.weather[0].icon, entry.dt_txt)}
                  className="w-8 h-8"
                />
              </div>
              <div className="flex items-center justify-center">
                <p className="text-white text-xl font-medium">
                  {isCelsius ? convertKtoC(entry.main.temp) : convertKtoF(entry.main.temp)}
                </p>
                <span className="text-xs text-white/60">°{isCelsius ? 'C' : 'F'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </Container>
  );
}
