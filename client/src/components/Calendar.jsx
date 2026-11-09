import { WEEKDAYS, toKey, todayKey } from '../dateUtils.js';
import { MAX_PER_DAY } from '../constants.js';
import Stamp from './Stamp.jsx';
import { longPressHandlers } from '../drag.js';

// 月のカレンダー。各マスに最大4つのアイコン（シール）を2×2で表示する
export default function Calendar({ grid, month, byDate, selected, onSelect, drag, onDragStart }) {
  const today = todayKey();
  return (
    <section className="calendar">
      <div className="weekdays">
        {WEEKDAYS.map((w, i) => (
          <div key={w} className={`wd wd-${i}`}>{w}</div>
        ))}
      </div>
      <div className="grid" style={{ gridTemplateRows: `repeat(${grid.length / 7}, minmax(0, 1fr))` }}>
        {grid.map((d) => {
          const key = toKey(d);
          const evs = (byDate[key] || []).slice(0, MAX_PER_DAY);
          const cls = [
            'cell',
            d.getMonth() !== month && 'other',
            key === today && 'today',
            key === selected && 'selected',
            drag && drag.over === key && 'drop',
            `dow-${d.getDay()}`,
          ].filter(Boolean).join(' ');
          return (
            <button key={key} className={cls} data-date={key} onClick={() => onSelect(key)}>
              <span className="num">{d.getDate()}</span>
              <span className="stickers">
                {evs.map((ev) => (
                  <Stamp
                    key={ev.id} id={ev.icon}
                    className={`sticker${drag?.eventId === ev.id ? ' lifted' : ''}`}
                    {...longPressHandlers((p) => onDragStart({ kind: 'move', event: ev, ...p }))}
                  />
                ))}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
