type GradientPair = {
  /** gradient stops for light mode */
  light: string;
  /** same stops with dark: variants — keep every class as a literal so Tailwind can see it */
  dark: string;
};

const gradients: Record<string, GradientPair> = {
  Clear: {
    light: "from-amber-300 via-orange-400 to-red-400",
    dark: "dark:from-blue-950 dark:via-indigo-950 dark:to-slate-900",
  },
  Clouds: {
    light: "from-slate-300 via-slate-400 to-slate-500",
    dark: "dark:from-slate-800 dark:via-gray-800 dark:to-gray-900",
  },
  Rain: {
    light: "from-sky-400 via-blue-500 to-indigo-600",
    dark: "dark:from-slate-800 dark:via-blue-950 dark:to-indigo-950",
  },
  Drizzle: {
    light: "from-sky-300 via-sky-400 to-blue-500",
    dark: "dark:from-slate-800 dark:via-sky-950 dark:to-blue-950",
  },
  Thunderstorm: {
    light: "from-slate-400 via-slate-500 to-gray-600",
    dark: "dark:from-gray-900 dark:via-slate-950 dark:to-black",
  },
  Snow: {
    light: "from-sky-200 via-sky-300 to-blue-400",
    dark: "dark:from-sky-950 dark:via-slate-800 dark:to-slate-900",
  },
  Atmosphere: {
    light: "from-zinc-300 via-zinc-400 to-zinc-500",
    dark: "dark:from-zinc-700 dark:via-zinc-800 dark:to-zinc-900",
  },
};

const ATMOSPHERE_CONDITIONS = [
  "Mist", "Smoke", "Haze", "Dust", "Fog", "Sand", "Ash", "Squall", "Tornado",
];

function resolve(main?: string): GradientPair {
  if (main && main in gradients) return gradients[main];
  if (main && ATMOSPHERE_CONDITIONS.includes(main)) return gradients.Atmosphere;
  return gradients.Clear;
}

/**
 * Returns Tailwind gradient stop classes (light + dark variants) for an OWM
 * weather[0].main value, e.g. "Clear" | "Rain" | undefined.
 */
export function getWeatherGradient(main?: string): string {
  const pair = resolve(main);
  return `${pair.light} ${pair.dark}`;
}
