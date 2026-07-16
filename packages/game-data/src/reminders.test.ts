import { describe, expect, it } from 'vitest';
import { addFarmDays, buildFarmBriefing, isTravelingCartDay } from './reminders.js';

describe('farm calendar briefing', () => {
  it('rolls across seasons and years', () => {
    expect(addFarmDays({ season: 'Spring', day: 28, year: 1 }, 1)).toEqual({ season: 'Summer', day: 1, year: 1 });
    expect(addFarmDays({ season: 'Winter', day: 28, year: 1 }, 1)).toEqual({ season: 'Spring', day: 1, year: 2 });
  });

  it('highlights Queen of Sauce and Traveling Cart on Sundays', () => {
    const items = buildFarmBriefing({ season: 'Spring', day: 7, year: 1 });
    expect(items).toEqual(expect.arrayContaining([
      expect.objectContaining({ category: 'tv', timing: 'today', detail: expect.stringContaining('Stir Fry') }),
      expect.objectContaining({ category: 'cart', timing: 'today' }),
    ]));
    expect(isTravelingCartDay(5)).toBe(true);
    expect(isTravelingCartDay(6)).toBe(false);
  });

  it('separates today and tomorrow and warns at season end', () => {
    const items = buildFarmBriefing({ season: 'Spring', day: 28, year: 1 });
    expect(items).toEqual(expect.arrayContaining([
      expect.objectContaining({ category: 'season', timing: 'today', title: 'Spring ends tonight' }),
      expect.objectContaining({ category: 'season', timing: 'tomorrow', title: 'Summer begins' }),
    ]));
  });
});
