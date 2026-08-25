import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Weather App',
    short_name: 'Weather',
    description: 'Real-time weather forecasts powered by OpenWeatherMap',
    start_url: '/',
    display: 'standalone',
    background_color: '#fbbf24',
    theme_color: '#fb923c',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
    ],
  };
}
