import { useRef, useState } from 'react';
import { WEEKDAYS, toKey, todayKey } from '../dateUtils.js';
import { MAX_PER_DAY } from '../constants.js';
import Stamp from './Stamp.jsx';
import { longPressHandlers } from '../drag.js';

const SWIPE_PX = 50;        // これ以上動かして離したら月送り
const FLICK_SPEED = 0.4;    // px/ms。短くても速く払えば月送り
const OUT_MS = 180;         // 画面外へ出ていく時間

// 月のカレンダー。横スワイプでページをめくるように月送りする
export default function Calendar({ grid, month, byDate, selected, onSelect, drag, onDragStart, onSwipe }) {
  const today = todayKey();
  const gridRef = useRef(null);
  const swipe = useRef(null);
  const busy = useRef(false);
  // x: 横のずれ(px) / anim: トランジションを効かせるか
  const [pos, setPos] = useState({ x: 0, anim: false });

  const onPointerDown = (e) => {
    if (drag || busy.current) return;
    swipe.current = { x: e.clientX, y: e.clientY, t: e.timeStamp, dx: 0, active: false, id: e.pointerId };
  };

  const onPointerMove = (e) => {
    const sw = swipe.current;
    if (!sw || drag) return;
    const dx = e.clientX - sw.x;
    const dy = e.clientY - sw.y;
    if (!sw.active) {
      // 横にはっきり動いたらスワイプ開始（縦寄りなら無視）
      if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        sw.active = true;
        e.currentTarget.setPointerCapture?.(e.pointerId);
      } else return;
    }
    sw.dx = dx;
    sw.lastT = e.timeStamp;
    setPos({ x: dx, anim: false }); // 指に1:1で追従
  };

  const onPointerEnd = (e) => {
    const sw = swipe.current;
    swipe.current = null;
    if (!sw?.active) return;
    const w = gridRef.current?.offsetWidth || 360;
    const speed = Math.abs(sw.dx) / Math.max(1, (e.timeStamp || sw.lastT) - sw.t);
    if (Math.abs(sw.dx) < SWIPE_PX && speed < FLICK_SPEED) {
      setPos({ x: 0, anim: true }); // 足りなければバネのように戻る
      return;
    }
    const dir = sw.dx < 0 ? 1 : -1; // 左へ払う＝次の月
    busy.current = true;
    // ① 今の月を画面外へ流す
    setPos({ x: -dir * w, anim: true });
    setTimeout(() => {
      // ② 月を切り替えて、反対側の画面外に置く
      onSwipe(dir);
      setPos({ x: dir * w, anim: false });
      // ③ 次のフレームで中央へスライドイン
      requestAnimationFrame(() => requestAnimationFrame(() => {
        setPos({ x: 0, anim: true });
        setTimeout(() => { busy.current = false; }, 260);
      }));
    }, OUT_MS);
  };

  const w = gridRef.current?.offsetWidth || 360;
  const fade = 1 - Math.min(Math.abs(pos.x) / w, 1) * 0.6;

  return (
    <section
      className="calendar"
      onPointerDown={onPointerDown} onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd} onPointerCancel={onPointerEnd}
    >
      <div className="weekdays">
        {WEEKDAYS.map((w, i) => (
          <div key={w} className={`wd wd-${i}`}>{w}</div>
        ))}
      </div>
      <div className="grid-viewport">
        <div
          ref={gridRef}
          className={`grid${pos.anim ? ' anim' : ''}`}
          style={{
            gridTemplateRows: `repeat(${grid.length / 7}, minmax(0, 1fr))`,
            transform: `translateX(${pos.x}px) rotate(${pos.x / w * 2}deg)`,
            opacity: fade,
          }}
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
      </div>
    </section>
  );
}
