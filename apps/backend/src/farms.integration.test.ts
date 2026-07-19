import { beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { db } from './db.js';
import { hashToken } from './auth.js';

let app:any; let cookie=''; let userId=0; let firstFarm=0; let secondFarm=0;
beforeAll(async()=>{
  app=(await import('./app.js')).app; const stamp=new Date().toISOString(); const suffix=`farms-${Date.now()}-${Math.random()}`;
  const user=db.prepare('INSERT INTO users(username,password_hash,display_name,created_at) VALUES(?,?,?,?)').run(suffix,'unused','Farm Tester',stamp); userId=Number(user.lastInsertRowid);
  const create=(name:string)=>{const farm=db.prepare('INSERT INTO farms(name,created_at) VALUES(?,?)').run(name,stamp);const id=Number(farm.lastInsertRowid);db.prepare("INSERT INTO farm_members(farm_id,user_id,role) VALUES(?,?,'owner')").run(id,userId);db.prepare("INSERT INTO farm_state(farm_id,season,year,day,updated_at) VALUES(?,'Spring',1,1,?)").run(id,stamp);db.prepare('INSERT INTO farm_member_settings(farm_id,user_id,reveal_late_game,updated_at) VALUES(?,?,0,?)').run(id,userId,stamp);return id};
  firstFarm=create('First isolated farm');secondFarm=create('Second isolated farm');const raw=`session-${suffix}`;db.prepare('INSERT INTO sessions(token_hash,user_id,active_farm_id,expires_at,created_at) VALUES(?,?,?,?,?)').run(hashToken(raw),userId,firstFarm,'2999-01-01T00:00:00.000Z',stamp);cookie=`stardew_session=${raw}`;
});

describe('multi-farm isolation',()=>{
  it('lists memberships and persists a membership-checked switch',async()=>{const list=await request(app).get('/api/farms').set('Cookie',cookie);expect(list.status).toBe(200);expect(list.body.farms).toHaveLength(2);expect(list.body.activeFarmId).toBe(firstFarm);expect((await request(app).put(`/api/farms/${secondFarm}/active`).set('Cookie',cookie)).status).toBe(200);expect((await request(app).get('/api/farm').set('Cookie',cookie)).body.farm.id).toBe(secondFarm)});
  it('keeps progress isolated between farms',async()=>{await request(app).put('/api/progress/shared/museum/96').set('Cookie',cookie).send({completed:true});await request(app).put(`/api/farms/${firstFarm}/active`).set('Cookie',cookie);const rows=await request(app).get('/api/progress?domains=museum&players=farm').set('Cookie',cookie);expect(rows.body).toEqual([]);expect(db.prepare("SELECT count(*) n FROM progress WHERE farm_id=? AND domain='museum'").get(secondFarm)).toMatchObject({n:1})});
  it('rejects switching to an unrelated farm',async()=>{const stamp=new Date().toISOString();const farm=db.prepare('INSERT INTO farms(name,created_at) VALUES(?,?)').run('Unrelated',stamp);const id=Number(farm.lastInsertRowid);db.prepare("INSERT INTO farm_state(farm_id,season,year,day,updated_at) VALUES(?,'Spring',1,1,?)").run(id,stamp);expect((await request(app).put(`/api/farms/${id}/active`).set('Cookie',cookie)).status).toBe(403)});
});
