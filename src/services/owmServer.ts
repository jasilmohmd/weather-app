import axios from 'axios';
import type { AirPollutionResponse, City, WeatherResponse } from '@/types/weather';

/**
 * SERVER-ONLY module - imported exclusively by /api route handlers.
 * Uses the private WEATHER_API_KEY env var; never imported from client code.
 */

function apiKey(): string {
  const key = process.env.WEATHER_API_KEY;
  if (!key) {
    throw new Error('Missing WEATHER_API_KEY environment variable (server-side)');
  }
  return key;
}

const owm = axios.create({ baseURL: 'https://api.openweathermap.org/data/2.5' });

export async function fetchForecastByCity(city: string): Promise<WeatherResponse> {
  const { data } = await owm.get<WeatherResponse>('/forecast', {
    params: { q: city, appid: apiKey(), cnt: 56 },
  });
  return data;
}

export async function fetchForecastByCoords(lat: number, lon: number): Promise<WeatherResponse> {
  const { data } = await owm.get<WeatherResponse>('/forecast', {
    params: { lat, lon, appid: apiKey() },
  });
  return data;
}

export async function fetchCities(query: string): Promise<City[]> {
  const { data } = await owm.get('/find', {
    params: { q: query, appid: apiKey() },
  });
  return (data?.list ?? []) as City[];
}

export async function fetchAirPollution(lat: number, lon: number): Promise<AirPollutionResponse> {
  const { data } = await owm.get<AirPollutionResponse>('/air_pollution', {
    params: { lat, lon, appid: apiKey() },
  });
  return data;
}
