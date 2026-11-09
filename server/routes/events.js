// 予定の CRUD API
import { Router } from 'express';
import { pool } from '../db.js';

export const MAX_PER_DAY = 4;
const router = Router();

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}(:\d{2})?$/;

// 入力チェック。問題があればエラーメッセージを返す
function validate(b) {
  if (!DATE_RE.test(b.date || '')) return '日付が不正です';
  if (!b.title || !String(b.title).trim()) return 'タイトルは必須です';
  if (!b.icon) return 'アイコンを選んでください';
  if (b.start_time && !TIME_RE.test(b.start_time)) return '時刻が不正です';
  if (b.notify_offset != null && !Number.isInteger(b.notify_offset)) return '通知設定が不正です';
  if (b.notify_offset != null && !b.notify_at) return '通知時刻がありません';
  return null;
}

function values(b) {
  return [
    b.date,
    String(b.title).trim(),
    b.icon,
    b.start_time || null,
    b.memo || '',
    b.notify_offset ?? null,
    b.notify_offset != null ? b.notify_at : null,
  ];
}

async function countOnDate(date, excludeId = null) {
  const { rows } = await pool.query(
    'SELECT COUNT(*)::int AS n FROM events WHERE date = $1 AND ($2::int IS NULL OR id <> $2)',
    [date, excludeId],
  );
  return rows[0].n;
}

// GET /api/events?from=YYYY-MM-DD&to=YYYY-MM-DD
router.get('/', async (req, res) => {
  const { from, to } = req.query;
  if (!DATE_RE.test(from || '') || !DATE_RE.test(to || '')) {
    return res.status(400).json({ error: 'from / to を YYYY-MM-DD で指定してください' });
  }
  const { rows } = await pool.query(
    `SELECT * FROM events WHERE date BETWEEN $1 AND $2
     ORDER BY date, start_time NULLS FIRST, id`,
    [from, to],
  );
  res.json(rows);
});

router.post('/', async (req, res) => {
  const err = validate(req.body);
  if (err) return res.status(400).json({ error: err });
  if ((await countOnDate(req.body.date)) >= MAX_PER_DAY) {
    return res.status(409).json({ error: `1日に貼れるのは${MAX_PER_DAY}つまでです` });
  }
  const { rows } = await pool.query(
    `INSERT INTO events (date, title, icon, start_time, memo, notify_offset, notify_at, notified)
     VALUES ($1,$2,$3,$4,$5,$6,$7, COALESCE($7 <= NOW(), FALSE))
     RETURNING *`,
    values(req.body),
  );
  res.status(201).json(rows[0]);
});

router.put('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const err = validate(req.body);
  if (err) return res.status(400).json({ error: err });
  if ((await countOnDate(req.body.date, id)) >= MAX_PER_DAY) {
    return res.status(409).json({ error: `1日に貼れるのは${MAX_PER_DAY}つまでです` });
  }
  // 編集したら通知は再度待ち状態に戻す（過去時刻なら送らない）
  const { rows } = await pool.query(
    `UPDATE events SET date=$1, title=$2, icon=$3, start_time=$4, memo=$5,
       notify_offset=$6, notify_at=$7, notified=COALESCE($7 <= NOW(), FALSE), updated_at=NOW()
     WHERE id=$8 RETURNING *`,
    [...values(req.body), id],
  );
  if (!rows.length) return res.status(404).json({ error: '予定が見つかりません' });
  res.json(rows[0]);
});

router.delete('/:id', async (req, res) => {
  const { rowCount } = await pool.query('DELETE FROM events WHERE id = $1', [Number(req.params.id)]);
  if (!rowCount) return res.status(404).json({ error: '予定が見つかりません' });
  res.status(204).end();
});

export default router;
