// @vitest-environment node
import{describe,expect,it}from'vitest';
import{existsSync,readFileSync}from'node:fs';
import{resolve}from'node:path';
import{ANIMAL_ICON_BY_TYPE,EXPECTED_GAME_ICON_PATHS,PROJECTS,VILLAGERS}from'@stardew/game-data';
describe('local icon coverage',()=>{
 it('has every expected game sprite on disk',()=>{const missing=EXPECTED_GAME_ICON_PATHS.filter(path=>!existsSync(resolve(process.cwd(),'public',path.replace(/^\//,''))));expect(missing).toEqual([])});
 it('maps every villager, project, and animal type',()=>{expect(VILLAGERS.every(row=>row.iconPath)).toBe(true);expect(PROJECTS.every(row=>row.iconPath)).toBe(true);expect(Object.keys(ANIMAL_ICON_BY_TYPE).length).toBeGreaterThanOrEqual(19)});
 it('keeps authenticated journal sources free of emoji icons',()=>{const files=['src/pages/JournalPage.tsx','src/pages/ExpandedTrackers.tsx','src/pages/FarmerDiscoveries.tsx','src/components/SaveImportModal.tsx','src/components/Layout.tsx','src/components/ErrorBoundary.tsx','src/App.tsx'];const astral=/[\u{1F300}-\u{1FAFF}]/u;const offenders=files.filter(file=>astral.test(readFileSync(resolve(process.cwd(),file),'utf8')));expect(offenders).toEqual([])});
});