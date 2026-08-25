import { format, fromUnixTime, parseISO } from 'date-fns';
import type { Locale } from 'date-fns';

export function safeFormat(dateStr: string | undefined, formatStr: string, locale?: Locale) {
  try {
    return dateStr ? format(parseISO(dateStr), formatStr, { locale }) : 'N/A';
  } catch {
    return 'Invalid date';
  }
}

export function safeFormatUnix(
  unixTime: number | undefined,
  formatStr: string,
  locale?: Locale
): string {
  try {
    if (typeof unixTime !== 'number' || Number.isNaN(unixTime)) {
      return 'N/A';
    }
    return format(fromUnixTime(unixTime), formatStr, { locale });
  } catch {
    return 'Invalid date';
  }
}
