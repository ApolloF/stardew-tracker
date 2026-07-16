// All Community Center bundles with gentle, spoiler-lite hints.
// Items only need 1 of each unless specified.

export const BUNDLE_ROOMS = [
  {
    id: 'pantry',
    name: 'Pantry',
    emoji: '🏺',
    color: '#c8e6a0',
    description: 'Grown on the farm',
    bundles: [
      {
        id: 'spring-crops',
        name: 'Spring Crops',
        reward: 'Spring Seeds bag',
        items: [
          { id: 'parsnip',    name: 'Parsnip',    emoji: '🥕', hint: 'Fastest spring crop — grow it on your farm!' },
          { id: 'green-bean', name: 'Green Bean',  emoji: '🫘', hint: 'A spring trellis crop that regrows' },
          { id: 'cauliflower',name: 'Cauliflower', emoji: '🥦', hint: 'Takes a while — plant early in spring' },
          { id: 'potato',     name: 'Potato',      emoji: '🥔', hint: 'Sometimes gives an extra harvest!' },
        ],
      },
      {
        id: 'summer-crops',
        name: 'Summer Crops',
        reward: 'Summer Seeds bag',
        items: [
          { id: 'tomato',     name: 'Tomato',     emoji: '🍅', hint: 'Buy seeds from Pierre in summer' },
          { id: 'hot-pepper', name: 'Hot Pepper',  emoji: '🌶️', hint: 'Quick to grow in summer heat' },
          { id: 'blueberry',  name: 'Blueberry',   emoji: '🫐', hint: 'Keeps producing all season!' },
          { id: 'melon',      name: 'Melon',        emoji: '🍈', hint: 'The grand prize of summer farming' },
        ],
      },
      {
        id: 'fall-crops',
        name: 'Fall Crops',
        reward: 'Fall Seeds bag',
        items: [
          { id: 'corn',     name: 'Corn',      emoji: '🌽', hint: 'Also grows in summer!' },
          { id: 'eggplant', name: 'Eggplant',  emoji: '🍆', hint: 'Fall trellis crop that regrows' },
          { id: 'pumpkin',  name: 'Pumpkin',   emoji: '🎃', hint: 'High value fall crop' },
          { id: 'yam',      name: 'Yam',       emoji: '🍠', hint: 'Earthy fall staple' },
        ],
      },
      {
        id: 'quality-crops',
        name: 'Quality Crops',
        reward: 'Bee House',
        items: [
          { id: 'gold-parsnip',  name: 'Gold Parsnip ×5',  emoji: '⭐', hint: 'Grow lots of parsnips — quality improves as your farming skill grows' },
          { id: 'gold-melon',    name: 'Gold Melon ×5',    emoji: '⭐', hint: 'Grow many melons in summer with better soil' },
          { id: 'gold-pumpkin',  name: 'Gold Pumpkin ×5',  emoji: '⭐', hint: 'Plant many pumpkins in fall' },
          { id: 'gold-corn',     name: 'Gold Corn ×5',     emoji: '⭐', hint: 'Plant lots of corn across summer and fall' },
        ],
      },
      {
        id: 'animal',
        name: 'Animal Products',
        reward: 'Resources for building',
        items: [
          { id: 'large-milk',      name: 'Large Milk',       emoji: '🥛', hint: 'From a very happy cow' },
          { id: 'large-egg',       name: 'Large Egg',        emoji: '🥚', hint: 'From a very happy chicken' },
          { id: 'large-goat-milk', name: 'Large Goat Milk',  emoji: '🐐', hint: 'From a very happy goat' },
          { id: 'wool',            name: 'Wool',              emoji: '🧶', hint: 'Shear a happy sheep' },
          { id: 'duck-egg',        name: 'Duck Egg',          emoji: '🦆', hint: 'From a happy duck' },
        ],
      },
      {
        id: 'artisan',
        name: 'Artisan Goods',
        reward: 'Keg',
        items: [
          { id: 'truffle-oil',  name: 'Truffle Oil',  emoji: '🍄', hint: 'Process a truffle in an Oil Maker' },
          { id: 'cloth',        name: 'Cloth',         emoji: '🧵', hint: 'Spin wool in a Loom' },
          { id: 'goat-cheese',  name: 'Goat Cheese',  emoji: '🧀', hint: 'Process goat milk in a Cheese Press' },
          { id: 'cheese',       name: 'Cheese',        emoji: '🧀', hint: 'Process milk in a Cheese Press' },
          { id: 'honey',        name: 'Honey',         emoji: '🍯', hint: 'Place a Bee House near flowers' },
          { id: 'jelly',        name: 'Jelly',         emoji: '🫙', hint: 'Put any fruit in a Preserves Jar' },
          { id: 'apple',        name: 'Apple',         emoji: '🍎', hint: 'Harvest from an Apple tree in fall' },
          { id: 'apricot',      name: 'Apricot',       emoji: '🍑', hint: 'Plant an Apricot tree — fruit in spring!' },
          { id: 'orange',       name: 'Orange',        emoji: '🍊', hint: 'Harvest from an Orange tree in summer' },
          { id: 'peach',        name: 'Peach',         emoji: '🍑', hint: 'Harvest from a Peach tree in summer' },
          { id: 'pomegranate',  name: 'Pomegranate',   emoji: '🍎', hint: 'Harvest from a Pomegranate tree in fall' },
          { id: 'cherry',       name: 'Cherry',        emoji: '🍒', hint: 'Plant a Cherry tree — fruit in spring!' },
        ],
      },
    ],
  },
  {
    id: 'crafts-room',
    name: 'Crafts Room',
    emoji: '🌿',
    color: '#b8ddb8',
    description: 'Gifts from forests and fields',
    bundles: [
      {
        id: 'spring-foraging',
        name: 'Spring Foraging',
        reward: 'Spring Seeds',
        items: [
          { id: 'daffodil',         name: 'Daffodil',          emoji: '🌼', hint: 'Forage in spring — check roadsides and forests' },
          { id: 'leek',             name: 'Leek',               emoji: '🌱', hint: 'Forage in spring' },
          { id: 'dandelion',        name: 'Dandelion',          emoji: '🌻', hint: 'Forage in spring' },
          { id: 'wild-horseradish', name: 'Wild Horseradish',   emoji: '🌿', hint: 'Forage in spring' },
        ],
      },
      {
        id: 'summer-foraging',
        name: 'Summer Foraging',
        reward: 'Summer Seeds',
        items: [
          { id: 'grape',          name: 'Grape',           emoji: '🍇', hint: 'Forage in summer' },
          { id: 'spice-berry',    name: 'Spice Berry',     emoji: '🫐', hint: 'Forage in summer' },
          { id: 'fiddlehead',     name: 'Fiddlehead Fern', emoji: '🌿', hint: 'Forage in the forest in summer' },
          { id: 'sweet-pea',      name: 'Sweet Pea',       emoji: '🌸', hint: 'Forage in summer' },
        ],
      },
      {
        id: 'fall-foraging',
        name: 'Fall Foraging',
        reward: 'Fall Seeds',
        items: [
          { id: 'chanterelle',    name: 'Chanterelle',    emoji: '🍄', hint: 'A mushroom found in fall' },
          { id: 'common-mush',    name: 'Common Mushroom',emoji: '🍄', hint: 'Forage in fall' },
          { id: 'wild-plum',      name: 'Wild Plum',      emoji: '🍑', hint: 'Forage in fall' },
          { id: 'hazelnut',       name: 'Hazelnut',       emoji: '🌰', hint: 'Forage in fall' },
          { id: 'blackberry',     name: 'Blackberry',     emoji: '🍇', hint: 'Forage in fall during blackberry season' },
          { id: 'nautilus-shell', name: 'Nautilus Shell', emoji: '🐚', hint: 'Beach foraging in winter' },
        ],
      },
      {
        id: 'winter-foraging',
        name: 'Winter Foraging',
        reward: 'Winter Seeds',
        items: [
          { id: 'winter-root',    name: 'Winter Root',    emoji: '🌱', hint: 'Dig in winter — use your hoe!' },
          { id: 'crystal-fruit',  name: 'Crystal Fruit',  emoji: '💎', hint: 'Forage in winter' },
          { id: 'snow-yam',       name: 'Snow Yam',       emoji: '🍠', hint: 'Dig in winter' },
          { id: 'crocus',         name: 'Crocus',         emoji: '🌸', hint: 'Forage in winter' },
          { id: 'holly',          name: 'Holly',          emoji: '🍃', hint: 'Forage in winter' },
          { id: 'nautilus-fossil',name: 'Nautilus Fossil',emoji: '🐚', hint: 'Dig around or donate to the museum' },
        ],
      },
      {
        id: 'construction',
        name: 'Construction',
        reward: 'Charcoal Kiln',
        items: [
          { id: 'wood',     name: 'Wood ×99',     emoji: '🪵', hint: 'Chop trees on your farm or in the forest' },
          { id: 'stone',    name: 'Stone ×99',    emoji: '🪨', hint: 'Mine rocks on your farm or down in the mines' },
          { id: 'hardwood', name: 'Hardwood ×10', emoji: '🌳', hint: 'Chop large stumps — you\'ll need a better axe' },
        ],
      },
      {
        id: 'exotic-foraging',
        name: 'Exotic Foraging',
        reward: 'Recipe + items',
        items: [
          { id: 'coconut',      name: 'Coconut',        emoji: '🥥', hint: 'Found in a hot, faraway desert' },
          { id: 'cactus-fruit', name: 'Cactus Fruit',   emoji: '🌵', hint: 'Found in that same faraway desert' },
          { id: 'cave-carrot',  name: 'Cave Carrot',    emoji: '🥕', hint: 'Dig in the mines with your hoe!' },
          { id: 'red-mush',     name: 'Red Mushroom',   emoji: '🍄', hint: 'Found in caves or the secret forest' },
          { id: 'purple-mush',  name: 'Purple Mushroom',emoji: '🍄', hint: 'Found deeper in the mines' },
          { id: 'maple-syrup',  name: 'Maple Syrup',    emoji: '🍁', hint: 'Tap a maple tree with a Tapper' },
          { id: 'oak-resin',    name: 'Oak Resin',      emoji: '🌳', hint: 'Tap an oak tree with a Tapper' },
          { id: 'pine-tar',     name: 'Pine Tar',       emoji: '🌲', hint: 'Tap a pine tree with a Tapper' },
          { id: 'morel',        name: 'Morel',          emoji: '🍄', hint: 'A rare mushroom — forage in the summer forest' },
        ],
      },
    ],
  },
  {
    id: 'fish-tank',
    name: 'Fish Tank',
    emoji: '🐟',
    color: '#b8d8e8',
    description: 'Caught from rivers, lakes & ocean',
    bundles: [
      {
        id: 'spring-fish',
        name: 'Spring Fish',
        reward: 'Glittering Boulder removed',
        items: [
          { id: 'catfish',  name: 'Catfish',  emoji: '🐟', hint: 'River on a rainy spring day' },
          { id: 'shad',     name: 'Shad',     emoji: '🐟', hint: 'River on rainy spring or summer days' },
          { id: 'sardine',  name: 'Sardine',  emoji: '🐟', hint: 'Ocean in spring or fall' },
          { id: 'eel',      name: 'Eel',      emoji: '🐍', hint: 'Ocean on rainy spring evenings' },
        ],
      },
      {
        id: 'summer-fish',
        name: 'Summer Fish',
        reward: 'Fish resources',
        items: [
          { id: 'pufferfish',  name: 'Pufferfish',  emoji: '🐡', hint: 'Ocean on a sunny summer afternoon' },
          { id: 'tuna',        name: 'Tuna',         emoji: '🐟', hint: 'Ocean in summer and winter' },
          { id: 'red-snapper', name: 'Red Snapper',  emoji: '🐟', hint: 'Ocean on rainy days' },
          { id: 'tilapia',     name: 'Tilapia',      emoji: '🐟', hint: 'Ocean or river in summer' },
        ],
      },
      {
        id: 'fall-fish',
        name: 'Fall Fish',
        reward: 'Fish resources',
        items: [
          { id: 'tiger-trout', name: 'Tiger Trout',  emoji: '🐟', hint: 'A rare river catch in fall and winter' },
          { id: 'salmon',      name: 'Salmon',        emoji: '🐟', hint: 'River in fall' },
          { id: 'walleye',     name: 'Walleye',       emoji: '🐟', hint: 'River on rainy fall evenings' },
          { id: 'albacore',    name: 'Albacore',      emoji: '🐟', hint: 'Ocean in fall or winter' },
        ],
      },
      {
        id: 'winter-fish',
        name: 'Winter Fish',
        reward: 'Fish resources',
        items: [
          { id: 'squid',        name: 'Squid',        emoji: '🦑', hint: 'Ocean on winter nights' },
          { id: 'midnight-carp',name: 'Midnight Carp', emoji: '🐟', hint: 'River or lake at night in winter' },
          { id: 'lingcod',      name: 'Lingcod',      emoji: '🐟', hint: 'River in winter' },
          { id: 'sandfish',     name: 'Sandfish',     emoji: '🐟', hint: 'Far-away desert location' },
        ],
      },
      {
        id: 'crab-pot',
        name: 'Crab Pot',
        reward: 'Crab Pot ×3',
        items: [
          { id: 'lobster',    name: 'Lobster',    emoji: '🦞', hint: 'Ocean crab pot' },
          { id: 'crayfish',   name: 'Crayfish',   emoji: '🦞', hint: 'Freshwater crab pot' },
          { id: 'crab',       name: 'Crab',       emoji: '🦀', hint: 'Ocean crab pot' },
          { id: 'cockle',     name: 'Cockle',     emoji: '🐚', hint: 'Ocean crab pot' },
          { id: 'mussel',     name: 'Mussel',     emoji: '🐚', hint: 'Ocean crab pot or beach foraging' },
          { id: 'shrimp',     name: 'Shrimp',     emoji: '🦐', hint: 'Ocean crab pot' },
          { id: 'snail',      name: 'Snail',      emoji: '🐌', hint: 'Freshwater crab pot' },
          { id: 'periwinkle', name: 'Periwinkle', emoji: '🐚', hint: 'Freshwater crab pot' },
          { id: 'oyster',     name: 'Oyster',     emoji: '🦪', hint: 'Ocean crab pot or beach foraging' },
          { id: 'clam',       name: 'Clam',       emoji: '🐚', hint: 'Beach foraging' },
        ],
      },
      {
        id: 'specialty-fish',
        name: 'Specialty Fish',
        reward: 'Diver\'s reward',
        items: [
          { id: 'puffer-s',   name: 'Pufferfish', emoji: '🐡', hint: 'Ocean, sunny summer afternoon' },
          { id: 'ghostfish',  name: 'Ghostfish',  emoji: '👻', hint: 'Found inside the mines — bring a rod!' },
          { id: 'sandfish-s', name: 'Sandfish',   emoji: '🐟', hint: 'Far-away desert location' },
          { id: 'woodskip',   name: 'Woodskip',   emoji: '🐟', hint: 'A secretive forest location' },
        ],
      },
    ],
  },
  {
    id: 'boiler-room',
    name: 'Boiler Room',
    emoji: '⚒️',
    color: '#e8c8a0',
    description: 'Treasures from the mines',
    bundles: [
      {
        id: 'blacksmith',
        name: 'Blacksmith',
        reward: 'Furnace',
        items: [
          { id: 'copper-bar', name: 'Copper Bar', emoji: '🟫', hint: 'Smelt copper ore in a furnace — found in upper mines' },
          { id: 'iron-bar',   name: 'Iron Bar',   emoji: '⬜', hint: 'Smelt iron ore — found in mid-level mines' },
          { id: 'gold-bar',   name: 'Gold Bar',   emoji: '🟡', hint: 'Smelt gold ore — found deeper in the mines' },
        ],
      },
      {
        id: 'geologist',
        name: "Geologist",
        reward: 'Omni Geodes ×12',
        items: [
          { id: 'quartz',       name: 'Quartz',       emoji: '💎', hint: 'Found in the upper mines' },
          { id: 'earth-crystal',name: 'Earth Crystal', emoji: '🔵', hint: 'Found in the upper mines' },
          { id: 'frozen-tear',  name: 'Frozen Tear',  emoji: '🩵', hint: 'Found in the mid mines' },
          { id: 'fire-quartz',  name: 'Fire Quartz',  emoji: '🔴', hint: 'Found deep in the mines' },
        ],
      },
      {
        id: 'adventurer',
        name: "Adventurer",
        reward: 'Small Bombs ×10',
        items: [
          { id: 'slime',        name: 'Slime ×99',     emoji: '💚', hint: 'Defeat slimes in the mines' },
          { id: 'bat-wing',     name: 'Bat Wing ×10',  emoji: '🦇', hint: 'Defeat bats in the mines' },
          { id: 'solar-essence',name: 'Solar Essence', emoji: '☀️', hint: 'From fiery creatures deep in the mines' },
          { id: 'void-essence', name: 'Void Essence',  emoji: '🌑', hint: 'From shadow creatures in the mines' },
        ],
      },
    ],
  },
  {
    id: 'bulletin-board',
    name: 'Bulletin Board',
    emoji: '📋',
    color: '#f0d8b0',
    description: 'Community requests & gifts',
    bundles: [
      {
        id: 'chef',
        name: "Chef's Bundle",
        reward: 'Pumpkin Soup recipe',
        items: [
          { id: 'maple-syrup-c', name: 'Maple Syrup',    emoji: '🍁', hint: 'Tap a maple tree' },
          { id: 'fiddlehead-c',  name: 'Fiddlehead Fern',emoji: '🌿', hint: 'Summer forest foraging' },
          { id: 'truffle-c',     name: 'Truffle',         emoji: '🍄', hint: 'From a happy pig' },
          { id: 'poppy',         name: 'Poppy',           emoji: '🌺', hint: 'Grow this flower in summer' },
          { id: 'maki-roll',     name: 'Maki Roll',       emoji: '🍱', hint: 'Cook it — check your recipes!' },
          { id: 'fried-egg',     name: 'Fried Egg',       emoji: '🍳', hint: 'Cook it — very simple recipe!' },
        ],
      },
      {
        id: 'dye',
        name: 'Dye Bundle',
        reward: 'Seed Maker',
        items: [
          { id: 'red-mush-d',   name: 'Red Mushroom',  emoji: '🍄', hint: 'Found in caves or secret forest' },
          { id: 'sea-urchin',   name: 'Sea Urchin',    emoji: '🦔', hint: 'Beach foraging in summer' },
          { id: 'sunflower',    name: 'Sunflower',     emoji: '🌻', hint: 'Grow in summer or fall' },
          { id: 'duck-feather', name: 'Duck Feather',  emoji: '🦆', hint: 'From a very happy duck' },
          { id: 'aquamarine',   name: 'Aquamarine',    emoji: '💎', hint: 'Found in the mines or from geodes' },
          { id: 'red-cabbage',  name: 'Red Cabbage',   emoji: '🥬', hint: 'Grow in summer — usually available year 2+' },
        ],
      },
      {
        id: 'field-research',
        name: 'Field Research',
        reward: 'Recycling Machine',
        items: [
          { id: 'purple-mush-f', name: 'Purple Mushroom', emoji: '🍄', hint: 'Found deeper in the mines' },
          { id: 'nautilus-f',    name: 'Nautilus Shell',  emoji: '🐚', hint: 'Beach foraging in winter' },
          { id: 'chub',          name: 'Chub',             emoji: '🐟', hint: 'River or forest pond, all seasons' },
          { id: 'frozen-geode',  name: 'Frozen Geode',    emoji: '💠', hint: 'Mined in the mid-level mines' },
        ],
      },
      {
        id: 'fodder',
        name: 'Fodder Bundle',
        reward: 'Heater (for animals)',
        items: [
          { id: 'wheat',    name: 'Wheat ×10', emoji: '🌾', hint: 'Grow in summer or fall' },
          { id: 'hay',      name: 'Hay ×10',   emoji: '🌿', hint: 'Cut grass or buy from Marnie' },
          { id: 'apple-f',  name: 'Apple',     emoji: '🍎', hint: 'Harvest from an apple tree in fall' },
        ],
      },
      {
        id: 'enchanter',
        name: "Enchanter's Bundle",
        reward: 'Junimo Hut',
        items: [
          { id: 'oak-resin-e',  name: 'Oak Resin',    emoji: '🌳', hint: 'Tap an oak tree' },
          { id: 'wine',         name: 'Wine',          emoji: '🍷', hint: 'Put any fruit in a Keg' },
          { id: 'rabbit-foot',  name: "Rabbit's Foot", emoji: '🐰', hint: 'From a very happy rabbit' },
          { id: 'pomegranate-e',name: 'Pomegranate',  emoji: '🍎', hint: 'Pomegranate tree — harvests in fall' },
        ],
      },
    ],
  },
  {
    id: 'vault',
    name: 'Vault',
    emoji: '💰',
    color: '#f5e0a0',
    description: 'Gold donations to restore the valley',
    bundles: [
      {
        id: 'vault-2500',
        name: '2,500g Bundle',
        reward: 'Bridge repaired',
        items: [{ id: 'gold-2500', name: '2,500g', emoji: '💰', hint: 'Sell your crops and forageables!' }],
      },
      {
        id: 'vault-5000',
        name: '5,000g Bundle',
        reward: 'Minecarts repaired',
        items: [{ id: 'gold-5000', name: '5,000g', emoji: '💰', hint: 'Keep farming and selling!' }],
      },
      {
        id: 'vault-10000',
        name: '10,000g Bundle',
        reward: 'Bus stop resource',
        items: [{ id: 'gold-10000', name: '10,000g', emoji: '💰', hint: 'You\'re a savvy farmer!' }],
      },
      {
        id: 'vault-25000',
        name: '25,000g Bundle',
        reward: 'Something wonderful ✨',
        items: [{ id: 'gold-25000', name: '25,000g', emoji: '💰', hint: 'The big one — unlocks something great!' }],
      },
    ],
  },
];

// Helper: count total items and completed items across all bundles
export function getBundleStats(progressBundles) {
  let total = 0, done = 0;
  for (const room of BUNDLE_ROOMS) {
    for (const bundle of room.bundles) {
      for (const item of bundle.items) {
        total++;
        if (progressBundles?.[bundle.id]?.[item.id]) done++;
      }
    }
  }
  return { total, done };
}

export function getRoomStats(room, progressBundles) {
  let total = 0, done = 0;
  for (const bundle of room.bundles) {
    for (const item of bundle.items) {
      total++;
      if (progressBundles?.[bundle.id]?.[item.id]) done++;
    }
  }
  return { total, done };
}
