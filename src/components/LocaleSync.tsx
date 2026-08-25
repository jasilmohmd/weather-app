'use client';

import { useEffect } from 'react';
import { useI18n } from '@/hooks/useI18n';

export default function LocaleSync() {
  const { locale, dir } = useI18n();

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale, dir]);

  return null;
}
