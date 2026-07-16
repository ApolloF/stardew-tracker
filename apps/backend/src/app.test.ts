import { beforeAll,describe,expect,it } from 'vitest';import request from 'supertest';
let app:any;
beforeAll(async()=>{app=(await import('./app.js')).app});
describe('public/private API boundary',()=>{
 it('exposes health and version',async()=>{const r=await request(app).get('/api/health');expect(r.status).toBe(200);expect(r.body.gameVersion).toBe('1.6.15')});
 it('serves the read-only public catalog',async()=>{const r=await request(app).get('/api/catalog/crops?q=powdermelon');expect(r.status).toBe(200);expect(r.body.items[0].id).toBe('powdermelon')});
 it('rejects private farm and AI access for guests',async()=>{expect((await request(app).get('/api/farm')).status).toBe(401);expect((await request(app).post('/api/ai/daily-plan')).status).toBe(401)});
 it('rejects unknown catalog domains',async()=>expect((await request(app).get('/api/catalog/secrets')).status).toBe(404));
});
