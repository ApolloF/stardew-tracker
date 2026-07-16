// Spring Y1 crops with planting info.
// lastPlantDay = last day you can plant to get at least one harvest before Winter (Day 28).

export const SPRING_CROPS = [
  {
    id: 'parsnip',
    name: 'Parsnip',
    emoji: '🥕',
    days: 4,
    regrow: null,
    seedPrice: 20,
    sellPrice: 35,
    source: "Pierre's General Store",
    hint: 'The fastest crop — perfect to start with. Plant on day 1!',
    bundleUse: ['spring-crops'],
    lastPlantDay: 24,
    priority: 'high',
  },
  {
    id: 'cauliflower',
    name: 'Cauliflower',
    emoji: '🥦',
    days: 12,
    regrow: null,
    seedPrice: 80,
    sellPrice: 175,
    source: "Pierre's General Store",
    hint: 'High value but slow — plant before Spring 16!',
    bundleUse: ['spring-crops'],
    lastPlantDay: 16,
    priority: 'high',
  },
  {
    id: 'potato',
    name: 'Potato',
    emoji: '🥔',
    days: 6,
    regrow: null,
    seedPrice: 50,
    sellPrice: 80,
    source: "Pierre's General Store",
    hint: 'Decent profit and sometimes gives a bonus harvest!',
    bundleUse: ['spring-crops'],
    lastPlantDay: 22,
    priority: 'high',
  },
  {
    id: 'green-bean',
    name: 'Green Bean',
    emoji: '🫘',
    days: 10,
    regrow: 3,
    seedPrice: 60,
    sellPrice: 40,
    source: "Pierre's General Store",
    hint: 'Needs a trellis. Keeps producing every 3 days — great value!',
    bundleUse: ['spring-crops'],
    lastPlantDay: 18,
    priority: 'high',
  },
  {
    id: 'kale',
    name: 'Kale',
    emoji: '🥬',
    days: 6,
    regrow: null,
    seedPrice: 70,
    sellPrice: 110,
    source: "Pierre's General Store",
    hint: 'Good gold-per-day ratio. Great early money-maker!',
    bundleUse: [],
    lastPlantDay: 22,
    priority: 'medium',
  },
  {
    id: 'strawberry',
    name: 'Strawberry',
    emoji: '🍓',
    days: 8,
    regrow: 4,
    seedPrice: 100,
    sellPrice: 120,
    source: 'Egg Festival (Spring 13) — buy as many as you can!',
    hint: 'Buy lots of seeds at the Egg Festival on Spring 13. Plant right after!',
    bundleUse: [],
    lastPlantDay: 20,
    priority: 'high',
  },
  {
    id: 'coffee-bean',
    name: 'Coffee Bean',
    emoji: '☕',
    days: 10,
    regrow: 2,
    seedPrice: null,
    sellPrice: 15,
    source: 'Traveling Cart (random! Check Fridays & Sundays)',
    hint: 'Each plant gives 4 beans. Make coffee for a speed boost — very useful!',
    bundleUse: [],
    lastPlantDay: 18,
    priority: 'medium',
  },
  {
    id: 'tulip',
    name: 'Tulip',
    emoji: '🌷',
    days: 6,
    regrow: null,
    seedPrice: 20,
    sellPrice: 30,
    source: "Pierre's General Store",
    hint: 'Pretty flower loved by some villagers as a gift!',
    bundleUse: [],
    lastPlantDay: 22,
    priority: 'low',
  },
  {
    id: 'blue-jazz',
    name: 'Blue Jazz',
    emoji: '💐',
    days: 7,
    regrow: null,
    seedPrice: 30,
    sellPrice: 50,
    source: "Pierre's General Store",
    hint: 'Beautiful spring flower — great for gifting to villagers!',
    bundleUse: [],
    lastPlantDay: 21,
    priority: 'low',
  },
  {
    id: 'garlic',
    name: 'Garlic',
    emoji: '🧄',
    days: 4,
    regrow: null,
    seedPrice: 40,
    sellPrice: 60,
    source: "Pierre's (usually Year 2+) — sometimes at the Traveling Cart!",
    hint: 'Normally available year 2, but check the Traveling Cart — you might get lucky!',
    bundleUse: [],
    lastPlantDay: 24,
    priority: 'low',
  },
];

// Returns planting status for a given day
export function getPlantingStatus(crop, currentDay) {
  if (currentDay > crop.lastPlantDay) return 'too-late';
  if (currentDay >= crop.lastPlantDay - 4) return 'urgent';
  if (currentDay >= crop.lastPlantDay - 8) return 'soon';
  return 'fine';
}

// Days until harvest if planted today
export function daysToHarvest(crop, currentDay) {
  return crop.days;
}

// Harvest day if planted today
export function harvestDay(crop, currentDay) {
  return Math.min(currentDay + crop.days, 28);
}
