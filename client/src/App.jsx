import { useCallback, useEffect, useMemo, useState } from 'react';
import Calendar from './components/Calendar.jsx';
import DayPanel from './components/DayPanel.jsx';
import { api } from './api.js';
import { monthGrid, parseKey, toKey, todayKey } from './dateUtils.js';
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
    <div className="app">
      <header className="header">
        <button onClick={() => moveMonth(-1)} aria-label="前の月">◀</button>
        <h1>{view.year}年{view.month + 1}月</h1>
        <button onClick={() => moveMonth(1)} aria-label="次の月">▶</button>
        <button className="bell" onClick={handlePush} title="通知をオンにする">
          {pushOn ? '🔔' : '🔕'}
        </button>
      </header>

      <Calendar grid={grid} month={view.month} byDate={byDate} selected={selected} onSelect={selectDate} />

      {error && <p className="error">{error}</p>}

      <DayPanel date={selected} events={byDate[selected] || []} onChanged={load} />
    </div>
  );
}
