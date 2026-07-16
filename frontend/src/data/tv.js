// Queen of Sauce airs every Sunday (days 7,14,21,28).
// Full 2-year rotation — after that it repeats with reruns filling gaps.

const QOS_SCHEDULE = {
  1: { // Year 1
    Spring: ['Tortilla', 'Roots Platter', 'Fried Egg', 'Hashbrowns'],
    Summer: ['Red Plate', 'Omelet', 'Glazed Yams', 'Fish Stew'],
    Fall:   ['Chowder', 'Eggplant Parmesan', 'Pancakes', 'Radish Salad'],
    Winter: ['Fried Mushroom', 'Crispy Bass', 'Pepper Poppers', 'Bread'],
  },
  2: { // Year 2
    Spring: ['Tom Kha Soup', 'Salmon Dinner', 'Cheese Cauliflower', 'Parsnip Soup'],
    Summer: ['Stir Fry', 'Blueberry Tart', 'Algae Soup', 'Pale Broth'],
    Fall:   ["Miner's Treat", 'Pumpkin Soup', 'Spaghetti', 'Cranberry Sauce'],
    Winter: ['Stuffing', 'Artichoke Dip', 'Escargot', 'Lobster Bisque'],
  },
};

/**
 * Get this Sunday's recipe (based on current season, day, year).
 * Returns null if we're past week 4 (shouldn't happen in 28-day season).
 */
export function getThisSundayRecipe(season, day, year) {
  const week = Math.ceil(day / 7); // 1–4
  const effectiveYear = year > 2 ? ((year - 1) % 2) + 1 : year;
  return QOS_SCHEDULE[effectiveYear]?.[season]?.[week - 1] ?? 'Rerun (check TV!)';
}

/**
 * Next Sunday day number from current day. Returns null if past day 28.
 */
export function nextSunday(day) {
  const next = Math.ceil(day / 7) * 7;
  return next <= 28 ? next : null;
}

/**
 * Days until next Sunday.
 */
export function daysUntilSunday(day) {
  const ns = nextSunday(day);
  if (ns === null) return null;
  return ns - day;
}

/**
 * Is today a Sunday (QoS day)?
 */
export function isSunday(day) { return day % 7 === 0; }

/**
 * Is today a Traveling Cart day? (Fridays = day 5,12,19,26 and Sundays)
 */
export function isTravelingCartDay(day) {
  return day % 7 === 5 || day % 7 === 0;
}

/**
 * Days until next Traveling Cart visit.
 */
export function daysUntilCart(day) {
  for (let i = 0; i <= 7; i++) {
    const d = day + i;
    if (d > 28) return null;
    if (isTravelingCartDay(d)) return i;
  }
  return null;
}

/**
 * Get all Sundays remaining in this season.
 */
export function remainingSundays(day) {
  const sundays = [7, 14, 21, 28];
  return sundays.filter(s => s >= day);
}

/**
 * Get all cart days remaining in this season.
 */
export function remainingCartDays(day) {
  const cartDays = [5, 7, 12, 14, 19, 21, 26, 28];
  return cartDays.filter(d => d >= day);
}
