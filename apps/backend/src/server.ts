import { app } from './app.js';import { config } from './config.js';
app.listen(config.port,()=>console.log(`Stardew Tracker API listening on :${config.port}`));
