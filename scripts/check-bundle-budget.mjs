import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const dist=path.resolve('apps/frontend/dist');
const html=fs.readFileSync(path.join(dist,'index.html'),'utf8');
const match=html.match(/<script type="module"[^>]+src="\/assets\/([^"]+\.js)"/);
if(!match)throw new Error('Could not locate the production entry script');
const entry=fs.readFileSync(path.join(dist,'assets',match[1]));
const gzip=zlib.gzipSync(entry,{level:9}).byteLength;
const limit=100*1024;
console.log(`Initial JavaScript: ${(gzip/1024).toFixed(2)} KiB gzip (${match[1]})`);
if(gzip>limit)throw new Error(`Initial JavaScript exceeds the 100 KiB gzip budget by ${((gzip-limit)/1024).toFixed(2)} KiB`);
