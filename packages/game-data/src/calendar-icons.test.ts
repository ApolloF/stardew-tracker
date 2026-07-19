import { describe, expect, it } from 'vitest';
import { FESTIVALS, QUEEN_OF_SAUCE } from './calendar.js';
import { UI_ICON_KEYS } from './icon-registry.js';
import { buildFarmBriefing } from './reminders.js';

describe('calendar icon coverage', () => {
  it('gives every festival a specific, valid icon key — never the generic calendar fallback', () => {
    for (const festival of FESTIVALS) {
      expect(UI_ICON_KEYS).toContain(festival.uiIcon);
      expect(festival.uiIcon).not.toBe('calendar');
    }
  });

  it('gives distinct festivals with different themes distinct icons', () => {
    const byId = Object.fromEntries(FESTIVALS.map(f => [f.id, f.uiIcon]));
    expect(byId['egg-festival']).toBe('egg');
    expect(byId['flower-dance']).toBe('flower');
    expect(byId['luau']).toBe('soup');
    expect(byId['moonlight-jellies']).toBe('moon');
    expect(byId['night-market-1']).toBe('nightMarket');
    expect(byId['squidfest-1']).toBe('squid');
    expect(byId['festival-ice']).toBe('ice');
    expect(byId['winter-star']).toBe('gift');
    expect(byId['spirits-eve']).toBe('pumpkin');
  });

  it('keeps every Queen of Sauce entry on the tv icon', () => {
    expect(QUEEN_OF_SAUCE.every(entry => entry.uiIcon === 'tv')).toBe(true);
  });

  it('routes the Today briefing through the same per-festival icon as the calendar data', () => {
    const egg = FESTIVALS.find(f => f.id === 'egg-festival')!;
    const items = buildFarmBriefing({ season: 'Spring', day: 13, year: 1 });
    const reminder = items.find(item => item.entityId === 'egg-festival');
    expect(reminder?.iconKey).toBe(egg.uiIcon);
  });
});
