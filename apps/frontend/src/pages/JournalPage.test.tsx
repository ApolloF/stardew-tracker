import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import JournalPage from './JournalPage';
import { api } from '../api';

vi.mock('../api', () => ({ api: { farm: vi.fn(), goals: vi.fn(), updateFarm: vi.fn(), putProgress: vi.fn(), addGoal: vi.fn(), updateGoal: vi.fn(), deleteGoal: vi.fn(), logout: vi.fn(), dailyPlan: vi.fn(), chat: vi.fn(), invite: vi.fn() } }));

const session = { user: { id: 1, username: 'farmer', displayName: 'Farmer', farmId: 1, role: 'owner' as const }, setupRequired: false };

describe('compact journal', () => {
  afterEach(cleanup);
  beforeEach(() => {
    localStorage.clear();
    vi.mocked(api.farm).mockResolvedValue({ farm: { name: 'Test Farm', season: 'Spring', day: 7, year: 1, version: 1 }, members: [{ id: 1, displayName: 'Farmer', role: 'owner' }], progress: [] });
    vi.mocked(api.goals).mockResolvedValue([]);
    vi.mocked(api.dailyPlan).mockResolvedValue({ summary: 'A quiet day', cards: [], source: 'local' });
  });

  it('keeps today, tomorrow, Queen of Sauce, and the old compact tabs together', async () => {
    render(<MemoryRouter initialEntries={['/dashboard']}><JournalPage session={session} onSessionChange={() => undefined} /></MemoryRouter>);
    expect(await screen.findByText('Test Farm')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Today' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Tomorrow' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: /Hints/ })).toBeTruthy();
    expect(screen.getByText('21 days left in Spring')).toBeTruthy();
    expect(screen.getByRole('checkbox', { name: /Rainy day/ })).toBeTruthy();
    expect(screen.queryByText('Weather-aware hints are ready')).toBeNull();
    expect(screen.getAllByText('Queen of Sauce').length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /Bundles/ })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Calendar/ })).toBeTruthy();
  });

  it('suggests verified Silo requirements in the goal builder', async () => {
    render(<MemoryRouter initialEntries={['/dashboard?tab=goals']}><JournalPage session={session} onSessionChange={() => undefined} /></MemoryRouter>);
    await screen.findByText('Farm goals');
    fireEvent.click(screen.getByRole('button', { name: '+ Add goal' }));
    fireEvent.change(screen.getByPlaceholderText('Try “Build a silo”'), { target: { value: 'Build a silo' } });
    await waitFor(() => expect(screen.getByText('100g · 100 Stone · 10 Clay · 5 Copper Bar')).toBeTruthy());
  });

  it('shows a confirmation instead of late-game content by default', async () => {
    render(<MemoryRouter initialEntries={['/dashboard?tab=reference']}><JournalPage session={session} onSessionChange={() => undefined} /></MemoryRouter>);
    expect(await screen.findByText('Late-game details are tucked away')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Show warning' })).toBeTruthy();
  });
});
