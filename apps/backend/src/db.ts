import fs from 'node:fs';import path from 'node:path';import Database from 'better-sqlite3';import { config } from './config.js';
fs.mkdirSync(config.dataDir,{recursive:true});
export const db=new Database(path.join(config.dataDir,'stardew.sqlite'));
db.pragma('journal_mode = WAL');db.pragma('foreign_keys = ON');db.pragma('busy_timeout = 5000');
db.exec(`CREATE TABLE IF NOT EXISTS schema_migrations(version INTEGER PRIMARY KEY,applied_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY,username TEXT NOT NULL UNIQUE COLLATE NOCASE,password_hash TEXT NOT NULL,display_name TEXT NOT NULL,created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS farms(id INTEGER PRIMARY KEY,name TEXT NOT NULL,created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS farm_members(farm_id INTEGER NOT NULL REFERENCES farms(id) ON DELETE CASCADE,user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,role TEXT NOT NULL CHECK(role IN ('owner','member')),PRIMARY KEY(farm_id,user_id));
CREATE TABLE IF NOT EXISTS farm_state(farm_id INTEGER PRIMARY KEY REFERENCES farms(id) ON DELETE CASCADE,season TEXT NOT NULL,year INTEGER NOT NULL,day INTEGER NOT NULL,version INTEGER NOT NULL DEFAULT 1,updated_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS sessions(token_hash TEXT PRIMARY KEY,user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,expires_at TEXT NOT NULL,created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS progress(farm_id INTEGER NOT NULL REFERENCES farms(id) ON DELETE CASCADE,user_id INTEGER,scope TEXT NOT NULL CHECK(scope IN ('shared','player')),domain TEXT NOT NULL,item_id TEXT NOT NULL,value_json TEXT NOT NULL,updated_at TEXT NOT NULL,UNIQUE(farm_id,user_id,scope,domain,item_id));
CREATE TABLE IF NOT EXISTS goals(id INTEGER PRIMARY KEY,farm_id INTEGER NOT NULL REFERENCES farms(id) ON DELETE CASCADE,user_id INTEGER,title TEXT NOT NULL,item_id TEXT,target_json TEXT NOT NULL,requirements_json TEXT NOT NULL,completed INTEGER NOT NULL DEFAULT 0,created_at TEXT NOT NULL,updated_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS ai_usage(id INTEGER PRIMARY KEY,user_id INTEGER NOT NULL REFERENCES users(id),kind TEXT NOT NULL,created_at TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS progress_farm ON progress(farm_id,scope,domain);CREATE INDEX IF NOT EXISTS ai_usage_user_time ON ai_usage(user_id,created_at);
INSERT OR IGNORE INTO schema_migrations(version,applied_at) VALUES(1,datetime('now'));`);
export type AuthUser={id:number;username:string;displayName:string;farmId:number;role:'owner'|'member'};
export function userBySession(hash:string){return db.prepare(`SELECT u.id,u.username,u.display_name displayName,fm.farm_id farmId,fm.role FROM sessions s JOIN users u ON u.id=s.user_id JOIN farm_members fm ON fm.user_id=u.id WHERE s.token_hash=? AND s.expires_at>datetime('now')`).get(hash) as AuthUser|undefined}
export function backupDatabase(){const stamp=new Date().toISOString().slice(0,10);const target=path.join(config.dataDir,`stardew.${stamp}.backup.sqlite`);if(!fs.existsSync(target))void db.backup(target).catch(e=>console.error('Backup failed',e))}
backupDatabase();setInterval(backupDatabase,86400000).unref();
