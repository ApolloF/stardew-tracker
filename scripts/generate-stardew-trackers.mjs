import fs from 'node:fs';
import path from 'node:path';

const upstreamCommit = process.env.STARDEW_APP_COMMIT || 'c916f707740ff7184634b321fb7ad386a6f915e5';
const source = path.resolve(process.argv[2] || process.env.STARDEW_APP_SOURCE || path.join('..', 'stardew.app', 'src', 'data'));
if (!fs.existsSync(source)) throw new Error(`ApolloF data directory not found: ${source}. Pass it as the first argument or set STARDEW_APP_SOURCE.`);
const target = path.resolve('packages/game-data/src/collections.generated.ts');
const read = (name) => JSON.parse(fs.readFileSync(path.join(source, name), 'utf8'));
const objects = read('objects.json');
const big = read('big_craftables.json');
const museum = read('museum.json');
const shipping = read('shipping.json');
const cooking = read('cooking.json');
const crafting = read('crafting.json');
const walnuts = read('walnuts.json');

const item = (id, extra = {}) => {
  const sourceItem = objects[id] || big[id] || {};
  return { id: String(id), name: sourceItem.name || `Item ${id}`, description: sourceItem.description || '', iconPath: `/game-icons/objects/${id}.webp`, ...extra };
};
const museumRows = [
  ...Object.entries(museum.artifacts).map(([id, row]) => item(id, { category: 'artifact', locations: row.locations || [] })),
  ...Object.entries(museum.minerals).map(([id, row]) => item(id, { category: 'mineral', locations: row.locations || [] })),
];
const shippingRows = Object.keys(shipping).map((id) => item(id, { minVersion: shipping[id].minVersion || '1.5.0' }));
const cookingRows = Object.values(cooking).map((row) => item(row.itemID, { unlock: row.unlockConditions || '', ingredients: row.ingredients || [] }));
const craftingRows = Object.values(crafting).map((row) => item(row.itemID, { unlock: row.unlockConditions || '', ingredients: row.ingredients || [], bigCraftable: !!row.isBigCraftable, iconPath: `/game-icons/${row.isBigCraftable ? 'big-craftables' : 'objects'}/${row.itemID}.webp` }));
const walnutRows = Object.entries(walnuts).map(([id, row]) => ({ id, name: row.name, description: row.description || '', count: row.count }));
const serialize = (name, value) => `export const ${name} = ${JSON.stringify(value, null, 2)} as const;\n`;
const output = `// Generated from ApolloF/stardew.app commit ${upstreamCommit}. Run: node scripts/generate-stardew-trackers.mjs <path-to-stardew.app/src/data>\n\n${serialize('MUSEUM_ITEMS', museumRows)}\n${serialize('SHIPPING_ITEMS', shippingRows)}\n${serialize('COOKING_RECIPES', cookingRows)}\n${serialize('CRAFTING_RECIPES', craftingRows)}\n${serialize('WALNUT_SOURCES', walnutRows)}`;
fs.writeFileSync(target, output);
console.log(`Wrote ${target}: ${museumRows.length} museum, ${shippingRows.length} shipping, ${cookingRows.length} cooking, ${craftingRows.length} crafting records.`);
