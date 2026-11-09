// 日付ユーティリティ（タイムゾーンずれを避けるため、すべて端末のローカル時刻で扱う）
const pad = (n) => String(n).padStart(2, '0');

export const toKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const todayKey = () => toKey(new Date());

export function parseKey(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

// 月表示用：日曜始まりで、その月を収めるのに必要な週数ぶん（4〜6週）の日付を返す。
// 次の月だけの行は作らない（行数を減らしてマスを大きく見せるため）
export function monthGrid(year, month) {
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const weeks = Math.ceil((first.getDay() + daysInMonth) / 7);
  const start = new Date(year, month, 1 - first.getDay());
  return Array.from({ length: weeks * 7 }, (_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
}

const WEEK = ['日', '月', '火', '水', '木', '金', '土'];
export const WEEKDAYS = WEEK;

export function formatLong(key) {
  const d = parseKey(key);
  return `${d.getMonth() + 1}月${d.getDate()}日（${WEEK[d.getDay()]}）`;
}

// 予定の日付・時刻と「何分前」から通知時刻（ISO文字列）を計算する。時刻なしは当日9:00基準
export function calcNotifyAt(date, time, offsetMin) {
  if (offsetMin == null) return null;
  const [h, m] = (time || '09:00').split(':').map(Number);
  const base = parseKey(date);
  base.setHours(h, m, 0, 0);
  return new Date(base.getTime() - offsetMin * 60 * 1000).toISOString();
}
