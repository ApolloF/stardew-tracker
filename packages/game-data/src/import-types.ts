import type { Season } from './types.js';
export type TrackerDomain='museum'|'shipping'|'cooking'|'crafting'|'fish'|'relationships'|'animals'|'skills'|'stardrops'|'monster-goals'|'walnuts'|'perfection'|'bundles'|'farmer'|'achievements'|'powers'|'notes'|'scraps'|'rarecrows'|'island-upgrades'|'raccoon';
export interface TrackerRecord{domain:TrackerDomain;itemId:string;value:Record<string,unknown>}
export interface ImportedBundleItem{slot:number;gameId:string;name:string;quantity:number;quality:number;iconPath:string}
export interface ImportedBundle{saveId:string;stableKey:string;name:string;reward:string;required:number;items:ImportedBundleItem[]}
export interface ImportedBundleRoom{id:string;name:string;bundles:ImportedBundle[]}
export interface ImportedBundleLayout{route:'community-center'|'joja';kind:'standard'|'remixed'|'randomized'|'empty'|'joja';rooms:ImportedBundleRoom[];jojaProjects?:string[]}
export interface ImportedFarmhand{sourceId:string;name:string;isHost:boolean;records:TrackerRecord[]}
export interface ImportDomainSummary{domain:string;records:number}
export interface NormalizedSaveImport{fileHash:string;gameVersion:string;platform:'PC'|'Mobile';farmName:string;season:Season;day:number;year:number;route:'community-center'|'joja';bundleKind:'standard'|'remixed'|'randomized'|'empty'|'joja';shared:TrackerRecord[];farmhands:ImportedFarmhand[];warnings:string[];summary:ImportDomainSummary[]}
export interface PerfectionInput{shipping:[number,number];obelisks:[number,number];clock:[number,number];monsters:[number,number];friendships:[number,number];farmerLevel:[number,number];stardrops:[number,number];cooking:[number,number];crafting:[number,number];fishing:[number,number];walnuts:[number,number];waivers?:number}
export interface PerfectionComponent{id:string;label:string;complete:number;total:number;progress:number;weight:number;weighted:number}