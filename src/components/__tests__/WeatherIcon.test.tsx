import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import WeatherIcon from '@/components/WeatherIcon';

afterEach(cleanup);

describe('WeatherIcon', () => {
  it('renders the emoji and readable aria-label for a known day code', () => {
    render(<WeatherIcon iconname="01d" />);
    const icon = screen.getByRole('img');
    expect(icon).toHaveAttribute('aria-label', 'Sunny');
    expect(icon).toHaveTextContent('☀️');
  });

  it('labels night codes distinctly', () => {
    render(<WeatherIcon iconname="10n" data-testid="night" />);
    expect(screen.getByTestId('night')).toHaveAttribute('aria-label', 'Rain');
  });

  it('falls back to sun emoji with generic label for unknown codes', () => {
    render(<WeatherIcon iconname="99z" />);
    const icon = screen.getByRole('img');
    expect(icon).toHaveAttribute('aria-label', 'Weather icon');
    expect(icon).toHaveTextContent('☀️');
  });

  it('applies custom className', () => {
    render(<WeatherIcon iconname="01d" className="w-8 h-8" />);
    expect(screen.getByRole('img').className).toContain('w-8 h-8');
  });
});
