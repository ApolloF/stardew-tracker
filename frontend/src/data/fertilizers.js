// Fertilizer types and their effects on crop growth and quality
export const FERTILIZERS = [
  {
    id: 'none',
    name: 'No Fertilizer',
    emoji: '🌱',
    speedMultiplier: 1.0,   // no change
    qualityBoost: 'none',
    description: 'Normal growth speed',
    color: '#888',
  },
  {
    id: 'basic-fertilizer',
    name: 'Basic Fertilizer',
    emoji: '🪣',
    speedMultiplier: 1.0,
    qualityBoost: 'low',
    description: 'Slight quality boost. Made from Sap ×2.',
    color: '#8B6914',
  },
  {
    id: 'quality-fertilizer',
    name: 'Quality Fertilizer',
    emoji: '🟫',
    speedMultiplier: 1.0,
    qualityBoost: 'medium',
    description: 'Good quality boost. Made from Sap ×2 + Fish.',
    color: '#a07830',
  },
  {
    id: 'deluxe-fertilizer',
    name: 'Deluxe Fertilizer',
    emoji: '⬛',
    speedMultiplier: 1.0,
    qualityBoost: 'high',
    description: 'Maximizes gold-star chance. Rare — from Qi.',
    color: '#303030',
  },
  {
    id: 'speed-gro',
    name: 'Speed-Gro',
    emoji: '💨',
    speedMultiplier: 0.9,   // 10% faster
    qualityBoost: 'none',
    description: '10% faster growth. Made from Pine Tar ×1 + Clam ×1.',
    color: '#60b840',
  },
  {
    id: 'deluxe-speed-gro',
    name: 'Deluxe Speed-Gro',
    emoji: '🌀',
    speedMultiplier: 0.75,  // 25% faster
    qualityBoost: 'none',
    description: '25% faster growth. Bought from Pierre in Spring / Sandy.',
    color: '#3090d8',
  },
  {
    id: 'hyper-speed-gro',
    name: 'Hyper Speed-Gro',
    emoji: '⚡',
    speedMultiplier: 0.67,  // 33% faster
    qualityBoost: 'none',
    description: '33% faster growth. From Mr. Qi\'s walnut shop.',
    color: '#e060c0',
  },
];

/**
 * Compute adjusted growth days for a crop given a fertilizer.
 * Stardew uses floor() on the reduction, minimum 1 day.
 */
export function adjustedDays(baseDays, fertilizerId) {
  const f = FERTILIZERS.find(f => f.id === fertilizerId) || FERTILIZERS[0];
  if (f.speedMultiplier === 1.0) return baseDays;
  const saved = Math.floor(baseDays * (1 - f.speedMultiplier));
  return Math.max(1, baseDays - saved);
}

/**
 * Last day you can plant a crop (in a 28-day season) to still harvest once.
 */
export function lastPlantDayWithFertilizer(baseDays, fertilizerId) {
  return 28 - adjustedDays(baseDays, fertilizerId);
}
