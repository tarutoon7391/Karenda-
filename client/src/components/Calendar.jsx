import { useRef, useState } from 'react';
import { WEEKDAYS, toKey, todayKey } from '../dateUtils.js';
import { MAX_PER_DAY } from '../constants.js';
import Stamp from './Stamp.jsx';
import { longPressHandlers } from '../drag.js';

// 月のカレンダー。各マスに最大4つのアイコン（シール）を2×2で表示する
export default function Calendar({ grid, month, byDate, selected, onSelect, drag, onDragStart, onSwipe }) {
  const today = todayKey();
  // 横スワイプで月送り。指についてくるように少しだけずらして表示する
  const swipe = useRef(null);
  const [offset, setOffset] = useState(0);
  const SWIPE_PX = 60;

  const onPointerDown = (e) => {
    if (drag) return;
    swipe.current = { x: e.clientX, y: e.clientY, active: false, done: false };
  };
  const onPointerMove = (e) => {
    const sw = swipe.current;
    if (!sw || sw.done || drag) return;
    const dx = e.clientX - sw.x;
    const dy = e.clientY - sw.y;
    // 横方向に十分動いたらスワイプ扱い（縦が大きければ無視）
    if (!sw.active) {
      if (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy) * 1.5) sw.active = true;
      else return;
    }
    setOffset(Math.max(-120, Math.min(120, dx)));
    if (Math.abs(dx) >= SWIPE_PX) {
      sw.done = true;
      onSwipe(dx < 0 ? 1 : -1);
      setOffset(0);
    }
  };
  const onPointerEnd = () => {
    swipe.current = null;
    setOffset(0);
  };
  return (
    <section
      className="calendar"
      onPointerDown={onPointerDown} onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd} onPointerCancel={onPointerEnd} onPointerLeave={onPointerEnd}
    >
      <div className="weekdays">
        {WEEKDAYS.map((w, i) => (
          <div key={w} className={`wd wd-${i}`}>{w}</div>
        ))}
      </div>
      <div
        className={`grid${offset ? ' swiping' : ''}`}
        style={{ gridTemplateRows: `repeat(${grid.length / 7}, minmax(0, 1fr))`, transform: offset ? `translateX(${offset * 0.4}px)` : undefined, opacity: offset ? 1 - Math.abs(offset) / 300 : 1 }}
      >
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
              <span className={`stickers n${evs.length}`}>
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
