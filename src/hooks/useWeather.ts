import { useQuery } from '@tanstack/react-query';
import { getForecastByCity } from '@/services/weatherApi';

export function useWeather(place: string) {
  return useQuery({
    queryKey: ['weather', 'forecast', place],
    queryFn: () => getForecastByCity(place),
    staleTime: 10 * 60 * 1000,
  });
}
