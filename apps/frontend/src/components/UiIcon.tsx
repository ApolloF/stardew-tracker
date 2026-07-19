import type { ComponentType } from 'react';
import {
  IconHome2, IconSunrise, IconSunset, IconPackage, IconPlant2, IconTarget, IconBooks, IconHeart,
  IconCalendar, IconFishHook, IconTrophy, IconBook2, IconSparkles, IconCloudRain, IconSun, IconMoon,
  IconClock, IconShoppingCart, IconDeviceTv, IconFileImport, IconLogout, IconSearch, IconAlertTriangle,
  IconLeaf, IconRefresh, IconCheck, IconDeviceFloppy, IconUsers, IconUser, IconTelescope, IconAward,
  IconNotes, IconFlame, IconEgg, IconCactus, IconFlower, IconSoup, IconMoonStars, IconPumpkinScary,
  IconSnowflake, IconGift, IconConfetti, IconFish,
} from '@tabler/icons-react';

export type UiIconName =
  | 'home' | 'today' | 'tomorrow' | 'bundles' | 'crops' | 'goals' | 'collections' | 'heart' | 'calendar'
  | 'fishing' | 'perfection' | 'reference' | 'oracle' | 'rain' | 'sun' | 'moon' | 'clock' | 'cart' | 'tv'
  | 'import' | 'logout' | 'search' | 'warning' | 'leaf' | 'refresh' | 'check' | 'save' | 'people' | 'farmer'
  | 'discoveries' | 'skills' | 'note' | 'fire'
  | 'egg' | 'desert' | 'flower' | 'soup' | 'nightMarket' | 'pumpkin' | 'ice' | 'gift' | 'fair' | 'squid';

// Tabler has no dedicated squid glyph; IconFish is the closest available stand-in for SquidFest.
const ICONS: Record<UiIconName, ComponentType<Record<string, unknown>>> = {
  home: IconHome2, today: IconSunrise, tomorrow: IconSunset, bundles: IconPackage, crops: IconPlant2,
  goals: IconTarget, collections: IconBooks, heart: IconHeart, calendar: IconCalendar, fishing: IconFishHook,
  perfection: IconTrophy, reference: IconBook2, oracle: IconSparkles, rain: IconCloudRain, sun: IconSun,
  moon: IconMoon, clock: IconClock, cart: IconShoppingCart, tv: IconDeviceTv, import: IconFileImport,
  logout: IconLogout, search: IconSearch, warning: IconAlertTriangle, leaf: IconLeaf, refresh: IconRefresh,
  check: IconCheck, save: IconDeviceFloppy, people: IconUsers, farmer: IconUser, discoveries: IconTelescope,
  skills: IconAward, note: IconNotes, fire: IconFlame,
  egg: IconEgg, desert: IconCactus, flower: IconFlower, soup: IconSoup, nightMarket: IconMoonStars,
  pumpkin: IconPumpkinScary, ice: IconSnowflake, gift: IconGift, fair: IconConfetti, squid: IconFish,
};

export default function UiIcon({ name, label, size = 22 }: { name: UiIconName; label?: string; size?: number }) {
  const Icon = ICONS[name];
  return (
    <Icon
      className="ui-icon"
      size={size}
      stroke={1.8}
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
      data-icon={name}
    />
  );
}
