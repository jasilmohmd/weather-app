'use client';

import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { Star, X } from 'lucide-react';
import { placeAtom, recentSearchesAtom, savedPlacesAtom } from '@/app/atom';
import { removePlace } from '@/utils/recentSearches';
import { cn } from '@/utils/cn';
import { useI18n } from '@/hooks/useI18n';

export default function PlacesBar() {
  const [place, setPlace] = useAtom(placeAtom);
  const [savedPlaces, setSavedPlaces] = useAtom(savedPlacesAtom);
  const [recentSearches, setRecentSearches] = useAtom(recentSearchesAtom);

  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || (savedPlaces.length < 1 && recentSearches.length < 1)) {
    return null;
  }

  function renderChips(names: string[], isSaved: boolean) {
    return names.map((name) => (
      <div
        key={`${isSaved ? 'saved' : 'recent'}-${name}`}
        className={cn(
          'flex items-center rounded-full border overflow-hidden flex-shrink-0 transition-colors',
          name === place
            ? 'bg-white/30 border-white/40'
            : 'bg-white/10 border-white/20 hover:bg-white/20'
        )}
      >
        <button
          onClick={() => setPlace(name)}
          aria-label={t.places.switchTo(name)}
          aria-pressed={name === place}
          className="flex items-center gap-1.5 pl-3 pr-2 py-1.5 text-sm font-light text-white/90"
        >
          <Star
            className="w-3.5 h-3.5"
            fill={isSaved ? 'currentColor' : 'none'}
            aria-hidden="true"
          />
          <span className="max-w-[120px] truncate">{name}</span>
        </button>
        <button
          onClick={() =>
            isSaved
              ? setSavedPlaces(removePlace(savedPlaces, name))
              : setRecentSearches(removePlace(recentSearches, name))
          }
          aria-label={
            isSaved ? t.places.removeFromFavorites(name) : t.places.removeFromRecents(name)
          }
          className="p-1.5 pr-2.5 text-white/50 hover:text-white transition-colors"
        >
          <X className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>
    ));
  }

  return (
    <section className="max-w-7xl mx-auto px-3 w-full">
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
        {renderChips(savedPlaces, true)}
        {savedPlaces.length > 0 && recentSearches.length > 0 && (
          <span className="w-px h-4 bg-white/20 flex-shrink-0" aria-hidden="true" />
        )}
        {renderChips(
          recentSearches.filter((name) => !savedPlaces.includes(name)),
          false
        )}
      </div>
    </section>
  );
}
