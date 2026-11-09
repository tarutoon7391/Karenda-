import { WEEKDAYS, toKey, todayKey } from '../dateUtils.js';
import { MAX_PER_DAY } from '../constants.js';

// 月のカレンダー。各マスに最大4つのアイコン（シール）を2×2で表示する
export default function Calendar({ grid, month, byDate, selected, onSelect }) {
  const today = todayKey();
  return (
    <section className="calendar">
      <div className="weekdays">
        {WEEKDAYS.map((w, i) => (
          <div key={w} className={`wd wd-${i}`}>{w}</div>
        ))}
      </div>
      <div className="grid">
        {grid.map((d) => {
          const key = toKey(d);
          const evs = (byDate[key] || []).slice(0, MAX_PER_DAY);
          const cls = [
            'cell',
            d.getMonth() !== month && 'other',
            key === today && 'today',
            key === selected && 'selected',
            `dow-${d.getDay()}`,
          ].filter(Boolean).join(' ');
          return (
            <button key={key} className={cls} onClick={() => onSelect(key)}>
              <span className="num">{d.getDate()}</span>
              <span className="stickers">
                {evs.map((ev) => <span key={ev.id} className="sticker">{ev.icon}</span>)}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
