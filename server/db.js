// PostgreSQL 接続とテーブル初期化
import pg from 'pg';

// DATE 型は JS の Date に変換せず 'YYYY-MM-DD' 文字列のまま扱う（タイムゾーンずれ防止）
pg.types.setTypeParser(1082, (v) => v);

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : false,
});

export async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS events (
      id            SERIAL PRIMARY KEY,
      date          DATE        NOT NULL,
      title         TEXT        NOT NULL,
      icon          TEXT        NOT NULL,
      start_time    TIME,
      memo          TEXT        NOT NULL DEFAULT '',
      notify_offset INTEGER,              -- 何分前に通知するか（NULL=通知なし）
      notify_at     TIMESTAMPTZ,          -- 実際に通知する時刻（クライアントで計算）
      notified      BOOLEAN     NOT NULL DEFAULT FALSE,
      created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
    CREATE INDEX IF NOT EXISTS idx_events_notify ON events(notify_at) WHERE notified = FALSE;

    CREATE TABLE IF NOT EXISTS push_subscriptions (
      id         SERIAL PRIMARY KEY,
      endpoint   TEXT UNIQUE NOT NULL,
      p256dh     TEXT NOT NULL,
      auth       TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}
