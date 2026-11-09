// Web Push 送信まわり
import webpush from 'web-push';
import { pool } from './db.js';

let publicKey = null;

// VAPID キーを用意する。環境変数があればそれを使い、なければ DB に保存したキー（初回は自動生成）を使う
export async function initPush() {
  let pub = process.env.VAPID_PUBLIC_KEY;
  let priv = process.env.VAPID_PRIVATE_KEY;
  if (!pub || !priv) {
    const { rows } = await pool.query(
      "SELECT key, value FROM app_settings WHERE key IN ('vapid_public', 'vapid_private')",
    );
    const saved = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    if (saved.vapid_public && saved.vapid_private) {
      pub = saved.vapid_public;
      priv = saved.vapid_private;
    } else {
      const keys = webpush.generateVAPIDKeys();
      pub = keys.publicKey;
      priv = keys.privateKey;
      await pool.query(
        `INSERT INTO app_settings (key, value) VALUES ('vapid_public', $1), ('vapid_private', $2)
         ON CONFLICT (key) DO NOTHING`,
        [pub, priv],
      );
      console.log('[push] VAPID キーを自動生成して DB に保存しました');
    }
  }
  webpush.setVapidDetails(process.env.VAPID_SUBJECT || 'mailto:admin@example.com', pub, priv);
  publicKey = pub;
}

export const getPublicKey = () => publicKey;

// 登録済みの全端末に通知を送る。無効になった購読は削除する
export async function sendToAll(payload) {
  if (!publicKey) return { sent: 0 };
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
