import { format, fromUnixTime, parseISO } from "date-fns";

export function safeFormat(dateStr: string | undefined, formatStr: string) {
  try {
    return dateStr ? format(parseISO(dateStr), formatStr) : "N/A";
  } catch {
    return "Invalid date";
  }
}

export function safeFormatUnix(unixTime: number | undefined, formatStr: string): string {
  try {
    if (typeof unixTime !== 'number' || Number.isNaN(unixTime)) {
      return 'N/A';
    }
    return format(fromUnixTime(unixTime), formatStr);
  } catch {
    return 'Invalid date';
  }
}