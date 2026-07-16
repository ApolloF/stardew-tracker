import { describe, expect, it } from 'vitest';
import { findGoalProject, resolveGoalInput } from './goals.js';

describe('catalog-backed goals', () => {
  it('matches a natural Silo goal and resolves authoritative requirements', () => {
    expect(findGoalProject('Build a silo')?.id).toBe('silo');
    expect(resolveGoalInput({ itemId: 'silo' })).toMatchObject({
      itemId: 'silo',
      title: 'Build Silo',
      requirements: { Stone: 100, Clay: 10, 'Copper Bar': 5 },
      target: { cost: 100 },
    });
  });

  it('does not accept unknown catalog ids', () => {
    expect(() => resolveGoalInput({ itemId: 'made-up', title: 'Fake' })).toThrow('Unknown project');
  });

  it('keeps custom goals but gives them no fabricated requirements', () => {
    expect(resolveGoalInput({ title: 'Decorate the kitchen' })).toMatchObject({ itemId: null, requirements: {}, title: 'Decorate the kitchen' });
  });
});
