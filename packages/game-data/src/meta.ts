import type { SourceMeta } from './types.js';

export const GAME_VERSION = '1.6.15' as const;
export const VERIFIED_AT = '2026-07-16';
export const WIKI = 'https://stardewvalleywiki.com';

export const meta = (page: string): SourceMeta => ({
  gameVersion: GAME_VERSION,
  verifiedAt: VERIFIED_AT,
  source: `${WIKI}/${page}`,
});
