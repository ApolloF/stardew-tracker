import type { Season } from './types.js';
export type TrackerDomain='museum'|'shipping'|'cooking'|'crafting'|'fish'|'relationships'|'animals'|'skills'|'stardrops'|'monster-goals'|'walnuts'|'perfection'|'bundles';
export interface TrackerRecord{domain:TrackerDomain;itemId:string;value:Record<string,unknown>}
export interface ImportedFarmhand{sourceId:string;name:string;isHost:boolean;records:TrackerRecord[]}
export interface NormalizedSaveImport{fileHash:string;gameVersion:string;farmName:string;season:Season;day:number;year:number;shared:TrackerRecord[];farmhands:ImportedFarmhand[];warnings:string[]}
export interface PerfectionInput{shipping:[number,number];obelisks:[number,number];clock:[number,number];monsters:[number,number];friendships:[number,number];farmerLevel:[number,number];stardrops:[number,number];cooking:[number,number];crafting:[number,number];fishing:[number,number];walnuts:[number,number];waivers?:number}
export interface PerfectionComponent{id:string;label:string;complete:number;total:number;progress:number;weight:number;weighted:number}
