export const MAX_RECENT_SEARCHES = 5;
export const MAX_SAVED_PLACES = 10;

export function pushRecent(list: string[], city: string): string[] {
  return [city, ...list.filter((item) => item !== city)].slice(0, MAX_RECENT_SEARCHES);
}

export function removePlace(list: string[], city: string): string[] {
  return list.filter((item) => item !== city);
}
