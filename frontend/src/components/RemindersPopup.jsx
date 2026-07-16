import { useEffect, useState } from 'react';
import { getUpcomingBirthdays } from '../data/npcs';
import { isSunday, isTravelingCartDay, getThisSundayRecipe } from '../data/tv';

function buildReminders(progress) {
  const { season, day, year = 1 } = progress;
  const reminders = [];

  // Birthday today
  const birthdays = getUpcomingBirthdays(season, day, year);
  const todayBirthdays = birthdays.filter(n => n.daysAway === 0);
  const tomorrowBirthdays = birthdays.filter(n => n.daysAway === 1);

  todayBirthdays.forEach(n => {
    reminders.push({
      id: `bday-today-${n.id}`,
      emoji: '🎂',
      title: `${n.name}'s Birthday TODAY!`,
      body: `Don't forget a gift! They love: ${n.loves.slice(0, 2).join(', ')}`,
      priority: 0,
      color: '#c05080',
    });
  });
  tomorrowBirthdays.forEach(n => {
    reminders.push({
      id: `bday-tomorrow-${n.id}`,
      emoji: '🎁',
      title: `${n.name}'s Birthday tomorrow`,
      body: `Prepare a gift! They love: ${n.loves.slice(0, 2).join(', ')}`,
      priority: 1,
      color: '#d07090',
    });
  });

  // Queen of Sauce
  if (isSunday(day)) {
    const recipe = getThisSundayRecipe(season, day, year);
    reminders.push({
      id: 'qos-today',
      emoji: '📺',
      title: "Queen of Sauce is on today!",
      body: `Today's recipe: ${recipe}. Turn on your TV before 9pm!`,
      priority: 1,
      color: '#7060c0',
    });
  }

  // Traveling Cart
  if (isTravelingCartDay(day)) {
    reminders.push({
      id: 'cart-today',
      emoji: '🛒',
      title: 'Traveling Cart is here today!',
      body: 'Visit the cart south of the farm. Check for rare seeds and items!',
      priority: 1,
      color: '#a06020',
    });
  }

  // Season ending
  if (day >= 26) {
    reminders.push({
      id: 'season-end',
      emoji: '⏳',
      title: `${season} ends in ${28 - day} day${28 - day === 1 ? '' : 's'}!`,
      body: `Harvest everything — crops don't survive the season change! Sell or store them.`,
      priority: 0,
      color: '#c03030',
    });
  }

  // Bundle nudge if in Spring Y1
  if (season === 'Spring' && day <= 16) {
    reminders.push({
      id: 'bundle-nudge',
      emoji: '🏛️',
      title: 'Community Center reminder',
      body: 'Spring forage items are out there! Check the Crafts Room bundles.',
      priority: 2,
      color: '#5a8a3e',
    });
  }

  // Egg Festival
  if (season === 'Spring' && day === 12) {
    reminders.push({
      id: 'egg-festival-eve',
      emoji: '🥚',
      title: 'Egg Festival is TOMORROW (Spring 13)!',
      body: 'Save your gold — buy Strawberry Seeds at the festival!',
      priority: 0,
      color: '#e06080',
    });
  }

  return reminders.sort((a, b) => a.priority - b.priority);
}

export default function RemindersPopup({ progress, enabled, onToggle }) {
  const [dismissed, setDismissed] = useState(false);
  const [lastDay, setLastDay] = useState(null);

  const reminders = buildReminders(progress);
  const { day, season } = progress;

  // Re-show when day changes
  useEffect(() => {
    const key = `${season}-${day}`;
    if (key !== lastDay) {
      setLastDay(key);
      setDismissed(false);
    }
  }, [day, season]);

  if (!enabled || dismissed || reminders.length === 0) {
    return (
      <div className="reminder-bar">
        <button
          className={`reminder-toggle ${enabled ? 'active' : ''}`}
          onClick={onToggle}
          title={enabled ? 'Disable daily reminders' : 'Enable daily reminders'}
        >
          {enabled ? '🔔' : '🔕'} Reminders {enabled ? 'on' : 'off'}
        </button>
        {enabled && reminders.length === 0 && (
          <span className="reminder-all-clear">✅ Nothing urgent today!</span>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="reminder-bar">
        <button
          className="reminder-toggle active"
          onClick={onToggle}
          title="Disable daily reminders"
        >
          🔔 Reminders on
        </button>
      </div>
      <div className="reminders-popup">
        <div className="popup-header">
          <span className="popup-title">📅 Day {day} Reminders</span>
          <button className="popup-dismiss" onClick={() => setDismissed(true)}>✕ Dismiss</button>
        </div>
        <div className="popup-list">
          {reminders.map(r => (
            <div key={r.id} className="popup-item" style={{ borderLeftColor: r.color }}>
              <span className="popup-emoji">{r.emoji}</span>
              <div>
                <div className="popup-item-title">{r.title}</div>
                <div className="popup-item-body">{r.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
