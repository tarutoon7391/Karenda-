// 1分ごとに通知時刻を過ぎた予定を探して Push 通知する
import { pool } from './db.js';
import { sendToAll } from './push.js';

function formatBody(ev) {
  const [, m, d] = ev.date.split('-');
  const time = ev.start_time ? ev.start_time.slice(0, 5) : '終日';
  const memo = ev.memo ? `\n${ev.memo}` : '';
  return `${Number(m)}/${Number(d)} ${time}${memo}`;
}

async function tick() {
  try {
    // 取り出しと既読化を1クエリで行い、二重送信を防ぐ
    const { rows } = await pool.query(`
      UPDATE events SET notified = TRUE
      WHERE notified = FALSE AND notify_at IS NOT NULL AND notify_at <= NOW()
      RETURNING *
    `);
    for (const ev of rows) {
      await sendToAll({
        // icon はスタンプID（例: school/始業式）か旧データの絵文字。IDなら表示しない
        title: ev.icon.includes('/') ? ev.title : `${ev.icon} ${ev.title}`,
        body: formatBody(ev),
        url: `/?date=${ev.date}`,
      });
    }
  } catch (err) {
    console.error('[scheduler] エラー', err);
  }
}

export function startScheduler() {
  tick();
  setInterval(tick, 60 * 1000);
}
