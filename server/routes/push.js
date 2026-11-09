// Push 通知の購読 API
import { Router } from 'express';
import { pool } from '../db.js';
import { pushEnabled, sendToAll } from '../push.js';

const router = Router();

router.get('/public-key', (req, res) => {
  if (!pushEnabled) return res.status(503).json({ error: 'サーバーで通知が設定されていません' });
  res.json({ key: process.env.VAPID_PUBLIC_KEY });
});

router.post('/subscribe', async (req, res) => {
  const { endpoint, keys } = req.body || {};
  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    return res.status(400).json({ error: '購読情報が不正です' });
  }
  await pool.query(
    `INSERT INTO push_subscriptions (endpoint, p256dh, auth) VALUES ($1,$2,$3)
     ON CONFLICT (endpoint) DO UPDATE SET p256dh = EXCLUDED.p256dh, auth = EXCLUDED.auth`,
    [endpoint, keys.p256dh, keys.auth],
  );
  res.status(201).json({ ok: true });
});

// 動作確認用：今すぐテスト通知を送る
router.post('/test', async (req, res) => {
  const result = await sendToAll({ title: '📅 テスト通知', body: '通知は正しく届いています', url: '/' });
  res.json(result);
});

export default router;
