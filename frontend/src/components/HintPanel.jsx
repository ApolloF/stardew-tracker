import { BUNDLE_ROOMS } from '../data/bundles';
import { isTravelingCartDay, daysUntilCart, isSunday, daysUntilSunday, getThisSundayRecipe } from '../data/tv';
import { getUpcomingBirthdays } from '../data/npcs';

function TimeLeft({ days }) {
  if (days === null || days === undefined) return null;
  if (days === 0) return <span className="time-badge time-now">⚡ Today!</span>;
  if (days === 1) return <span className="time-badge time-urgent">⏰ 1 day left</span>;
  if (days <= 4) return <span className="time-badge time-soon">{days} days left</span>;
  return <span className="time-badge time-ok">{days} days left</span>;
}

function generateHints(progress) {
  const { season, year = 1, day, bundles: pb = {} } = progress;
  const hints = [];

  if (season === 'Spring') {
    if (day <= 3) {
      hints.push({ id: 'clear-farm', priority: 0, emoji: '🪓', category: 'Farm', title: 'Clear your farm!', body: "Chop wood, clear rocks and debris to make room for crops. Save the wood and stone — you'll need them later!", daysLeft: null });
      hints.push({ id: 'first-crops', priority: 0, emoji: '🥕', category: 'Farm', title: 'Plant Parsnips today!', body: "Head to Pierre's shop and grab Parsnip Seeds (20g each). They're ready in just 4 days — great for early cash!", daysLeft: null });
    }
    const springForagingBundle = BUNDLE_ROOMS.find(r => r.id === 'crafts-room')?.bundles.find(b => b.id === 'spring-foraging');
    const foragingLeft = (springForagingBundle?.items || []).filter(i => !pb['spring-foraging']?.[i.id]);
    if (foragingLeft.length > 0) {
      hints.push({ id: 'spring-forage', priority: 1, emoji: '🌿', category: 'Community Center', title: `Forage while exploring! (${foragingLeft.length} left)`, body: `Watch for: ${foragingLeft.map(i => i.name).join(', ')}. They grow wild on roadsides and in the forest.`, daysLeft: 28 - day });
    }
    if (day <= 16 && !pb['spring-crops']?.['cauliflower']) {
      hints.push({ id: 'cauli-deadline', priority: day >= 12 ? 0 : 1, emoji: '🥦', category: 'Farm', title: day >= 12 ? '⚠️ Last chance for Cauliflower!' : 'Plant Cauliflower!', body: 'Cauliflower takes 12 days and is needed for a bundle. Last day to plant: Spring 16.', daysLeft: 16 - day });
    }
    if (day <= 18 && !pb['spring-crops']?.['green-bean']) {
      hints.push({ id: 'green-bean', priority: 1, emoji: '🫘', category: 'Community Center', title: 'Plant Green Beans soon!', body: 'Needed for a bundle — takes 10 days and needs a trellis. Plant before Spring 18!', daysLeft: 18 - day });
    }
    if (day >= 10 && day < 13) {
      hints.push({ id: 'egg-festival', priority: 0, emoji: '🥚', category: 'Event', title: day === 12 ? '🎉 Egg Festival TOMORROW!' : 'Egg Festival coming up (Spring 13)', body: 'Save your gold! Buy as many Strawberry Seeds as you can at the festival — plant them immediately after.', daysLeft: 13 - day });
    }
    if (day === 13) {
      hints.push({ id: 'egg-festival-today', priority: 0, emoji: '🥚', category: 'Event', title: '🎉 Egg Festival TODAY!', body: 'Head to town square! Buy lots of Strawberry Seeds before you leave.', daysLeft: 0 });
    }
    if (day >= 21 && day < 24) {
      hints.push({ id: 'flower-dance', priority: 1, emoji: '💃', category: 'Event', title: 'Flower Dance coming up (Spring 24)', body: 'Head to the forest early that day to attend the festival!', daysLeft: 24 - day });
    }
    if (day >= 5 && day <= 15) {
      hints.push({ id: 'visit-mines', priority: 2, emoji: '⛏️', category: 'Adventure', title: 'Head to the Mines!', body: "Find ores, crystals, and cave carrots. Mine north of town. You'll need metal bars for bundles!", daysLeft: null });
    }
    if (day >= 2 && day <= 10) {
      hints.push({ id: 'crafting-basics', priority: 2, emoji: '🔨', category: 'Farm', title: 'Craft some Chests for storage!', body: 'Open your crafting menu. A Chest costs 50 Wood. Place it on your farm to store foraged items and minerals.', daysLeft: null });
    }
    if (day <= 6) {
      hints.push({ id: 'meet-villagers', priority: 2, emoji: '💬', category: 'Social', title: 'Meet everyone in the valley!', body: 'Say hi to every villager. Building friendships unlocks recipes and helpful items!', daysLeft: null });
    }
    if (day >= 4 && day <= 10) {
      hints.push({ id: 'visit-cc', priority: 2, emoji: '🏛️', category: 'Community Center', title: 'Visit the Community Center!', body: 'Walk north through town. Drop off any items you collect to start restoring it!', daysLeft: null });
    }
    if (day >= 3 && day <= 8) {
      hints.push({ id: 'fishing', priority: 3, emoji: '🎣', category: 'Adventure', title: "Get a Fishing Rod from Willy!", body: "Visit Willy's shop near the beach. Fishing earns good money early and fills bundle items!", daysLeft: null });
    }
    if (day >= 5 && day <= 12) {
      hints.push({ id: 'build-silo', priority: 2, emoji: '🏭', category: 'Farm', title: 'Build a Silo early!', body: "Ask Robin to build a Silo (100g + materials). You'll need it to store hay for animals later.", daysLeft: null });
    }
    if (day >= 24) {
      hints.push({ id: 'late-spring', priority: 0, emoji: '⏳', category: 'Farm', title: 'Spring ends soon! Harvest everything.', body: "Crops don't survive the season change. Harvest, sell, and plan for Summer!", daysLeft: 28 - day });
    }
  }

  if (season === 'Summer') {
    if (day <= 4) hints.push({ id: 'summer-start', priority: 0, emoji: '☀️', category: 'Farm', title: "Summer is here! Head to Pierre's.", body: "Blueberries keep producing all season and are excellent value!", daysLeft: null });
    if (!pb['summer-crops']?.['melon'] && day <= 16) hints.push({ id: 'melon-bundle', priority: 1, emoji: '🍈', category: 'Community Center', title: 'Grow Melons for a bundle!', body: 'Melons take 12 days and are needed for the Summer Crops bundle.', daysLeft: 16 - day });
    if (day >= 8 && day <= 22) hints.push({ id: 'summer-fish', priority: 2, emoji: '🐡', category: 'Adventure', title: 'Catch a Pufferfish on a sunny afternoon!', body: 'Needed for a bundle — ocean, sunny summer afternoon.', daysLeft: 28 - day });
    if (day >= 24) hints.push({ id: 'late-summer', priority: 0, emoji: '⏳', category: 'Farm', title: 'Summer ending! Harvest everything.', body: "Crops die at season end. Harvest, sell or store, and plan your Fall crops!", daysLeft: 28 - day });
  }

  if (season === 'Fall') {
    if (day <= 4) hints.push({ id: 'fall-start', priority: 0, emoji: '🍂', category: 'Farm', title: 'Fall is here!', body: "Head to Pierre's for Pumpkins, Cranberries, and Grapes. Cranberries regrow every 5 days!", daysLeft: null });
    if (day >= 24) hints.push({ id: 'late-fall', priority: 0, emoji: '⏳', category: 'Farm', title: 'Fall ending! Last chance to harvest.', body: "Harvest everything before the season ends. Winter is coming — nothing grows in the ground!", daysLeft: 28 - day });
  }

  if (season === 'Winter') {
    hints.push({ id: 'winter-dig', priority: 1, emoji: '🌱', category: 'Community Center', title: 'Dig for Winter forageables!', body: 'Use your hoe on the ground in winter to find Winter Root, Snow Yam, and Crocus for bundles!', daysLeft: 28 - day });
    hints.push({ id: 'winter-upgrade', priority: 1, emoji: '⚒️', category: 'Farm', title: 'Upgrade your tools this winter!', body: "Take your tools to Clint to upgrade them. No crops to water = perfect time for upgrades!", daysLeft: null });
    hints.push({ id: 'winter-socialize', priority: 2, emoji: '💬', category: 'Social', title: 'Socialize and give gifts!', body: "Winter is great for building friendships. Visit everyone with gifts twice a week!", daysLeft: null });
  }

  // Traveling Cart
  const cartIn = daysUntilCart(day);
  if (cartIn !== null) {
    const cartToday = isTravelingCartDay(day);
    hints.push({ id: 'traveling-cart', priority: cartToday ? 1 : 3, emoji: '🛒', category: 'Shopping', title: cartToday ? '🛒 Traveling Cart is here TODAY!' : `Traveling Cart: ${cartIn === 0 ? 'today' : cartIn === 1 ? 'tomorrow' : `in ${cartIn} days`}`, body: 'Rare seeds and items! Check it every Friday and Sunday, south of the farm.', daysLeft: cartIn });
  }

  // Queen of Sauce
  const sundayIn = daysUntilSunday(day);
  if (sundayIn !== null) {
    const todayIsSunday = isSunday(day);
    const recipe = getThisSundayRecipe(season, day, year);
    hints.push({ id: 'queen-of-sauce', priority: todayIsSunday ? 1 : 3, emoji: '📺', category: 'TV', title: todayIsSunday ? '📺 Queen of Sauce is on TODAY!' : `Queen of Sauce: ${sundayIn === 1 ? 'tomorrow' : `in ${sundayIn} days`}`, body: `This week's recipe: ${recipe}. Watch before 9pm on Sunday!`, daysLeft: sundayIn });
  }

  // Birthdays in next 3 days
  const upcomingBdays = getUpcomingBirthdays(season, day, year).filter(n => n.daysAway > 0 && n.daysAway <= 3);
  upcomingBdays.forEach(n => {
    hints.push({ id: `bday-${n.id}`, priority: n.daysAway <= 1 ? 0 : 1, emoji: '🎂', category: 'Social', title: `${n.name}'s Birthday in ${n.daysAway} day${n.daysAway === 1 ? '' : 's'}!`, body: `They love: ${n.loves.slice(0, 3).join(', ')}. Give a gift on their birthday for max hearts!`, daysLeft: n.daysAway });
  });

  hints.sort((a, b) => a.priority - b.priority);
  return hints;
}

const CATEGORY_COLOR = { Farm: '#5a8a3e', 'Community Center': '#7060c0', Event: '#c05080', Adventure: '#c07030', Social: '#4080a0', Shopping: '#a06020', TV: '#6050b0' };

export default function HintPanel({ progress }) {
  const hints = generateHints(progress);
  if (hints.length === 0) return <div className="hint-panel empty"><p>🌟 All caught up! Enjoy your day on the farm.</p></div>;

  return (
    <div className="hint-panel">
      <p className="hint-intro">Here's what to focus on right now 👇</p>
      <div className="hints-grid">
        {hints.map(h => (
          <div key={h.id} className={`hint-card priority-${h.priority}`}>
            <div className="hint-header">
              <span className="hint-emoji">{h.emoji}</span>
              <span className="hint-category" style={{ background: (CATEGORY_COLOR[h.category] || '#888') + '22', color: CATEGORY_COLOR[h.category] || '#888' }}>
                {h.category}
              </span>
              <TimeLeft days={h.daysLeft} />
            </div>
            <h3 className="hint-title">{h.title}</h3>
            <p className="hint-body">{h.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
