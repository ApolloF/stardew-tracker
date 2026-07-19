import { describe, expect, it } from 'vitest';
import { COOKING_RECIPES, CRAFTING_RECIPES, ISLAND_UPGRADES, MONSTER_SLAYER_GOALS, MUSEUM_ITEMS, RACCOON_REQUESTS, REFERENCE_DATA, SHIPPING_ITEMS, WALNUT_SOURCES } from './index.js';

describe('ApolloF reference parity', () => {
  it('pins the reviewed upstream revision', () => expect(REFERENCE_DATA.commit).toBe('c916f707740ff7184634b321fb7ad386a6f915e5'));
  it('keeps complete tracker counts and unique IDs', () => {
    const expected = [[MUSEUM_ITEMS,95],[SHIPPING_ITEMS,155],[COOKING_RECIPES,81],[CRAFTING_RECIPES,149],[WALNUT_SOURCES,69],[ISLAND_UPGRADES,11],[MONSTER_SLAYER_GOALS,12],[RACCOON_REQUESTS,5]] as const;
    for (const [rows, count] of expected) { expect(rows).toHaveLength(count); expect(new Set(rows.map((row) => row.id)).size).toBe(count); }
    expect(MONSTER_SLAYER_GOALS.find((goal) => goal.id === 'cave-insects')?.count).toBe(80);
  });
});
