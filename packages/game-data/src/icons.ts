import { OBJECT_ID_BY_NAME,OBJECT_NAME_BY_ID } from './object-icons.generated.js';

const ITEM_OVERRIDES: Record<string, string> = {
  'large-white-egg': '174',
  'large-brown-egg': '182',
  'large-goat-milk': '438',
  'rabbits-foot': '446',
};

export function objectSprite(name: string, stableId?: string) {
  const gameId = (stableId && ITEM_OVERRIDES[stableId]) || OBJECT_ID_BY_NAME[name as keyof typeof OBJECT_ID_BY_NAME];
  return gameId ? { gameId: String(gameId), iconPath: `/game-icons/objects/${gameId}.webp` } : {};
}

export function bundleSprite(stableId: string, name: string) {
  const amount = /^gold-\d+$/.test(stableId) ? stableId.slice(5) : '';
  return amount ? { gameId: `bundle:${amount}`, iconPath: `/game-icons/bundles/${amount}.webp` } : objectSprite(name, stableId);
}
const ROOM_ICONS: Record<string, string> = {
  'crafts-room': '16', pantry: '24', 'fish-tank': '145', 'boiler-room': '334',
  'bulletin-board': '458', vault: 'bundle:2500', 'abandoned-jojamart': '74',
};

export function roomSprite(stableId: string) {
  const gameId = ROOM_ICONS[stableId];
  if (!gameId) return {};
  return gameId.startsWith('bundle:')
    ? { gameId, iconPath: `/game-icons/bundles/${gameId.slice(7)}.webp` }
    : { gameId, iconPath: `/game-icons/objects/${gameId}.webp` };
}

export function objectName(gameId:string){return OBJECT_NAME_BY_ID[gameId as keyof typeof OBJECT_NAME_BY_ID]||`Item ${gameId}`;}
