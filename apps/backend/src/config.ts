import path from 'node:path';

const positiveInteger = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

export const config = {
  port: Number(process.env.PORT || 3001),
  dataDir: path.resolve(process.env.DATA_DIR || path.join(process.cwd(), 'data')),
  legacyFile: path.resolve(process.env.LEGACY_PROGRESS_FILE || path.join(process.cwd(), '../../backend/data/progress.json')),
  setupToken: process.env.SETUP_TOKEN || '', secureCookies: process.env.NODE_ENV === 'production',
  geminiKey: process.env.GEMINI_API_KEY || '', geminiModel: process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite',
  trustProxy: process.env.TRUST_PROXY === '1',
  backupRetentionDays: positiveInteger(process.env.BACKUP_RETENTION_DAYS, 30),
};
