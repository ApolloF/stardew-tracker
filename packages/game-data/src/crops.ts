import { meta } from './meta.js';
import type { Crop, Season } from './types.js';
import { objectSprite } from './icons.js';

const m = meta('Crops');
const crop = (id: string, name: string, emoji: string, seasons: Season[], growthDays: number, regrowDays: number | null, seedPrice: number | null, sellPrice: number, seedSource: string, extras: Partial<Crop> = {}): Crop => ({
  ...m, id, name, emoji, ...objectSprite(name), seasons, growthDays, regrowDays, seedPrice, sellPrice, seedSource, ...extras,
});

export const CROPS: Crop[] = [
  crop('blue-jazz','Blue Jazz','💠',['Spring'],7,null,30,50,"Pierre's"),
  crop('carrot','Carrot','🥕',['Spring'],3,null,null,35,'Artifact spots, seed spots, prize tickets'),
  crop('cauliflower','Cauliflower','🥦',['Spring'],12,null,80,175,"Pierre's",{giant:true}),
  crop('coffee-bean','Coffee Bean','☕',['Spring','Summer'],10,2,null,15,'Dust Sprites or Traveling Cart'),
  crop('garlic','Garlic','🧄',['Spring'],4,null,40,60,"Pierre's from Year 2"),
  crop('green-bean','Green Bean','🫘',['Spring'],10,3,60,40,"Pierre's",{trellis:true}),
  crop('kale','Kale','🥬',['Spring'],6,null,70,110,"Pierre's"),
  crop('parsnip','Parsnip','🥕',['Spring'],4,null,20,35,"Pierre's"),
  crop('potato','Potato','🥔',['Spring'],6,null,50,80,"Pierre's"),
  crop('rhubarb','Rhubarb','🌿',['Spring'],13,null,100,220,'Oasis'),
  crop('strawberry','Strawberry','🍓',['Spring'],8,4,100,120,'Egg Festival'),
  crop('tulip','Tulip','🌷',['Spring'],6,null,20,30,"Pierre's"),
  crop('unmilled-rice','Unmilled Rice','🌾',['Spring'],8,null,40,30,"Pierre's from Year 2; 6 days near water"),
  crop('blueberry','Blueberry','🫐',['Summer'],13,4,80,50,"Pierre's"),
  crop('corn','Corn','🌽',['Summer','Fall'],14,4,150,50,"Pierre's"),
  crop('hops','Hops','🌿',['Summer'],11,1,60,25,"Pierre's",{trellis:true}),
  crop('hot-pepper','Hot Pepper','🌶️',['Summer'],5,3,40,40,"Pierre's"),
  crop('melon','Melon','🍈',['Summer'],12,null,80,250,"Pierre's",{giant:true}),
  crop('poppy','Poppy','🌺',['Summer'],7,null,100,140,"Pierre's"),
  crop('radish','Radish','🔴',['Summer'],6,null,40,90,"Pierre's"),
  crop('red-cabbage','Red Cabbage','🥬',['Summer'],9,null,100,260,"Pierre's from Year 2"),
  crop('starfruit','Starfruit','⭐',['Summer'],13,null,400,750,'Oasis'),
  crop('summer-spangle','Summer Spangle','🌼',['Summer'],8,null,50,90,"Pierre's"),
  crop('summer-squash','Summer Squash','🥒',['Summer'],6,3,null,45,'Artifact spots, seed spots, prize tickets'),
  crop('sunflower','Sunflower','🌻',['Summer','Fall'],8,null,200,80,"Pierre's or JojaMart"),
  crop('tomato','Tomato','🍅',['Summer'],11,4,50,60,"Pierre's"),
  crop('wheat','Wheat','🌾',['Summer','Fall'],4,null,10,25,"Pierre's"),
  crop('amaranth','Amaranth','🪻',['Fall'],7,null,70,150,"Pierre's"),
  crop('artichoke','Artichoke','🌱',['Fall'],8,null,30,160,"Pierre's from Year 2"),
  crop('beet','Beet','🫜',['Fall'],6,null,20,100,'Oasis'),
  crop('bok-choy','Bok Choy','🥬',['Fall'],4,null,50,80,"Pierre's"),
  crop('broccoli','Broccoli','🥦',['Fall'],8,4,null,70,'Artifact spots, seed spots, prize tickets'),
  crop('cranberries','Cranberries','🔴',['Fall'],7,5,240,75,"Pierre's"),
  crop('eggplant','Eggplant','🍆',['Fall'],5,5,20,60,"Pierre's"),
  crop('fairy-rose','Fairy Rose','🌹',['Fall'],12,null,200,290,"Pierre's"),
  crop('grape','Grape','🍇',['Fall'],10,3,60,80,"Pierre's",{trellis:true}),
  crop('pumpkin','Pumpkin','🎃',['Fall'],13,null,100,320,"Pierre's",{giant:true}),
  crop('yam','Yam','🍠',['Fall'],10,null,60,160,"Pierre's"),
  crop('powdermelon','Powdermelon','❄️',['Winter'],7,null,null,60,'Artifact spots, seed spots, prize tickets',{giant:true}),
  crop('ancient-fruit','Ancient Fruit','🔵',['Spring','Summer','Fall'],28,7,null,550,'Ancient Seeds'),
  crop('cactus-fruit','Cactus Fruit','🌵',['Spring','Summer','Fall','Winter'],12,3,150,75,'Oasis; indoors only'),
  crop('pineapple','Pineapple','🍍',['Summer'],14,7,null,300,'Island Trader; grows year-round on Ginger Island',{spoilerTier:'late-game'}),
  crop('qi-fruit','Qi Fruit','💙',['Spring','Summer','Fall','Winter'],4,null,null,1,"Qi's Crop quest",{giant:true,spoilerTier:'late-game'}),
  crop('sweet-gem-berry','Sweet Gem Berry','💎',['Fall'],24,null,1000,3000,'Rare Seed from Traveling Cart'),
  crop('taro-root','Taro Root','🫚',['Summer'],10,null,null,100,'Island Trader; 7 days near water',{spoilerTier:'late-game'}),
];

export const FERTILIZERS = [
  { id:'none', name:'No speed boost', percent:0 },
  { id:'speed-gro', name:'Speed-Gro', percent:10 },
  { id:'deluxe-speed-gro', name:'Deluxe Speed-Gro', percent:25 },
  { id:'hyper-speed-gro', name:'Hyper Speed-Gro', percent:33 },
] as const;

export function adjustedGrowthDays(baseDays: number, speedPercent = 0, agriculturist = false): number {
  const total = Math.min(0.43, speedPercent / 100 + (agriculturist ? 0.1 : 0));
  const daysRemoved = Math.ceil(baseDays * total - 0.001);
  return Math.max(1, baseDays - daysRemoved);
}

export function lastPlantingDay(crop: Crop, season: Season, speedPercent = 0, agriculturist = false): number | null {
  if (!crop.seasons.includes(season)) return null;
  return 28 - adjustedGrowthDays(crop.growthDays, speedPercent, agriculturist);
}

export function harvestCount(crop: Crop, plantedDay: number, speedPercent = 0, agriculturist = false): number {
  const first = plantedDay + adjustedGrowthDays(crop.growthDays, speedPercent, agriculturist);
  if (first > 28) return 0;
  return crop.regrowDays ? 1 + Math.floor((28 - first) / crop.regrowDays) : 1;
}
