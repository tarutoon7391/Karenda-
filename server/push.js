// Web Push 送信まわり
import webpush from 'web-push';
import { pool } from './db.js';

export const pushEnabled = Boolean(process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY);

if (pushEnabled) {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || 'mailto:admin@example.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY,
  );
} else {
  console.warn('[push] VAPID キーが未設定のため通知は無効です（npm run vapid で生成）');
}

// 登録済みの全端末に通知を送る。無効になった購読は削除する
export async function sendToAll(payload) {
  if (!pushEnabled) return { sent: 0 };
  const { rows } = await pool.query('SELECT * FROM push_subscriptions');
  let sent = 0;
  await Promise.all(
    rows.map(async (s) => {
      try {
        await webpush.sendNotification(
          { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
          JSON.stringify(payload),
        );
        sent++;
      } catch (err) {
        if (err.statusCode === 404 || err.statusCode === 410) {
          await pool.query('DELETE FROM push_subscriptions WHERE id = $1', [s.id]);
        } else {
          console.error('[push] 送信失敗', err.statusCode ?? err.code ?? err.message, err.body ?? '');
        }
      }
    }),
  );
  return { sent };
}
