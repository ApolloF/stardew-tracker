import { describe, expect, it } from 'vitest';
import { answerQuestion, deterministicPlan } from './ai.js';

const snapshot = { farm: { name: 'Farm', season: 'Spring' as const, year: 1, day: 7 }, progress: [], goals: [], revealLateGame: false };

describe('spoiler-conscious advice', () => {
  it('includes ordinary weekly reminders in deterministic advice', () => {
    expect(deterministicPlan(snapshot).cards.map(card => card.title)).toEqual(expect.arrayContaining(['Queen of Sauce', 'Traveling Cart']));
  });

  it('does not send a late-game catalog answer before confirmation', async () => {
    expect(await answerQuestion(snapshot, 'How do I grow pineapple?')).toMatchObject({ requiresSpoilerConfirmation: true, source: 'local' });
  });
});
