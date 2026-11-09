import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Calendar from './components/Calendar.jsx';
import DayPanel from './components/DayPanel.jsx';
import { api } from './api.js';
import { calcNotifyAt, monthGrid, parseKey, toKey, todayKey } from './dateUtils.js';
import { dropTargetAt } from './drag.js';
import Stamp from './components/Stamp.jsx';
import { STAMPS } from './stamps/catalog.js';
import { pushRecent } from './components/StampPicker.jsx';
import { enablePush, isPushEnabled } from './push.js';

// 通知タップで ?date=YYYY-MM-DD 付きで開かれたらその日を選択する
function initialDate() {
  const q = new URLSearchParams(location.search).get('date');
  return q && /^\d{4}-\d{2}-\d{2}$/.test(q) ? q : todayKey();
}

export default function App() {
  const [selected, setSelected] = useState(initialDate);
  const [view, setView] = useState(() => {
    const d = parseKey(selected);
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');
  const [pushOn, setPushOn] = useState(false);
  const [editing, setEditing] = useState(false);
  // ドラッグ中の情報：{ kind:'new'|'move', stampId, event, x, y, over }
  const [drag, setDrag] = useState(null);
  const dragRef = useRef(null);
  const justDropped = useRef(0);

  const grid = useMemo(() => monthGrid(view.year, view.month), [view]);

  const load = useCallback(async () => {
    try {
      setEvents(await api.listEvents(toKey(grid[0]), toKey(grid[grid.length - 1])));
      setError('');
    } catch (e) {
      setError(e.message);
    }
  }, [grid]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { isPushEnabled().then(setPushOn).catch(() => {}); }, []);

  // 日付キー → その日の予定一覧
  const byDate = useMemo(() => {
    const map = {};
    for (const ev of events) (map[ev.date] ||= []).push(ev);
    return map;
  }, [events]);

  const moveMonth = (diff) => {
    const d = new Date(view.year, view.month + diff, 1);
    setView({ year: d.getFullYear(), month: d.getMonth() });
  };

  const selectDate = (key) => {
    setSelected(key);
    const d = parseKey(key);
    if (d.getMonth() !== view.month) setView({ year: d.getFullYear(), month: d.getMonth() });
  };

  const onDragStart = useCallback((info) => {
    const d = { ...info, stampId: info.stampId || info.event?.icon, eventId: info.event?.id ?? null, over: dropTargetAt(info.x, info.y) };
    dragRef.current = d;
    setDrag(d);
  }, []);

  // ドロップ：新規なら「スタンプ名・時刻なし・前日通知」で追加、移動なら日付だけ変更
  const finishDrag = useCallback(async (x, y) => {
    const d = dragRef.current;
    dragRef.current = null;
    setDrag(null);
    if (!d) return;
    justDropped.current = Date.now();
    const target = dropTargetAt(x, y);
    if (!target) return;
    try {
      if (target === 'trash') {
        // ゴミ箱に落としたら確認なしで削除（ピッカーから持ってきた新規スタンプは何もしない）
        if (d.kind === 'move') {
          await api.deleteEvent(d.event.id);
          await load();
        }
        return;
      }
      if (d.kind === 'new') {
        const st = STAMPS[d.stampId];
        pushRecent(d.stampId);
        await api.createEvent({
          date: target, icon: d.stampId, title: st?.label || d.stampId, start_time: null, memo: '',
          notify_offset: 1440, notify_at: calcNotifyAt(target, null, 1440),
        });
      } else if (d.kind === 'move' && d.event.date !== target) {
        const ev = d.event;
        const time = ev.start_time ? ev.start_time.slice(0, 5) : null;
        await api.updateEvent(ev.id, {
          date: target, icon: ev.icon, title: ev.title, start_time: time, memo: ev.memo,
          notify_offset: ev.notify_offset, notify_at: calcNotifyAt(target, time, ev.notify_offset),
        });
      }
      // 移動したときだけ移動先の日を選択する。ピッカーから貼ったときはフォームを開いたまま連続で貼れるようにする
      if (d.kind === 'move') {
        setSelected(target);
        const t = parseKey(target);
        if (t.getMonth() !== view.month) setView({ year: t.getFullYear(), month: t.getMonth() });
      }
      await load();
    } catch (e) {
      setError(e.message);
    }
  }, [load, view.month]);

  // ドラッグ中は指の位置を追いかけ、画面スクロールを止める
  useEffect(() => {
    if (!drag) return;
    const move = (e) => {
      const over = dropTargetAt(e.clientX, e.clientY);
      const next = { ...dragRef.current, x: e.clientX, y: e.clientY, over };
      dragRef.current = next;
      setDrag(next);
    };
    const up = (e) => finishDrag(e.clientX, e.clientY);
    const cancel = () => { dragRef.current = null; setDrag(null); };
    const prevent = (e) => e.preventDefault();
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', cancel);
    document.addEventListener('touchmove', prevent, { passive: false });
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', cancel);
      document.removeEventListener('touchmove', prevent);
    };
  }, [drag ? 1 : 0, finishDrag]); // eslint-disable-line react-hooks/exhaustive-deps

  // ドロップ直後に飛んでくるクリックで日付やスタンプが切り替わらないようにする
  const swallowClick = (e) => {
    if (Date.now() - justDropped.current < 400) { e.stopPropagation(); e.preventDefault(); }
  };

  // その日の予定をまとめて削除（ゴミ箱タップ）
  const clearDay = async () => {
    const evs = byDate[selected] || [];
    if (!evs.length) return;
    if (!confirm(`${evs.length}件の予定をすべて削除しますか？`)) return;
    try {
      await Promise.all(evs.map((ev) => api.deleteEvent(ev.id)));
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  const handlePush = async () => {
    try {
      await enablePush();
      setPushOn(true);
      await api.testPush();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className={`app${editing ? ' editing' : ''}${drag ? ' dragging' : ''}`} onClickCapture={swallowClick}>
      <header className="header">
        <button onClick={() => moveMonth(-1)} aria-label="前の月">◀</button>
        <h1>{view.year}年{view.month + 1}月</h1>
        <button onClick={() => moveMonth(1)} aria-label="次の月">▶</button>
        <button className="bell" onClick={handlePush} title="通知をオンにする">
          {pushOn ? '🔔' : '🔕'}
        </button>
      </header>

      <Calendar grid={grid} month={view.month} byDate={byDate} selected={selected} onSelect={selectDate} drag={drag} onDragStart={onDragStart} />

      {error && <p className="error">{error}</p>}

      <DayPanel
        date={selected} events={byDate[selected] || []} onChanged={load}
        onEditingChange={setEditing} onDragStart={onDragStart}
        trash={{ visible: !editing || drag?.kind === 'move', hot: drag?.over === 'trash', dragging: drag?.kind === 'move', onClick: clearDay, disabled: !(byDate[selected] || []).length }}
      />

      {/* つまんでいるスタンプ（指に追従する） */}
      {drag && (
        <div className="drag-ghost" style={{ left: drag.x, top: drag.y }}>
          <Stamp id={drag.stampId} />
        </div>
      )}
    </div>
  );
}
