// エントリポイント：API とビルド済みフロントを同じサービスで配信する
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { initDb } from './db.js';
import eventsRouter from './routes/events.js';
import pushRouter from './routes/push.js';
import { startScheduler } from './scheduler.js';
import { initPush } from './push.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../client/dist');
const app = express();

app.use(express.json());
app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/events', eventsRouter);
app.use('/api/push', pushRouter);

app.use(express.static(distDir));
// SPA のため、API 以外の GET はすべて index.html を返す
app.use((req, res, next) => {
  if (req.method !== 'GET' || req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(distDir, 'index.html'));
});

// 非同期ルートで投げられた例外をまとめて 500 で返す（Express 5 は Promise の reject も拾う）
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'サーバーエラーが発生しました' });
});

const port = process.env.PORT || 3000;
await initDb();
await initPush();
startScheduler();
app.listen(port, () => console.log(`karenda listening on :${port}`));
