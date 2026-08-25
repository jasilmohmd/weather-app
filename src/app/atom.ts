import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const placeAtom = atom('Delhi');

export const isCelsiusAtom = atomWithStorage<boolean>('weather.isCelsius', true);

export const savedPlacesAtom = atomWithStorage<string[]>('weather.savedPlaces', []);

export const recentSearchesAtom = atomWithStorage<string[]>('weather.recentSearches', []);

export type Theme = 'light' | 'dark' | 'system';

export const themeAtom = atomWithStorage<Theme>('weather.theme', 'system');
