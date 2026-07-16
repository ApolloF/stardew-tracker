// Farm buildings (built by Robin) and key craftable items to track as projects

export const BUILDINGS = [
  { id: 'silo',         name: 'Silo',         emoji: '🏭', category: 'building', description: 'Stores hay for animals',  cost: 100,   materials: 'Stone ×100, Clay ×10, Copper Bar ×5' },
  { id: 'coop',         name: 'Coop',         emoji: '🐔', category: 'building', description: 'Houses chickens & ducks', cost: 4000,  materials: 'Wood ×300, Stone ×100' },
  { id: 'big-coop',     name: 'Big Coop',     emoji: '🐔', category: 'building', description: 'Incubator + more animals', cost: 10000, materials: 'Wood ×400, Stone ×150' },
  { id: 'deluxe-coop',  name: 'Deluxe Coop',  emoji: '🐔', category: 'building', description: 'Auto-feed + rabbits', cost: 20000,  materials: 'Wood ×500, Stone ×200' },
  { id: 'barn',         name: 'Barn',         emoji: '🐄', category: 'building', description: 'Houses cows',           cost: 6000,  materials: 'Wood ×350, Stone ×150' },
  { id: 'big-barn',     name: 'Big Barn',     emoji: '🐄', category: 'building', description: 'Pregnancy + goats',     cost: 12000, materials: 'Wood ×450, Stone ×200' },
  { id: 'deluxe-barn',  name: 'Deluxe Barn',  emoji: '🐄', category: 'building', description: 'Auto-feed + pigs/sheep', cost: 25000, materials: 'Wood ×550, Stone ×300' },
  { id: 'well',         name: 'Well',         emoji: '🪣', category: 'building', description: 'Refills watering can',   cost: 1000,  materials: 'Stone ×75' },
  { id: 'fish-pond',    name: 'Fish Pond',    emoji: '🐟', category: 'building', description: 'Farm fish for roe',     cost: 5000,  materials: 'Stone ×200, Seaweed ×5, Algae ×5' },
  { id: 'mill',         name: 'Mill',         emoji: '⚙️', category: 'building', description: 'Turns wheat into flour', cost: 2500,  materials: 'Stone ×50, Wood ×150, Cloth ×4' },
  { id: 'shed',         name: 'Shed',         emoji: '🏠', category: 'building', description: 'Extra storage space',    cost: 15000, materials: 'Wood ×300' },
  { id: 'slime-hutch',  name: 'Slime Hutch',  emoji: '💚', category: 'building', description: 'Raise slimes for drops', cost: 10000, materials: 'Stone ×500, Refined Quartz ×10, Iridium Bar ×1' },
];

export const CRAFTABLES = [
  { id: 'chest',              name: 'Chest',              emoji: '📦', category: 'storage',    description: 'Essential storage',           materials: 'Wood ×50',                                    maxUseful: null },
  { id: 'furnace',            name: 'Furnace',            emoji: '🔥', category: 'processing', description: 'Smelt ores into bars',         materials: 'Copper Ore ×20, Stone ×25',                   maxUseful: 2 },
  { id: 'bee-house',          name: 'Bee House',          emoji: '🍯', category: 'processing', description: 'Produces honey near flowers',  materials: 'Wood ×40, Coal ×8, Iron Bar ×1, Maple Syrup ×1', maxUseful: null },
  { id: 'keg',                name: 'Keg',                emoji: '🍷', category: 'processing', description: 'Turns fruit/veg into drinks',  materials: 'Wood ×30, Copper Bar ×1, Iron Bar ×1, Oak Resin ×1', maxUseful: null },
  { id: 'preserves-jar',      name: 'Preserves Jar',      emoji: '🫙', category: 'processing', description: 'Makes jelly and pickles',      materials: 'Wood ×50, Stone ×40, Coal ×8',                maxUseful: null },
  { id: 'cheese-press',       name: 'Cheese Press',       emoji: '🧀', category: 'processing', description: 'Turns milk into cheese',       materials: 'Wood ×45, Stone ×45, Copper Bar ×10, Cloth ×1', maxUseful: 2 },
  { id: 'mayonnaise-machine', name: 'Mayonnaise Machine', emoji: '🥚', category: 'processing', description: 'Turns eggs into mayo',        materials: 'Wood ×15, Stone ×15, Copper Bar ×1',          maxUseful: 2 },
  { id: 'loom',               name: 'Loom',               emoji: '🧶', category: 'processing', description: 'Turns wool into cloth',        materials: 'Wood ×60, Fiber ×30, Pine Tar ×1',            maxUseful: 1 },
  { id: 'oil-maker',          name: 'Oil Maker',          emoji: '🫒', category: 'processing', description: 'Presses oil from seeds',       materials: 'Hardwood ×20, Gold Bar ×1, Cloth ×1',         maxUseful: 1 },
  { id: 'seed-maker',         name: 'Seed Maker',         emoji: '🌱', category: 'processing', description: 'Turns crops into seeds',       materials: 'Wood ×25, Coal ×1, Gold Bar ×10',             maxUseful: 1 },
  { id: 'recycling-machine',  name: 'Recycling Machine',  emoji: '♻️', category: 'processing', description: 'Recycles fishing trash',       materials: 'Wood ×99, Stone ×1, Iron Bar ×1',             maxUseful: 1 },
  { id: 'tapper',             name: 'Tapper',             emoji: '🌳', category: 'processing', description: 'Taps trees for sap & syrup',  materials: 'Wood ×40, Copper Bar ×1',                     maxUseful: null },
  { id: 'sprinkler',          name: 'Sprinkler',          emoji: '💧', category: 'farming',    description: 'Waters 4 adjacent tiles',     materials: 'Copper Bar ×1, Iron Bar ×1',                  maxUseful: null },
  { id: 'quality-sprinkler',  name: 'Quality Sprinkler',  emoji: '💦', category: 'farming',    description: 'Waters 8 surrounding tiles',  materials: 'Gold Bar ×1, Iron Bar ×1, Refined Quartz ×1', maxUseful: null },
  { id: 'iridium-sprinkler',  name: 'Iridium Sprinkler',  emoji: '🌊', category: 'farming',    description: 'Waters 24 tiles in a square', materials: 'Gold Bar ×1, Iridium Bar ×1, Battery Pack ×1', maxUseful: null },
  { id: 'lightning-rod',      name: 'Lightning Rod',      emoji: '⚡', category: 'farming',    description: 'Catches lightning → Battery', materials: 'Iron Bar ×1, Refined Quartz ×1, Bat Wing ×5', maxUseful: null },
  { id: 'garden-pot',         name: 'Garden Pot',         emoji: '🪴', category: 'farming',    description: 'Grow crops indoors / off-season', materials: 'Clay ×1, Stone ×10, Refined Quartz ×1',   maxUseful: null },
  { id: 'scarecrow',          name: 'Scarecrow',          emoji: '🎃', category: 'farming',    description: 'Protects crops from crows',   materials: 'Wood ×50, Coal ×1, Fiber ×20',                maxUseful: null },
  { id: 'mini-fridge',        name: 'Mini-Fridge',        emoji: '🧊', category: 'storage',    description: 'Links to kitchen for cooking', materials: 'Iron Bar ×2',                                 maxUseful: null },
  { id: 'crab-pot',           name: 'Crab Pot',           emoji: '🦞', category: 'farming',    description: 'Catches sea creatures passively', materials: 'Wood ×40, Iron Bar ×3',                  maxUseful: null },
];

export const WILLY_BOAT = {
  id: 'willy-boat',
  name: "Willy's Boat",
  emoji: '⛵',
  description: 'Repair Willy\'s boat to reach Ginger Island!',
  hint: 'Ask Willy about his old boat once you\'re friends with him 🎣',
  parts: [
    { id: 'hardwood',     name: 'Hardwood',     emoji: '🌲', qty: 200, hint: 'Chop Large Stumps & Logs — you\'ll need a Gold Axe+' },
    { id: 'battery-pack', name: 'Battery Pack', emoji: '🔋', qty: 5,   hint: 'Lightning Rod + stormy weather, or found in crates' },
    { id: 'iridium-bar',  name: 'Iridium Bar',  emoji: '🟣', qty: 5,   hint: 'Smelt Iridium Ore — found deep in the mines (floor 100+)' },
  ],
};
