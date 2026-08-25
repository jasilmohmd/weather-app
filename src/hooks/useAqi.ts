import { useQuery } from '@tanstack/react-query';
import { getAirPollution } from '@/services/weatherApi';

export function useAqi(lat?: number, lon?: number) {
  return useQuery({
    queryKey: ['weather', 'aqi', lat, lon],
    queryFn: () => getAirPollution(lat as number, lon as number),
    enabled: typeof lat === 'number' && typeof lon === 'number',
    staleTime: 10 * 60 * 1000,
  });
}
