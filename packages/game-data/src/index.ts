export * from './types.js';
export * from './meta.js';
export { CROPS,FERTILIZERS } from './crops.js';
export { adjustedGrowthDays,lastPlantingDay,harvestCount } from './growth.js';
export * from './bundles.js';
export * from './villagers.js';
export * from './calendar.js';
export * from './reminders.js';
export * from './fish.js';
export * from './projects.js';
export * from './checklists.js';
export * from './import-types.js';
export * from './trackers.js';
export * from './icons.js';
export * from './features.generated.js';
export * from './monsters.generated.js';
export * from './raccoon.js';
export * from './reference.js';
import { CROPS } from './crops.js';import { BUNDLE_ROOMS } from './bundles.js';import { VILLAGERS } from './villagers.js';import { FESTIVALS,QUEEN_OF_SAUCE } from './calendar.js';import { FISH } from './fish.js';import { PROJECTS } from './projects.js';import { CHECKLISTS } from './checklists.js';
export const CATALOG={crops:CROPS,bundles:BUNDLE_ROOMS.flatMap(room=>room.bundles),villagers:VILLAGERS,fish:FISH,calendar:[...FESTIVALS,...QUEEN_OF_SAUCE],projects:PROJECTS,perfection:CHECKLISTS} as const;
export type CatalogDomain=keyof typeof CATALOG;
export function searchCatalog(query:string,domain?:CatalogDomain,includeLateGame=false){const q=query.trim().toLowerCase().replace(/[^a-z0-9\s'-]/g,'');const domains=domain?[domain]:Object.keys(CATALOG) as CatalogDomain[];return domains.flatMap(key=>CATALOG[key].filter(record=>(includeLateGame||record.spoilerTier!=='late-game')&&(!q||`${record.name} ${record.description??''} ${(record.tags??[]).join(' ')}`.toLowerCase().includes(q))).map(record=>({...record,domain:key})))}

export * from './icon-registry.js';
