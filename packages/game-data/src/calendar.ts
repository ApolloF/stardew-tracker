import { meta } from './meta.js';
import type { CalendarEntry, Season } from './types.js';

const m = meta('Calendar');
const event=(id:string,name:string,emoji:string,season:Season,day:number,kind:CalendarEntry['kind']='festival',year?:number):CalendarEntry=>({...m,id,name,emoji,season,day,kind,...(year?{year}:{})});
export const FESTIVALS:CalendarEntry[]=[
  event('egg-festival','Egg Festival','🥚','Spring',13),event('desert-festival-1','Desert Festival — Day 1','🏜️','Spring',15),event('desert-festival-2','Desert Festival — Day 2','🏜️','Spring',16),event('desert-festival-3','Desert Festival — Day 3','🏜️','Spring',17),event('flower-dance','Flower Dance','💃','Spring',24),
  event('luau','Luau','🍲','Summer',11),event('trout-derby-1','Trout Derby — Day 1','🎣','Summer',20),event('trout-derby-2','Trout Derby — Day 2','🎣','Summer',21),event('moonlight-jellies','Dance of the Moonlight Jellies','🪼','Summer',28),
  event('stardew-fair','Stardew Valley Fair','🎪','Fall',16),event('spirits-eve',"Spirit’s Eve",'🎃','Fall',27),
  event('squidfest-1','SquidFest — Day 1','🦑','Winter',12),event('squidfest-2','SquidFest — Day 2','🦑','Winter',13),event('night-market-1','Night Market — Day 1','🌙','Winter',15),event('night-market-2','Night Market — Day 2','🌙','Winter',16),event('night-market-3','Night Market — Day 3','🌙','Winter',17),event('festival-ice','Festival of Ice','🧊','Winter',8),event('winter-star','Feast of the Winter Star','🎁','Winter',25),
];

const recipes=[
 ['Stir Fry','Coleslaw','Radish Salad','Omelet'],['Baked Fish','Pancakes','Maki Roll','Bread'],['Tortilla','Trout Soup','Glazed Yams','Artichoke Dip'],['Plum Pudding','Chocolate Cake','Pumpkin Pie','Cranberry Candy'],
 ['Pizza','Hashbrowns','Complete Breakfast','Lucky Lunch'],['Carp Surprise','Maple Bar','Pink Cake','Roasted Hazelnuts'],['Fruit Salad','Blackberry Cobbler','Crab Cakes','Fiddlehead Risotto'],['Poppyseed Muffin','Chowder','Bruschetta','Shrimp Cocktail'],
];
const seasons:Season[]=['Spring','Summer','Fall','Winter'];
export const QUEEN_OF_SAUCE:CalendarEntry[]=recipes.flatMap((set,index)=>set.map((name,week)=>event(`qos-${index+1}-${week+1}`,name,'📺',seasons[index%4],(week+1)*7,'tv',index<4?1:2)));
export function queenOfSauce(season:Season,day:number,year:number):CalendarEntry|undefined {
  const effective=((year-1)%2)+1;
  return QUEEN_OF_SAUCE.find(e=>e.season===season&&e.day===Math.ceil(day/7)*7&&e.year===effective);
}
