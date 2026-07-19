import {BUNDLE_ROOMS} from './bundles.js';
import {CROPS} from './crops.js';
import {FISH} from './fish.js';
import {VILLAGERS} from './villagers.js';
import {PROJECTS} from './projects.js';
import {MUSEUM_ITEMS,SHIPPING_ITEMS,COOKING_RECIPES,CRAFTING_RECIPES} from './trackers.js';
import {ACHIEVEMENTS,JOURNAL_SCRAPS,POWERS,RARECROWS,SECRET_NOTES} from './features.generated.js';
export const UI_ICON_KEYS=['home','today','tomorrow','bundles','crops','goals','collections','heart','calendar','fishing','perfection','reference','oracle','rain','sun','moon','clock','cart','tv','import','logout','search','warning','leaf','refresh','check','save','people','farmer','discoveries','skills','note','fire']as const;
export type UiIconKey=typeof UI_ICON_KEYS[number];
export const ANIMAL_ICON_BY_TYPE={
 Chicken:'/game-icons/animals/chicken.webp','White Chicken':'/game-icons/animals/chicken.webp','Brown Chicken':'/game-icons/animals/brown-chicken.webp','Blue Chicken':'/game-icons/animals/blue-chicken.webp','Void Chicken':'/game-icons/animals/void-chicken.webp','Golden Chicken':'/game-icons/animals/golden-chicken.webp',Duck:'/game-icons/animals/duck.webp',Rabbit:'/game-icons/animals/rabbit.webp',Dinosaur:'/game-icons/animals/dinosaur.webp',Cow:'/game-icons/animals/cow.webp','White Cow':'/game-icons/animals/cow.webp','Brown Cow':'/game-icons/animals/brown-cow.webp',Goat:'/game-icons/animals/goat.webp',Sheep:'/game-icons/animals/sheep.webp',Pig:'/game-icons/animals/pig.webp',Ostrich:'/game-icons/animals/ostrich.webp',Cat:'/game-icons/animals/cat.webp',Dog:'/game-icons/animals/dog.webp',Turtle:'/game-icons/animals/turtle.webp',Horse:'/game-icons/animals/horse.png'
}as const;
export type AnimalIconType=keyof typeof ANIMAL_ICON_BY_TYPE;
const records=[...CROPS,...FISH,...VILLAGERS,...PROJECTS,...MUSEUM_ITEMS,...SHIPPING_ITEMS,...COOKING_RECIPES,...CRAFTING_RECIPES,...ACHIEVEMENTS,...POWERS,...SECRET_NOTES,...JOURNAL_SCRAPS,...RARECROWS];
const bundlePaths=BUNDLE_ROOMS.flatMap(room=>[room.iconPath,...room.bundles.flatMap(bundle=>bundle.items.map(item=>item.iconPath))]);
export const EXPECTED_GAME_ICON_PATHS=[...new Set([...records.map(record=>record.iconPath),...bundlePaths,...Object.values(ANIMAL_ICON_BY_TYPE),'/game-icons/misc/stardrop.png','/game-icons/misc/golden-walnut.png'].filter((path):path is string=>Boolean(path)))].sort();
export const ICON_COVERAGE={catalogRecords:records.length,bundleRooms:BUNDLE_ROOMS.length,animalTypes:Object.keys(ANIMAL_ICON_BY_TYPE).length,paths:EXPECTED_GAME_ICON_PATHS.length}as const;