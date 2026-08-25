import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import HourlyForecast from '@/components/HourlyForecast';
import type { WeatherEntry } from '@/types/weather';

afterEach(cleanup);

function makeEntries(count: number, startDay = 5): WeatherEntry[] {
  return Array.from({ length: count }, (_, i) => {
    const day = startDay + Math.floor((i * 3) / 24);
    const hour = (i * 3) % 24;
    const dd = String(day).padStart(2, '0');
    const hh = String(hour).padStart(2, '0');
    return {
      dt_txt: `2026-01-${dd}T${hh}:00:00`,
      main: { temp: 280 + i },
      weather: [{ icon: '01d' }],
    } as unknown as WeatherEntry;
  });
}

describe('HourlyForecast', () => {
  it('caps the strip at 24 slots even with more data', () => {
    const { container } = render(<HourlyForecast list={makeEntries(30)} isCelsius />);
    expect(container.querySelectorAll('.snap-start')).toHaveLength(24);
  });

  it('renders nothing without data', () => {
    const { container } = render(<HourlyForecast list={undefined} isCelsius />);
    expect(container.querySelectorAll('.snap-start')).toHaveLength(0);
  });

  it('shows a weekday marker when slots cross into a new day', () => {
    render(<HourlyForecast list={makeEntries(20)} isCelsius />);
    // entries start Jan 5 (Mon); slot index 8 = Jan 6 (Tue) at 00:00
    expect(screen.getByText('Tue')).toBeInTheDocument();
  });

  it('does not mark a day change on the first slot', () => {
    const { container } = render(<HourlyForecast list={makeEntries(8, 6)} isCelsius />);
    // 8 slots x 3h stays within one day - no weekday markers expected
    expect(container.textContent).not.toMatch(/Tue|Wed|Thu/);
  });

  it('respects the unit toggle', () => {
    render(<HourlyForecast list={makeEntries(1)} isCelsius={false} />);
    expect(screen.getByText('°F')).toBeInTheDocument();
  });
});
