import { atomWithStorage } from 'jotai/utils';

export const locales = ['en', 'ar'] as const;
export type Locale = (typeof locales)[number];

export const DEFAULT_LOCALE: Locale = 'en';

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  ar: 'العربية',
};

/** Short code shown on the language switcher button (displays the NEXT locale). */
export const LOCALE_SWITCH_LABELS: Record<Locale, string> = {
  en: 'EN',
  ar: 'ع',
};

export const localeAtom = atomWithStorage<Locale>('weather.locale', DEFAULT_LOCALE);

export function nextLocale(locale: Locale): Locale {
  return locale === 'en' ? 'ar' : 'en';
}
