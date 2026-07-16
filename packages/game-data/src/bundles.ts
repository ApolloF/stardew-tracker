import { meta } from './meta.js';
import type { Bundle, BundleItem, BundleRoom } from './types.js';

const m = meta('Bundles');
const item = (id:string, name:string, hint:string, quantity=1, quality?:BundleItem['quality']):BundleItem => ({id,name,hint,quantity,...(quality?{quality}:{})});
const bundle = (roomId:string,id:string,name:string,required:number,reward:string,items:BundleItem[]):Bundle => ({...m,id,name,emoji:'📦',roomId,required,reward,items});
const room = (id:string,name:string,emoji:string,reward:string,bundles:Bundle[]):BundleRoom => ({...m,id,name,emoji,reward,bundles});

const crafts = [
  bundle('crafts-room','spring-foraging','Spring Foraging Bundle',4,'Spring Seeds ×30',[
    item('wild-horseradish','Wild Horseradish','Spring forage'),item('daffodil','Daffodil','Spring forage'),item('leek','Leek','Spring forage'),item('dandelion','Dandelion','Spring forage')]),
  bundle('crafts-room','summer-foraging','Summer Foraging Bundle',3,'Summer Seeds ×30',[
    item('grape','Grape','Summer forage'),item('spice-berry','Spice Berry','Summer forage'),item('sweet-pea','Sweet Pea','Summer forage')]),
  bundle('crafts-room','fall-foraging','Fall Foraging Bundle',4,'Fall Seeds ×30',[
    item('common-mushroom','Common Mushroom','Fall forage'),item('wild-plum','Wild Plum','Fall forage'),item('hazelnut','Hazelnut','Fall forage'),item('blackberry','Blackberry','Fall forage')]),
  bundle('crafts-room','winter-foraging','Winter Foraging Bundle',4,'Winter Seeds ×30',[
    item('winter-root','Winter Root','Winter forage or hoe artifact spots'),item('crystal-fruit','Crystal Fruit','Winter forage'),item('snow-yam','Snow Yam','Hoe artifact spots in winter'),item('crocus','Crocus','Winter forage')]),
  bundle('crafts-room','construction','Construction Bundle',4,'Charcoal Kiln',[
    item('wood-a','Wood','Chop trees',99),item('wood-b','Wood','Chop trees',99),item('stone','Stone','Break rocks',99),item('hardwood','Hardwood','Large stumps and logs',10)]),
  bundle('crafts-room','exotic-foraging','Exotic Foraging Bundle',5,"Autumn's Bounty ×5",[
    item('coconut','Coconut','Calico Desert'),item('cactus-fruit','Cactus Fruit','Calico Desert'),item('cave-carrot','Cave Carrot','Mines'),item('red-mushroom','Red Mushroom','Mines or Secret Woods'),item('purple-mushroom','Purple Mushroom','Mines'),item('maple-syrup','Maple Syrup','Tap a maple tree'),item('oak-resin','Oak Resin','Tap an oak tree'),item('pine-tar','Pine Tar','Tap a pine tree'),item('morel','Morel','Secret Woods in Spring')]),
];

const pantry = [
  bundle('pantry','spring-crops','Spring Crops Bundle',4,'Speed-Gro ×20',[item('parsnip','Parsnip','Spring crop'),item('green-bean','Green Bean','Spring trellis crop'),item('cauliflower','Cauliflower','Spring crop'),item('potato','Potato','Spring crop')]),
  bundle('pantry','summer-crops','Summer Crops Bundle',4,'Quality Sprinkler',[item('tomato','Tomato','Summer crop'),item('hot-pepper','Hot Pepper','Summer crop'),item('blueberry','Blueberry','Summer crop'),item('melon','Melon','Summer crop')]),
  bundle('pantry','fall-crops','Fall Crops Bundle',4,'Bee House',[item('corn','Corn','Summer or Fall crop'),item('eggplant','Eggplant','Fall crop'),item('pumpkin','Pumpkin','Fall crop'),item('yam','Yam','Fall crop')]),
  bundle('pantry','quality-crops','Quality Crops Bundle',3,'Preserves Jar',[item('parsnip','Parsnip','Grow at gold quality',5,'gold'),item('melon','Melon','Grow at gold quality',5,'gold'),item('pumpkin','Pumpkin','Grow at gold quality',5,'gold'),item('corn','Corn','Grow at gold quality',5,'gold')]),
  bundle('pantry','animal','Animal Bundle',5,'Cheese Press',[item('large-white-egg','Large White Egg','Happy white chicken'),item('large-brown-egg','Large Brown Egg','Happy brown chicken'),item('large-milk','Large Milk','Happy cow'),item('large-goat-milk','Large Goat Milk','Happy goat'),item('wool','Wool','Sheep or rabbit'),item('duck-egg','Duck Egg','Duck')]),
  bundle('pantry','artisan','Artisan Bundle',6,'Keg',[item('truffle-oil','Truffle Oil','Oil Maker'),item('cloth','Cloth','Loom or recycling'),item('goat-cheese','Goat Cheese','Cheese Press'),item('cheese','Cheese','Cheese Press'),item('honey','Honey','Bee House'),item('jelly','Jelly','Preserves Jar'),item('apple','Apple','Apple tree'),item('apricot','Apricot','Apricot tree'),item('orange','Orange','Orange tree'),item('peach','Peach','Peach tree'),item('pomegranate','Pomegranate','Pomegranate tree'),item('cherry','Cherry','Cherry tree')]),
];

const fish = [
  bundle('fish-tank','river-fish','River Fish Bundle',4,'Deluxe Bait ×30',[item('sunfish','Sunfish','River, 6am–7pm, sunny'),item('catfish','Catfish','River, rain'),item('shad','Shad','River, rain'),item('tiger-trout','Tiger Trout','River, 6am–7pm')]),
  bundle('fish-tank','lake-fish','Lake Fish Bundle',4,'Dressed Spinner',[item('largemouth-bass','Largemouth Bass','Mountain Lake'),item('carp','Carp','Mountain Lake'),item('bullhead','Bullhead','Mountain Lake'),item('sturgeon','Sturgeon','Mountain Lake, Summer/Winter')]),
  bundle('fish-tank','ocean-fish','Ocean Fish Bundle',4,'Warp Totem: Beach ×5',[item('sardine','Sardine','Ocean'),item('tuna','Tuna','Ocean'),item('red-snapper','Red Snapper','Ocean, rain'),item('tilapia','Tilapia','Ocean')]),
  bundle('fish-tank','night-fishing','Night Fishing Bundle',3,'Glow Ring',[item('walleye','Walleye','Rain, noon–2am'),item('bream','Bream','River, 6pm–2am'),item('eel','Eel','Ocean, rain, 4pm–2am')]),
  bundle('fish-tank','crab-pot','Crab Pot Bundle',5,'Crab Pot ×3',[item('lobster','Lobster','Ocean crab pot'),item('crayfish','Crayfish','Freshwater crab pot'),item('crab','Crab','Ocean crab pot or Rock Crab'),item('cockle','Cockle','Ocean crab pot or beach'),item('mussel','Mussel','Ocean crab pot or beach'),item('shrimp','Shrimp','Ocean crab pot'),item('snail','Snail','Freshwater crab pot'),item('periwinkle','Periwinkle','Freshwater crab pot'),item('oyster','Oyster','Ocean crab pot or beach'),item('clam','Clam','Ocean crab pot or beach')]),
  bundle('fish-tank','specialty-fish','Specialty Fish Bundle',4,"Dish O' The Sea ×5",[item('pufferfish','Pufferfish','Ocean, Summer, sunny, noon–4pm'),item('ghostfish','Ghostfish','Mines floors 20/60'),item('sandfish','Sandfish','Desert pond'),item('woodskip','Woodskip','Secret Woods pond')]),
];

const boiler = [
  bundle('boiler-room','blacksmith','Blacksmith’s Bundle',3,'Furnace',[item('copper-bar','Copper Bar','Smelt copper ore'),item('iron-bar','Iron Bar','Smelt iron ore'),item('gold-bar','Gold Bar','Smelt gold ore')]),
  bundle('boiler-room','geologist','Geologist’s Bundle',4,'Omni Geode ×5',[item('quartz','Quartz','Mines'),item('earth-crystal','Earth Crystal','Mines floors 1–39'),item('frozen-tear','Frozen Tear','Mines floors 40–79'),item('fire-quartz','Fire Quartz','Mines floors 80–119')]),
  bundle('boiler-room','adventurer','Adventurer’s Bundle',2,'Small Magnet Ring',[item('slime','Slime','Slimes',99),item('bat-wing','Bat Wing','Bats',10),item('solar-essence','Solar Essence','Ghosts and mummies'),item('void-essence','Void Essence','Shadow monsters')]),
];

const board = [
  bundle('bulletin-board','chef','Chef’s Bundle',6,'Pink Cake ×3',[item('maple-syrup','Maple Syrup','Tap maple tree'),item('fiddlehead-fern','Fiddlehead Fern','Secret Woods in Summer'),item('truffle','Truffle','Pig'),item('poppy','Poppy','Summer crop'),item('maki-roll','Maki Roll','Cook'),item('fried-egg','Fried Egg','Cook')]),
  bundle('bulletin-board','dye','Dye Bundle',6,'Seed Maker',[item('red-mushroom','Red Mushroom','Mines'),item('sea-urchin','Sea Urchin','Beach beyond bridge'),item('sunflower','Sunflower','Summer/Fall crop'),item('duck-feather','Duck Feather','Happy duck'),item('aquamarine','Aquamarine','Mines'),item('red-cabbage','Red Cabbage','Summer crop, normally Year 2')]),
  bundle('bulletin-board','field-research','Field Research Bundle',4,'Recycling Machine',[item('purple-mushroom','Purple Mushroom','Mines'),item('nautilus-shell','Nautilus Shell','Winter beach forage'),item('chub','Chub','Mountain Lake or river'),item('frozen-geode','Frozen Geode','Mines floors 41–79')]),
  bundle('bulletin-board','fodder','Fodder Bundle',3,'Heater',[item('wheat','Wheat','Summer/Fall crop',10),item('hay','Hay','Silo or Marnie',10),item('apple','Apple','Apple tree',3)]),
  bundle('bulletin-board','enchanter','Enchanter’s Bundle',4,'Gold Bar ×5',[item('oak-resin','Oak Resin','Tap oak tree'),item('wine','Wine','Keg'),item('rabbits-foot',"Rabbit’s Foot",'Happy rabbit or Serpent'),item('pomegranate','Pomegranate','Pomegranate tree')]),
];

const vault = [2500,5000,10000,25000].map((amount,i)=>bundle('vault',`vault-${amount}`,`${amount.toLocaleString()}g Bundle`,1,['Chocolate Cake ×3','Quality Fertilizer ×30','Lightning Rod','Crystalarium'][i],[item(`gold-${amount}`,`${amount.toLocaleString()}g`,'Donate gold',amount)]));

export const MISSING_BUNDLE = bundle('abandoned-jojamart','missing-bundle','The Missing Bundle',5,'Movie Theater',[
  item('wine','Wine','Age any wine in a cask',1,'silver'),item('dinosaur-mayonnaise','Dinosaur Mayonnaise','Process a Dinosaur Egg'),item('prismatic-shard','Prismatic Shard','Rare mining drop'),item('ancient-fruit','Ancient Fruit','Grow Ancient Seeds',5,'gold'),item('void-salmon','Void Salmon','Witch’s Swamp',1,'gold'),item('caviar','Caviar','Preserve Sturgeon Roe')]);

export const BUNDLE_ROOMS: BundleRoom[] = [
  room('crafts-room','Crafts Room','🌲','Bridge Repair',crafts),room('pantry','Pantry','🌾','Greenhouse',pantry),room('fish-tank','Fish Tank','🐟','Glittering Boulder Removed',fish),room('boiler-room','Boiler Room','🔥','Minecarts Repaired',boiler),room('bulletin-board','Bulletin Board','📌','Friendship',board),room('vault','Vault','💰','Bus Repair',vault),room('abandoned-jojamart','Abandoned JojaMart','🎬','Movie Theater',[MISSING_BUNDLE]),
];

export function bundleCompleted(bundle: Bundle, completed: Record<string, boolean>): boolean {
  return bundle.items.filter(entry => completed[entry.id]).length >= bundle.required;
}

export function bundleProgress(bundle: Bundle, completed: Record<string, boolean>) {
  const count = bundle.items.filter(entry => completed[entry.id]).length;
  return { count, required: bundle.required, complete: count >= bundle.required };
}
