import { useEffect, useMemo, useState } from 'react';
import Stamp from './Stamp.jsx';
import { CATEGORIES, searchStamps, STAMPS } from '../stamps/catalog.js';

const RECENT_KEY = 'karenda.recentStamps';
const RECENT_MAX = 14;

export function loadRecent() {
  try {
    return (JSON.parse(localStorage.getItem(RECENT_KEY)) || []).filter((id) => STAMPS[id]);
  } catch { return []; }
}
export function pushRecent(id) {
  try {
    const next = [id, ...loadRecent().filter((x) => x !== id)].slice(0, RECENT_MAX);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch { /* 保存できなくても動作に支障なし */ }
}

// スタンプ選択。カテゴリタブ＋グリッド。🔍を押すと検索欄に切り替わる
export default function StampPicker({ value, onChange }) {
  const recent = useMemo(loadRecent, []);
  const [tab, setTab] = useState(() => (recent.length ? 'recent' : STAMPS[value]?.cat || CATEGORIES[0].id));
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);

  // 選択中のスタンプのカテゴリが変わったら、そのタブへ
  useEffect(() => {
    const cat = STAMPS[value]?.cat;
    if (cat && tab !== 'recent' && !searching) setTab(cat);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const items = searching
    ? searchStamps(query)
    : tab === 'recent'
      ? recent.map((id) => STAMPS[id])
      : CATEGORIES.find((c) => c.id === tab)?.items || [];

  return (
    <div className="picker">
      <div className="picker-tabs">
        <button type="button" className={searching ? 'on' : ''} onClick={() => setSearching((s) => !s)} aria-label="検索">🔍</button>
        {searching ? (
          <input
            autoFocus className="picker-search" placeholder="スタンプを検索（例：塾）"
            value={query} onChange={(e) => setQuery(e.target.value)}
          />
        ) : (
          <div className="picker-tabs-scroll">
            {recent.length > 0 && (
              <button type="button" className={tab === 'recent' ? 'on' : ''} onClick={() => setTab('recent')}>最近</button>
            )}
            {CATEGORIES.map((c) => (
              <button type="button" key={c.id} className={tab === c.id ? 'on' : ''} onClick={() => setTab(c.id)}>{c.name}</button>
            ))}
          </div>
        )}
      </div>
      <div className="picker-grid">
        {items.length === 0 && <p className="empty">{searching ? '見つかりません' : 'スタンプがありません'}</p>}
        {items.map((st) => (
          <button
            type="button" key={st.id} className={st.id === value ? 'on' : ''}
            onClick={() => onChange(st.id)} aria-label={st.label}
          >
            <Stamp id={st.id} />
          </button>
        ))}
      </div>
    </div>
  );
}
