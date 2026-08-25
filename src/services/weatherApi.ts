import axios from 'axios';
import type { AirPollutionResponse, City, WeatherResponse } from '@/types/weather';

/**
 * Browser-side service layer. All calls go through our own /api route
 * handlers, which talk to OpenWeatherMap server-side - the API key never
 * reaches the client bundle. Server counterparts live in owmServer.ts.
 *
 * Public function signatures are stable: hooks and components import these.
 */

const api = axios.create();

export async function getForecastByCity(city: string): Promise<WeatherResponse> {
  const { data } = await api.get<WeatherResponse>('/api/forecast', {
    params: { city },
  });
  return data;
}

export async function getForecastByCoords(lat: number, lon: number): Promise<WeatherResponse> {
  const { data } = await api.get<WeatherResponse>('/api/forecast', {
    params: { lat, lon },
  });
  return data;
}

export async function findCities(query: string): Promise<City[]> {
  const { data } = await api.get<{ list: City[] }>('/api/cities', {
    params: { q: query },
  });
  return data.list ?? [];
}

export async function getAirPollution(lat: number, lon: number): Promise<AirPollutionResponse> {
  const { data } = await api.get<AirPollutionResponse>('/api/aqi', {
    params: { lat, lon },
  });
  return data;
}
