'use client';

import { useAqi } from '@/hooks/useAqi';
import { useI18n } from '@/hooks/useI18n';
import Container from './Container';
import type { AirPollutionEntry } from '@/types/weather';

const AQI_LEVEL_KEYS = ['good', 'fair', 'moderate', 'poor', 'veryPoor'] as const;

const AQI_DOTS: Record<number, string> = {
  1: 'bg-green-400',
  2: 'bg-yellow-300',
  3: 'bg-orange-400',
  4: 'bg-red-500',
  5: 'bg-purple-500',
};

const POLLUTANT_LABELS: Record<string, string> = {
  pm2_5: 'PM2.5',
  pm10: 'PM10',
  o3: 'O3',
  no2: 'NO2',
  so2: 'SO2',
};

function dominantPollutant(components: AirPollutionEntry['components']): string | null {
  let best: string | null = null;
  let max = -1;
  for (const key of Object.keys(POLLUTANT_LABELS)) {
    const value = components[key as keyof AirPollutionEntry['components']] ?? 0;
    if (value > max) {
      max = value;
      best = key;
    }
  }
  return best ? POLLUTANT_LABELS[best] : null;
}

interface AqiTileProps {
  lat?: number;
  lon?: number;
}

export default function AqiTile({ lat, lon }: AqiTileProps) {
  const { data, isPending } = useAqi(lat, lon);
  const { t } = useI18n();

  if (typeof lat !== 'number' || typeof lon !== 'number') return null;

  if (isPending) {
    return (
      <Container className="p-4 flex items-center gap-3 animate-pulse" aria-hidden="true">
        <div className="w-3 h-3 rounded-full bg-white/30" />
        <div className="space-y-1.5">
          <div className="h-3 w-20 bg-white/20 rounded" />
          <div className="h-4 w-24 bg-white/20 rounded" />
        </div>
      </Container>
    );
  }

  // Non-critical data: hide the tile entirely on failure or empty response
  const entry = data?.list[0];
  if (!entry) return null;

  const levelKey = t.aqiLevels[AQI_LEVEL_KEYS[entry.main.aqi - 1] ?? 'good'];
  const dot = AQI_DOTS[entry.main.aqi] ?? AQI_DOTS[1];
  const dominant = dominantPollutant(entry.components);

  return (
    <Container className="p-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <span className={`w-3 h-3 rounded-full flex-shrink-0 ${dot}`} aria-hidden="true" />
        <div>
          <p className="text-white/60 text-sm font-light tracking-wide">{t.details.airQuality}</p>
          <p className="text-white font-medium">
            {levelKey}
            <span className="text-white/50 text-xs ms-1.5">
              {t.details.aqiOutOf} {entry.main.aqi}/5
            </span>
          </p>
        </div>
      </div>
      {dominant && (
        <p className="text-white/60 text-xs font-light text-right">
          {t.details.dominant}
          <br />
          <span className="text-white/80">{dominant}</span>
        </p>
      )}
    </Container>
  );
}
