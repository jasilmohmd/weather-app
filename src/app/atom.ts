import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const placeAtom = atom("Delhi");

export const isCelsiusAtom = atom(true);

export const savedPlacesAtom = atomWithStorage<string[]>("weather.savedPlaces", []);

export const recentSearchesAtom = atomWithStorage<string[]>("weather.recentSearches", []);
