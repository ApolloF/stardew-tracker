import { REFERENCE_DATA } from './reference.js';

export type RaccoonRequest = {
  id: string;
  name: string;
  order: number;
  request: string;
  reward: string;
  source: string;
  spoilerTier: 'late-game';
};

export const RACCOON_REQUESTS: readonly RaccoonRequest[] = [
  { id: 'first', name: 'First request', order: 1, request: 'Five seasonal items and one smoked fish', reward: '25 seasonal seeds', source: `${REFERENCE_DATA.repository}/blob/${REFERENCE_DATA.commit}/src/data/raccoon.json`, spoilerTier: 'late-game' },
  { id: 'second', name: 'Second request', order: 2, request: 'One dried fruit item', reward: 'Wild Seed knowledge book', source: `${REFERENCE_DATA.repository}/blob/${REFERENCE_DATA.commit}/src/data/raccoon.json`, spoilerTier: 'late-game' },
  { id: 'third', name: 'Third request', order: 3, request: 'One preserve and five eggs or milk', reward: 'Raccoon Hat', source: `${REFERENCE_DATA.repository}/blob/${REFERENCE_DATA.commit}/src/data/raccoon.json`, spoilerTier: 'late-game' },
  { id: 'fourth', name: 'Fourth request', order: 4, request: 'One cooked seasonal item', reward: 'Five Fairy Dust', source: `${REFERENCE_DATA.repository}/blob/${REFERENCE_DATA.commit}/src/data/raccoon.json`, spoilerTier: 'late-game' },
  { id: 'fifth', name: 'Fifth request', order: 5, request: 'One requested material delivery', reward: 'Jungle Tank', source: `${REFERENCE_DATA.repository}/blob/${REFERENCE_DATA.commit}/src/data/raccoon.json`, spoilerTier: 'late-game' },
] as const;
