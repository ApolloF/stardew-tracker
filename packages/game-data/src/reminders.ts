import { CROPS, lastPlantingDay } from './crops.js';
import { FESTIVALS, queenOfSauce } from './calendar.js';
import { VILLAGERS } from './villagers.js';
import type { FarmDate, FarmReminder, Season } from './types.js';

const seasons: Season[] = ['Spring', 'Summer', 'Fall', 'Winter'];

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

function remindersForDate(date: FarmDate, timing: FarmReminder['timing'], revealLateGame: boolean): FarmReminder[] {
  const out: FarmReminder[] = [];
  for (const event of FESTIVALS.filter(entry => entry.season === date.season && entry.day === date.day && (entry.year === undefined || entry.year === date.year))) {
    if (!revealLateGame && event.spoilerTier === 'late-game') continue;
    out.push({ id: `event:${event.id}:${timing}`, timing, category: 'festival', emoji: event.emoji, title: event.name, detail: `${date.season} ${date.day}`, date, link: '/dashboard?tab=calendar' });
  }
  for (const villager of VILLAGERS.filter(entry => entry.birthday.season === date.season && entry.birthday.day === date.day)) {
    if (!revealLateGame && villager.spoilerTier === 'late-game') continue;
    out.push({ id: `birthday:${villager.id}:${timing}`, timing, category: 'birthday', emoji: villager.emoji, title: `${villager.name}'s birthday`, detail: `Loved gifts: ${villager.lovedGifts.slice(0, 3).join(', ')}`, date, link: '/dashboard?tab=villagers' });
  }
  const recipe = queenOfSauce(date.season, date.day, date.year);
  if (recipe && date.day % 7 === 0) out.push({ id: `qos:${recipe.id}`, timing, category: 'tv', emoji: '📺', title: 'Queen of Sauce', detail: `Today's recipe: ${recipe.name}. Watch TV before the day ends.`, date, link: '/dashboard?tab=calendar' });
  if (isTravelingCartDay(date.day)) out.push({ id: `cart:${farmDateIndex(date)}`, timing, category: 'cart', emoji: '🛒', title: 'Traveling Cart', detail: 'The cart is visiting the forest today.', date });
  const deadline = CROPS.filter(crop => crop.seasons.includes(date.season) && crop.spoilerTier !== 'late-game' && lastPlantingDay(crop, date.season) === date.day);
  if (deadline.length) out.push({ id: `crops:${farmDateIndex(date)}`, timing, category: 'crop', emoji: '🌱', title: 'Last planting day', detail: `Without growth bonuses: ${deadline.map(crop => crop.name).join(', ')}.`, date, link: '/dashboard?tab=crops' });
  return out;
}

export function buildFarmBriefing(date: FarmDate, revealLateGame = false): FarmReminder[] {
  const tomorrow = addFarmDays(date, 1);
  const out = [...remindersForDate(date, 'today', revealLateGame), ...remindersForDate(tomorrow, 'tomorrow', revealLateGame)];
  if (tomorrow.season !== date.season) {
    out.push({ id: `season-end:${farmDateIndex(date)}`, timing: 'today', category: 'season', emoji: '⏳', title: `${date.season} ends tonight`, detail: 'Harvest seasonal crops and finish anything that cannot wait.', date });
    out.push({ id: `season-start:${farmDateIndex(tomorrow)}`, timing: 'tomorrow', category: 'season', emoji: '🌤️', title: `${tomorrow.season} begins`, detail: `Tomorrow is ${tomorrow.season} 1.`, date: tomorrow });
  }
  return out;
}

export function buildUpcomingReminders(date: FarmDate, days = 7, revealLateGame = false): FarmReminder[] {
  const out: FarmReminder[] = [];
  for (let offset = 2; offset <= days; offset++) out.push(...remindersForDate(addFarmDays(date, offset), 'upcoming', revealLateGame));
  return out;
}
