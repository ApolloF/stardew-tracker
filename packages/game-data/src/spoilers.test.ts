import { describe, expect, it } from 'vitest';
import { searchCatalog } from './index.js';

describe('spoiler-safe catalog search', () => {
  it('hides late-game records by default and can reveal them explicitly', () => {
    expect(searchCatalog('pineapple')).toHaveLength(0);
    expect(searchCatalog('pineapple', undefined, true).map(item => item.id)).toContain('pineapple');
  });
});
