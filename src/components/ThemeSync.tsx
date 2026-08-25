'use client';

import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { themeAtom } from '@/app/atom';

function effectiveTheme(theme: 'light' | 'dark' | 'system'): 'light' | 'dark' {
  if (theme !== 'system') return theme;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function ThemeSync() {
  const [theme] = useAtom(themeAtom);

  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia('(prefers-color-scheme: dark)');

    const apply = () => {
      const resolved = effectiveTheme(theme);
      root.classList.toggle('dark', resolved === 'dark');
      root.style.colorScheme = resolved;
    };

    apply();
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, [theme]);

  return null;
}
