import { render, cleanup } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { UI_ICON_KEYS } from '@stardew/game-data';
import UiIcon, { type UiIconName } from './UiIcon';

describe('UiIcon', () => {
  afterEach(cleanup);

  it('renders a distinct Tabler icon for every registered key', () => {
    const seen = new Map<string, string>();
    for (const name of UI_ICON_KEYS as readonly UiIconName[]) {
      const { container } = render(<UiIcon name={name} label={name} />);
      const svg = container.querySelector('svg[data-icon]');
      expect(svg, `expected an icon for "${name}"`).toBeTruthy();
      const html = svg!.innerHTML;
      cleanup();
      const collision = seen.get(html);
      expect(collision, `"${name}" renders the same glyph as "${collision}"`).toBeUndefined();
      seen.set(html, name);
    }
  });

  it('marks icon-only usage accessible and text-adjacent usage decorative', () => {
    const { container: withLabel } = render(<UiIcon name="calendar" label="Egg Festival" />);
    expect(withLabel.querySelector('svg')?.getAttribute('aria-label')).toBe('Egg Festival');
    cleanup();
    const { container: withoutLabel } = render(<UiIcon name="calendar" />);
    expect(withoutLabel.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
  });
});
