'use client';

import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import Container from './Container';
import { convertKtoC, convertKtoF } from '@/utils/convertKelvinToCelsius';
import { safeFormat } from '@/utils/safeFormat';
import type { WeatherEntry } from '@/types/weather';

interface ForecastChartsProps {
  list?: WeatherEntry[];
  isCelsius: boolean;
}

export default function ForecastCharts({ list, isCelsius }: ForecastChartsProps) {
  const points = useMemo(
    () =>
      (list ?? []).map((entry) => ({
        time: safeFormat(entry.dt_txt, 'EEE h a'),
        temp: isCelsius ? convertKtoC(entry.main.temp) : convertKtoF(entry.main.temp),
        pop: Math.round((entry.pop ?? 0) * 100),
      })),
    [list, isCelsius]
  );

  if (points.length === 0) return null;

  const axisTick = { fill: 'rgba(255,255,255,0.55)', fontSize: 11 };
  const tooltipStyle = {
    background: 'rgba(15,23,42,0.9)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: 12,
    color: '#ffffff',
  };

  return (
    <Container className="p-6">
      <h3 className="text-white/90 font-light text-xl mb-4 tracking-wide">Trends</h3>

      <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={points} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.12)" vertical={false} />
            <XAxis
              dataKey="time"
              tick={axisTick}
              tickLine={false}
              axisLine={false}
              minTickGap={48}
            />
            <YAxis tick={axisTick} tickLine={false} axisLine={false} width={44} unit="°" />
            <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: 'rgba(255,255,255,0.7)' }} />
            <Line
              type="monotone"
              dataKey="temp"
              name={`Temperature °${isCelsius ? 'C' : 'F'}`}
              stroke="#ffffff"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="h-36 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={points} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.12)" vertical={false} />
            <XAxis
              dataKey="time"
              tick={axisTick}
              tickLine={false}
              axisLine={false}
              minTickGap={48}
            />
            <YAxis
              tick={axisTick}
              tickLine={false}
              axisLine={false}
              width={44}
              domain={[0, 100]}
              unit="%"
            />
            <Tooltip
              contentStyle={tooltipStyle}
              labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
              cursor={{ fill: 'rgba(255,255,255,0.08)' }}
            />
            <Bar
              dataKey="pop"
              name="Precipitation chance"
              fill="rgba(255,255,255,0.65)"
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Container>
  );
}
