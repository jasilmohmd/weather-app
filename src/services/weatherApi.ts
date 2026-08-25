import axios from "axios";
import type { AirPollutionResponse, City, WeatherResponse } from "@/types/weather";

const http = axios.create({
  baseURL: "https://api.openweathermap.org/data/2.5",
});

function apiKey(): string {
  const key = process.env.NEXT_PUBLIC_WEATHER_KEY;
  if (!key) {
    throw new Error("Missing NEXT_PUBLIC_WEATHER_KEY environment variable");
  }
  return key;
}

export async function getForecastByCity(city: string): Promise<WeatherResponse> {
  const { data } = await http.get<WeatherResponse>("/forecast", {
    params: { q: city, appid: apiKey(), cnt: 56 },
  });
  return data;
}

export async function getForecastByCoords(lat: number, lon: number): Promise<WeatherResponse> {
  const { data } = await http.get<WeatherResponse>("/forecast", {
    params: { lat, lon, appid: apiKey() },
  });
  return data;
}

export async function findCities(query: string): Promise<City[]> {
  const { data } = await http.get("/find", {
    params: { q: query, appid: apiKey() },
  });
  return (data?.list ?? []) as City[];
}

export async function getAirPollution(lat: number, lon: number): Promise<AirPollutionResponse> {
  const { data } = await http.get<AirPollutionResponse>("/air_pollution", {
    params: { lat, lon, appid: apiKey() },
  });
  return data;
}
