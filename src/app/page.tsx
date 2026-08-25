'use client'

import Container from "@/components/Container";
import CurrentWeatherHero from "@/components/CurrentWeatherHero";
import DailyForecast from "@/components/DailyForecast";
import Footer from "@/components/Footer";
import HourlyForecast from "@/components/HourlyForecast";
import Navbar from "@/components/Navbar";
import WeatherSkeleton from "@/components/WeatherSkeleton";
import { isCelsiusAtom, placeAtom } from "./atom";
import { useWeather } from "@/hooks/useWeather";
import { useAtom } from "jotai";

export default function Home() {
  const [isCelsius] = useAtom(isCelsiusAtom);
  const [place] = useAtom(placeAtom);

  const { isPending, error, data } = useWeather(place);

  if (isPending) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-300 via-orange-400 to-red-400">
        <WeatherSkeleton />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 bg-gradient-to-br from-amber-300 via-orange-400 to-red-400">
        <Container className="max-w-md p-8 text-center space-y-2">
          <p className="text-white text-lg font-light">Could not load the forecast</p>
          <p className="text-white/70 text-sm font-light break-words">
            {error ? error.message : "No data available."}
          </p>
          <p className="text-white/50 text-xs font-light">
            Check the city name or try again shortly.
          </p>
        </Container>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-amber-300 via-orange-400 to-red-400 transition-all duration-500">

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <Navbar location={data.city.name} data={data.list[0]} />

      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-6 w-full pb-10 pt-4">

        <CurrentWeatherHero data={data.list[0]} city={data.city} isCelsius={isCelsius} />

        <HourlyForecast list={data.list} isCelsius={isCelsius} />

        <DailyForecast list={data.list} city={data.city} isCelsius={isCelsius} />

        {/* Bottom safe area */}
        <div className="h-8"></div>

      </main>

      <Footer />
    </div>
  );
}
