import { CROPS, lastPlantingDay } from './crops.js';
import { FESTIVALS, queenOfSauce } from './calendar.js';
import { VILLAGERS } from './villagers.js';
import type { FarmDate, FarmReminder, Season } from './types.js';

const seasons: Season[] = ['Spring', 'Summer', 'Fall', 'Winter'];
export type VisibilityOptions = { busUnlocked?: boolean };

export function farmDateIndex(date: FarmDate): number {
  return (date.year - 1) * 112 + seasons.indexOf(date.season) * 28 + (date.day - 1);
}

export function farmDateFromIndex(index: number): FarmDate {
  const safe = Math.max(0, index);
  const year = Math.floor(safe / 112) + 1;
  const within = safe % 112;
  return { year, season: seasons[Math.floor(within / 28)], day: within % 28 + 1 };
}

export function addFarmDays(date: FarmDate, days: number): FarmDate {
  return farmDateFromIndex(farmDateIndex(date) + days);
}

export function farmDaysBetween(from: FarmDate, to: FarmDate): number {
  return farmDateIndex(to) - farmDateIndex(from);
}

export function isTravelingCartDay(day: number): boolean {
  return day % 7 === 5 || day % 7 === 0;
}

function remindersForDate(date: FarmDate, timing: FarmReminder['timing'], revealLateGame: boolean, visibility: VisibilityOptions): FarmReminder[] {
  const out: FarmReminder[] = [];
  for (const event of FESTIVALS.filter(entry => entry.season === date.season && entry.day === date.day && (entry.year === undefined || entry.year === date.year))) {
    if (!revealLateGame && event.spoilerTier === 'late-game') continue;
    if (!revealLateGame && event.id.startsWith('desert-festival-') && !visibility.busUnlocked) continue;
    out.push({ id: `event:${event.id}:${timing}`, timing, category: 'festival', emoji: event.emoji, iconKey: 'calendar', entityId: event.id, title: event.name, detail: `${date.season} ${date.day}`, date, link: '/dashboard?tab=calendar' });
  }
  for (const villager of VILLAGERS.filter(entry => entry.birthday.season === date.season && entry.birthday.day === date.day)) {
    if (!revealLateGame && villager.spoilerTier === 'late-game') continue;
    if (villager.id === 'kent' && date.year < 2) continue;
    out.push({ id: `birthday:${villager.id}:${timing}`, timing, category: 'birthday', emoji: villager.emoji, iconKey: 'villager', entityId: villager.id, title: `${villager.name}'s birthday`, detail: 'Birthday reminder. Gift preferences are in Relationships.', date, link: '/dashboard?tab=villagers' });
  }
  const recipe = queenOfSauce(date.season, date.day, date.year);
  if (recipe && date.day % 7 === 0) out.push({ id: `qos:${recipe.id}`, timing, category: 'tv', iconKey: 'tv', emoji: 'ðŸ“º', title: 'Queen of Sauce', detail: `Today's recipe: ${recipe.name}. Watch TV before the day ends.`, date, link: '/dashboard?tab=calendar' });
  if (isTravelingCartDay(date.day)) out.push({ id: `cart:${farmDateIndex(date)}`, timing, category: 'cart', iconKey: 'cart', emoji: 'ðŸ›’', title: 'Traveling Cart', detail: 'The cart is visiting the forest today.', date });
  const deadline = CROPS.filter(crop => crop.seasons.includes(date.season) && crop.spoilerTier !== 'late-game' && lastPlantingDay(crop, date.season) === date.day);
for (const crop of deadline) out.push({ id: `crop:${crop.id}:${farmDateIndex(date)}`, timing, category: 'crop', iconKey: 'crops', entityId: crop.id, emoji: '', title: `Last day to plant ${crop.name}`, detail: `Without growth bonuses, plant by ${date.season} ${date.day} for at least one harvest.`, date, link: '/dashboard?tab=crops' });
  return out;
}

export function buildFarmBriefing(date: FarmDate, revealLateGame = false, visibility: VisibilityOptions = {}): FarmReminder[] {
  const tomorrow = addFarmDays(date, 1);
  const out = [...remindersForDate(date, 'today', revealLateGame, visibility), ...remindersForDate(tomorrow, 'tomorrow', revealLateGame, visibility)];
  if (tomorrow.season !== date.season) {
    out.push({ id: `season-end:${farmDateIndex(date)}`, timing: 'today', category: 'season', iconKey: 'clock', emoji: 'â³', title: `${date.season} ends tonight`, detail: 'Harvest seasonal crops and finish anything that cannot wait.', date });
    out.push({ id: `season-start:${farmDateIndex(tomorrow)}`, timing: 'tomorrow', category: 'season', iconKey: 'clock', emoji: 'ðŸŒ¤ï¸', title: `${tomorrow.season} begins`, detail: `Tomorrow is ${tomorrow.season} 1.`, date: tomorrow });
  }
  return out;
}

export function buildUpcomingReminders(date: FarmDate, days = 7, revealLateGame = false, visibility: VisibilityOptions = {}): FarmReminder[] {
  const out: FarmReminder[] = [];
  for (let offset = 2; offset <= days; offset++) out.push(...remindersForDate(addFarmDays(date, offset), 'upcoming', revealLateGame, visibility));
  return out;
}
