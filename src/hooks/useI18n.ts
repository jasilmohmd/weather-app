import { useAtom } from 'jotai';
import { useMemo } from 'react';
import type { Locale as DateFnsLocale } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { localeAtom, LOCALE_LABELS, nextLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';

const DATE_FNS_LOCALES: Record<Locale, DateFnsLocale> = {
  en: enUS,
  ar,
};

export function useI18n() {
  const [locale, setLocale] = useAtom(localeAtom);

  return useMemo(() => {
    const t = getDictionary(locale);
    const isRtl = locale === 'ar';
    return {
      locale,
      setLocale: (next: Locale) => setLocale(next),
      toggleLocale: () => setLocale(nextLocale(locale)),
      nextLocaleLabel: LOCALE_LABELS[nextLocale(locale)],
      t,
      dateLocale: DATE_FNS_LOCALES[locale],
      dir: (isRtl ? 'rtl' : 'ltr') as 'rtl' | 'ltr',
    };
  }, [locale, setLocale]);
}
