import { describe,expect,it } from 'vitest';import { BUNDLE_ROOMS,CROPS,QUEEN_OF_SAUCE,PROJECTS,VILLAGERS,adjustedGrowthDays,bundleCompleted } from './index.js';
describe('Stardew 1.6.15 catalog',()=>{
 it('has stable unique ids and source metadata',()=>{const all=[...CROPS,...VILLAGERS,...PROJECTS,...BUNDLE_ROOMS.flatMap(r=>r.bundles)];expect(new Set(all.map(x=>x.id)).size).toBe(all.length);expect(all.every(x=>x.gameVersion==='1.6.15'&&x.source.startsWith('https://'))).toBe(true)});
 it('contains all 32 Queen of Sauce broadcasts',()=>expect(QUEEN_OF_SAUCE).toHaveLength(32));
 it('uses the correct standard fish bundles',()=>expect(BUNDLE_ROOMS.find(r=>r.id==='fish-tank')?.bundles.map(b=>b.id)).toEqual(['river-fish','lake-fish','ocean-fish','night-fishing','crab-pot','specialty-fish']));
 it('supports partial choice bundles',()=>{const artisan=BUNDLE_ROOMS.find(r=>r.id==='pantry')!.bundles.find(b=>b.id==='artisan')!;expect(artisan.required).toBe(6);expect(bundleCompleted(artisan,Object.fromEntries(artisan.items.slice(0,6).map(x=>[x.id,true])))).toBe(true)});
 it('contains 1.6 crops and multi-season crops',()=>{expect(CROPS.map(c=>c.id)).toEqual(expect.arrayContaining(['carrot','summer-squash','broccoli','powdermelon']));expect(CROPS.find(c=>c.id==='corn')?.seasons).toEqual(['Summer','Fall'])});
 it('combines speed boosts and rounds the resulting duration up',()=>{expect(adjustedGrowthDays(12,25,false)).toBe(9);expect(adjustedGrowthDays(12,25,true)).toBe(8)});
 it('corrects known machine recipes and boat prerequisite',()=>{expect(PROJECTS.find(p=>p.id==='seed-maker')?.materials).toEqual({Wood:25,'Gold Bar':1,Coal:10});expect(PROJECTS.find(p=>p.id==='willy-boat')?.prerequisite).toContain('Community Center')});
});
