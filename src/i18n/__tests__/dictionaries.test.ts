import { describe, expect, it } from 'vitest';
import { getDictionary, englishDictionary } from '@/i18n/dictionaries';
import { locales, nextLocale, DEFAULT_LOCALE } from '@/i18n/config';

type Plain = Record<string, unknown>;

function keyPaths(obj: Plain, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object') return keyPaths(value as Plain, path);
    return [path];
  });
}

describe('dictionaries', () => {
  it('every locale exposes exactly the same key structure as English', () => {
    const enKeys = keyPaths(englishDictionary).sort();
    for (const locale of locales) {
      if (locale === DEFAULT_LOCALE) continue;
      expect(keyPaths(getDictionary(locale) as Plain).sort()).toEqual(enKeys);
    }
  });

  it('all leaves are non-empty strings or functions returning strings', () => {
    for (const locale of locales) {
      const dict = getDictionary(locale) as Plain;
      for (const path of keyPaths(dict)) {
        const value = path.split('.').reduce<unknown>((acc, k) => (acc as Plain)[k], dict);
        if (typeof value === 'function') continue; // parameterised string builders
        expect(value, `${locale}:${path}`).toBeTypeOf('string');
        expect(value as string, `${locale}:${path}`).not.toBe('');
      }
    }
  });

  it('parameterised entries are functions', () => {
    const ar = getDictionary('ar');
    expect(typeof ar.nav.languageAria('العربية')).toBe('string');
    expect(ar.places.switchTo('دبي')).toContain('دبي');
    expect(ar.radar.title('25.20, 55.27')).toContain('25.20, 55.27');
  });

  it('cycles between locales', () => {
    expect(nextLocale('en')).toBe('ar');
    expect(nextLocale('ar')).toBe('en');
  });
});
