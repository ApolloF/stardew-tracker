import { meta } from './meta.js';
import type { Season, Villager } from './types.js';

const m = meta('List_of_All_Gifts');
const v = (id:string,name:string,emoji:string,season:Season,day:number,lovedGifts:string[],marriageCandidate=false):Villager => ({...m,id,name,emoji,birthday:{season,day},lovedGifts,marriageCandidate,spoilerTier:id==='leo'?'late-game':'ordinary'});

export const UNIVERSAL_LOVES = ['Golden Pumpkin','Magic Rock Candy','Pearl','Prismatic Shard','Rabbit’s Foot','Stardrop Tea'];
export const UNIVERSAL_EXCEPTIONS: Record<string,string[]> = { Haley:['Prismatic Shard'], Penny:['Rabbit’s Foot'] };

export const VILLAGERS: Villager[] = [
  v('abigail','Abigail','💜','Fall',13,['Amethyst','Banana Pudding','Blackberry Cobbler','Chocolate Cake','Pufferfish','Pumpkin','Spicy Eel'],true),
  v('alex','Alex','🏈','Summer',13,['Complete Breakfast','Salmon Dinner'],true),
  v('caroline','Caroline','🌿','Winter',7,['Fish Taco','Green Tea','Summer Spangle','Tropical Curry']),
  v('clint','Clint','⚒️','Winter',26,['Amethyst','Aquamarine','Artichoke Dip','Emerald','Fiddlehead Risotto','Gold Bar','Iridium Bar','Jade','Omni Geode','Ruby','Topaz']),
  v('demetrius','Demetrius','🔬','Summer',19,['Bean Hotpot','Ice Cream','Rice Pudding','Strawberry']),
  v('dwarf','Dwarf','⛏️','Summer',22,['Amethyst','Aquamarine','Emerald','Jade','Lemon Stone','Omni Geode','Ruby','Topaz']),
  v('elliott','Elliott','📚','Fall',5,['Crab Cakes','Duck Feather','Lobster','Pomegranate','Squid Ink','Tom Kha Soup'],true),
  v('emily','Emily','💎','Spring',27,['Amethyst','Aquamarine','Cloth','Emerald','Jade','Ruby','Survival Burger','Topaz','Wool'],true),
  v('evelyn','Evelyn','🌹','Winter',20,['Beet','Chocolate Cake','Diamond','Fairy Rose','Stuffing','Tulip']),
  v('george','George','🪑','Fall',24,['Fried Mushroom','Leek']),
  v('gus','Gus','🍺','Summer',8,['Diamond','Escargot','Fish Taco','Orange','Tropical Curry']),
  v('haley','Haley','🌻','Spring',14,['Coconut','Fruit Salad','Pink Cake','Sunflower'],true),
  v('harvey','Harvey','🩺','Winter',14,['Coffee','Pickles','Super Meal','Truffle Oil','Wine'],true),
  v('jas','Jas','🎀','Summer',4,['Fairy Rose','Pink Cake','Plum Pudding']),
  v('jodi','Jodi','🏠','Fall',11,['Chocolate Cake','Crispy Bass','Diamond','Eggplant Parmesan','Fried Eel','Pancakes','Rhubarb Pie','Vegetable Medley']),
  v('kent','Kent','🎖️','Spring',4,['Fiddlehead Risotto','Roasted Hazelnuts']),
  v('krobus','Krobus','👁️','Winter',1,['Diamond','Iridium Bar','Monster Compendium','Pumpkin','Void Egg','Void Mayonnaise','Wild Horseradish']),
  v('leah','Leah','🎨','Winter',23,['Goat Cheese','Poppyseed Muffin','Salad','Stir Fry','Truffle','Vegetable Medley','Wine'],true),
  v('leo','Leo','🦜','Summer',26,['Duck Feather','Mango','Ostrich Egg','Poi']),
  v('lewis','Lewis','🎩','Spring',7,["Autumn’s Bounty",'Glazed Yams','Green Tea','Hot Pepper','Vegetable Medley']),
  v('linus','Linus','⛺','Winter',3,['Blueberry Tart','Cactus Fruit','Coconut',"Dish O’ The Sea",'Yam']),
  v('marnie','Marnie','🐄','Fall',18,['Diamond',"Farmer’s Lunch",'Pink Cake','Pumpkin Pie']),
  v('maru','Maru','🔭','Summer',10,['Battery Pack','Cauliflower','Cheese Cauliflower','Diamond','Gold Bar','Iridium Bar',"Miner’s Treat",'Pepper Poppers','Radioactive Bar','Rhubarb Pie','Strawberry'],true),
  v('pam','Pam','🚌','Spring',18,['Beer','Cactus Fruit','Glazed Yams','Mead','Pale Ale','Parsnip','Parsnip Soup','Piña Colada']),
  v('penny','Penny','📖','Fall',2,['Diamond','Emerald','Melon','Poppy','Poppyseed Muffin','Red Plate','Roots Platter','Sandfish','Tom Kha Soup'],true),
  v('pierre','Pierre','🛒','Spring',26,['Fried Calamari','Price Catalogue']),
  v('robin','Robin','🪵','Fall',21,['Goat Cheese','Peach','Spaghetti']),
  v('sam','Sam','🎸','Summer',17,['Cactus Fruit','Maple Bar','Pizza','Tigerseye'],true),
  v('sandy','Sandy','🌵','Fall',15,['Crocus','Daffodil','Mango Sticky Rice','Sweet Pea']),
  v('sebastian','Sebastian','🖥️','Winter',10,['Frozen Tear','Obsidian','Pumpkin Soup','Sashimi','Void Egg'],true),
  v('shane','Shane','🐔','Spring',20,['Beer','Hot Pepper','Pepper Poppers','Pizza'],true),
  v('vincent','Vincent','🧸','Spring',10,['Cranberry Candy','Ginger Ale','Grape','Pink Cake','Snail']),
  v('willy','Willy','🎣','Summer',24,['Catfish','Diamond','Iridium Bar','Mead','Octopus','Pumpkin','Sea Cucumber','Sturgeon']),
  v('wizard','Wizard','🔮','Winter',17,['Book of Mysteries','Purple Mushroom','Solar Essence','Super Cucumber','Void Essence']),
];

const order:Season[]=['Spring','Summer','Fall','Winter'];
export function daysUntilBirthday(villager:Villager,season:Season,day:number):number {
  const from=order.indexOf(season)*28+day;
  const to=order.indexOf(villager.birthday.season)*28+villager.birthday.day;
  return to>=from?to-from:112-from+to;
}
