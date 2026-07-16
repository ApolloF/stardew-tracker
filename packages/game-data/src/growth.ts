import type { Crop, Season } from './types.js';

/** Stardew applies the combined speed modifier, then rounds the resulting duration up. */
export function adjustedGrowthDays(baseDays:number,speedPercent=0,agriculturist=false):number{
  const total=Math.min(0.43,speedPercent/100+(agriculturist?0.1:0));
  return Math.max(1,Math.ceil(baseDays*(1-total)));
}
export function lastPlantingDay(crop:Crop,season:Season,speedPercent=0,agriculturist=false):number|null{
  if(!crop.seasons.includes(season))return null;
  return 28-adjustedGrowthDays(crop.growthDays,speedPercent,agriculturist);
}
export function harvestCount(crop:Crop,plantedDay:number,speedPercent=0,agriculturist=false):number{
  const first=plantedDay+adjustedGrowthDays(crop.growthDays,speedPercent,agriculturist);
  if(first>28)return 0;
  return crop.regrowDays?1+Math.floor((28-first)/crop.regrowDays):1;
}
