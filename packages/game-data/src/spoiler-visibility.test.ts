import { describe, expect, it } from 'vitest';
import { buildFarmBriefing, buildUpcomingReminders } from './reminders.js';

describe('availability-aware reminders',()=>{
  it('does not reveal Kent during Year 1',()=>{const rows=buildUpcomingReminders({season:'Spring',day:1,year:1},5,false);expect(rows.some((row)=>/Kent/.test(row.title))).toBe(false)});
  it('shows Kent after he is available',()=>{const rows=buildUpcomingReminders({season:'Spring',day:1,year:2},5,false);expect(rows.some((row)=>/Kent/.test(row.title))).toBe(true)});
  it('hides the Desert Festival until the bus is unlocked or details are revealed',()=>{const date={season:'Spring' as const,day:14,year:1};expect(buildFarmBriefing(date,false).some((row)=>/Desert Festival/.test(row.title))).toBe(false);expect(buildFarmBriefing(date,false,{busUnlocked:true}).some((row)=>/Desert Festival/.test(row.title))).toBe(true);expect(buildFarmBriefing(date,true).some((row)=>/Desert Festival/.test(row.title))).toBe(true)});
  it('keeps loved gifts out of birthday reminders',()=>{const rows=buildFarmBriefing({season:'Spring',day:6,year:1});const birthday=rows.find((row)=>row.category==='birthday');expect(birthday?.detail).toBe('Birthday reminder. Gift preferences are in Relationships.');expect(rows.some((row)=>/Loved gifts/i.test(row.detail))).toBe(false)});
});
