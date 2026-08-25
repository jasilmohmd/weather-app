import React from 'react';
import Container from './Container';
import ForecastWeatherDetails from './ForecastWeatherDetails';
import { metersToKilometers } from '@/utils/metersToKilometers';
import { convertSpeed } from '@/utils/convertSpeed';
import { safeFormat, safeFormatUnix } from '@/utils/safeFormat';
import { useI18n } from '@/hooks/useI18n';
import type { City, WeatherEntry } from '@/types/weather';

interface DailyForecastProps {
  list?: WeatherEntry[];
  city?: City;
  isCelsius: boolean;
}

export default function DailyForecast({ list, city, isCelsius }: DailyForecastProps) {
  const { t, dateLocale } = useI18n();
  const uniqueDates = [
    ...new Set(list?.map((entry) => new Date(entry.dt * 1000).toISOString().split('T')[0])),
  ];

  // One representative entry per day: the first slot at/after 6 am
  const firstDataForEachDate = uniqueDates.map((date) => {
    return list?.find((entry) => {
      const entryDate = new Date(entry.dt * 1000).toISOString().split('T')[0];
      const entryTime = new Date(entry.dt * 1000).getHours();
      return entryDate === date && entryTime >= 6;
    });
  });

  return (
    <section className="flex w-full flex-col gap-4">
      <Container className="p-6">
        <h2 className="text-white/90 font-light text-xl mb-4 tracking-wide">{t.daily.heading}</h2>
        <div className="grid grid-cols-1 gap-6 p-2 pb-6">
          {/* slice skips today's partial data and shows the following five days */}
          {firstDataForEachDate.slice(1, 6).map((day, i, days) => (
            <React.Fragment key={i}>
              <ForecastWeatherDetails
                description={day?.weather[0].description ?? ''}
                weatherIcon={day?.weather[0].icon ?? '01d'}
                date={safeFormat(day?.dt_txt, 'dd MMM', dateLocale)}
                day={safeFormat(day?.dt_txt, 'EEEE', dateLocale)}
                feels_like={day?.main.feels_like ?? 0}
                temp={day?.main.temp ?? 0}
                temp_min={day?.main.temp_min ?? 0}
                temp_max={day?.main.temp_max ?? 0}
                visibility={metersToKilometers(day?.visibility ?? 1000)}
                airPressure={`${day?.main.pressure}`}
                humidity={`${day?.main.humidity}`}
                windSpeed={convertSpeed(day?.wind.speed ?? 0)}
                sunrise={safeFormatUnix(city?.sunrise, 'h:mm a', dateLocale)}
                sunset={safeFormatUnix(city?.sunset, 'h:mm a', dateLocale)}
                isCelsius={isCelsius}
              />
              {i < days.length - 1 && <hr className="border-white/20" />}
            </React.Fragment>
          ))}
        </div>
      </Container>
    </section>
  );
}
