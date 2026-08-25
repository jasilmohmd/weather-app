import { describe, expect, it } from 'vitest';
import {
  MAX_RECENT_SEARCHES,
  MAX_SAVED_PLACES,
  pushRecent,
  removePlace,
} from '@/utils/recentSearches';

describe('pushRecent', () => {
  it('adds a new city at the front', () => {
    expect(pushRecent([], 'London')).toEqual(['London']);
  });

  it('moves an existing city to the front without duplicating', () => {
    expect(pushRecent(['Tokyo', 'London'], 'London')).toEqual(['London', 'Tokyo']);
  });

  it('caps the list and drops the oldest', () => {
    let list: string[] = [];
    for (const city of ['A', 'B', 'C', 'D', 'E']) list = pushRecent(list, city);
    expect(list).toHaveLength(MAX_RECENT_SEARCHES);

    list = pushRecent(list, 'F');
    expect(list).toEqual(['F', 'E', 'D', 'C', 'B']);
    expect(list).not.toContain('A');
  });
});

describe('removePlace', () => {
  it('removes only the target city', () => {
    expect(removePlace(['A', 'B', 'C'], 'B')).toEqual(['A', 'C']);
  });

  it('leaves the list untouched when target is absent', () => {
    expect(removePlace(['A'], 'Z')).toEqual(['A']);
  });
});

describe('caps', () => {
  it('expose the documented limits', () => {
    expect(MAX_RECENT_SEARCHES).toBe(5);
    expect(MAX_SAVED_PLACES).toBe(10);
  });
});
