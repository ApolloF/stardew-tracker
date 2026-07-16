export type Season = 'Spring' | 'Summer' | 'Fall' | 'Winter';
export type SpoilerTier = 'ordinary' | 'progression' | 'late-game';

export interface SourceMeta {
  gameVersion: '1.6.15';
  verifiedAt: string;
  source: string;
}

export interface CatalogRecord extends SourceMeta {
  id: string;
  name: string;
  emoji: string;
  description?: string;
  tags?: string[];
  spoilerTier?: SpoilerTier;
}

export interface Crop extends CatalogRecord {
  seasons: Season[];
  growthDays: number;
  regrowDays: number | null;
  seedPrice: number | null;
  sellPrice: number;
  seedSource: string;
  trellis?: boolean;
  giant?: boolean;
}

export interface BundleItem {
  id: string;
  name: string;
  quantity?: number;
  quality?: 'silver' | 'gold' | 'iridium';
  hint: string;
}

export interface Bundle extends CatalogRecord {
  roomId: string;
  required: number;
  reward: string;
  items: BundleItem[];
}

export interface BundleRoom extends CatalogRecord {
  reward: string;
  bundles: Bundle[];
}

export interface Villager extends CatalogRecord {
  birthday: { season: Season; day: number };
  lovedGifts: string[];
  marriageCandidate?: boolean;
}

export interface Fish extends CatalogRecord {
  seasons: Season[] | ['All'];
  locations: string[];
  time: string;
  weather: 'Any' | 'Sunny' | 'Rain';
  bundle?: string;
}

export interface Project extends CatalogRecord {
  category: 'building' | 'machine' | 'unlock' | 'perfection';
  cost?: number;
  materials: Record<string, number>;
  prerequisite?: string;
}

export interface CalendarEntry extends CatalogRecord {
  season: Season;
  day: number;
  kind: 'festival' | 'event' | 'tv';
  year?: number;
}

export interface FarmDate {
  season: Season;
  day: number;
  year: number;
}

export interface FarmReminder {
  id: string;
  timing: 'today' | 'tomorrow' | 'upcoming';
  category: 'birthday' | 'festival' | 'tv' | 'cart' | 'season' | 'crop';
  emoji: string;
  title: string;
  detail: string;
  date: FarmDate;
  link?: string;
}
