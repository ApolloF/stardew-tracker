export * from './types.js';
export * from './meta.js';
export { CROPS,FERTILIZERS } from './crops.js';
export { adjustedGrowthDays,lastPlantingDay,harvestCount } from './growth.js';
export * from './bundles.js';
export * from './villagers.js';
export * from './calendar.js';
export * from './fish.js';
export * from './projects.js';
export * from './checklists.js';
import { CROPS } from './crops.js';import { BUNDLE_ROOMS } from './bundles.js';import { VILLAGERS } from './villagers.js';import { FESTIVALS,QUEEN_OF_SAUCE } from './calendar.js';import { FISH } from './fish.js';import { PROJECTS } from './projects.js';import { CHECKLISTS } from './checklists.js';
export const CATALOG={crops:CROPS,bundles:BUNDLE_ROOMS.flatMap(room=>room.bundles),villagers:VILLAGERS,fish:FISH,calendar:[...FESTIVALS,...QUEEN_OF_SAUCE],projects:PROJECTS,perfection:CHECKLISTS} as const;
export type CatalogDomain=keyof typeof CATALOG;
export function searchCatalog(query:string,domain?:CatalogDomain){const q=query.trim().toLowerCase();const domains=domain?[domain]:Object.keys(CATALOG) as CatalogDomain[];return domains.flatMap(key=>CATALOG[key].filter(record=>!q||`${record.name} ${record.description??''} ${(record.tags??[]).join(' ')}`.toLowerCase().includes(q)).map(record=>({...record,domain:key})))}
