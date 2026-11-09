// UI用の手描き風アイコン（スタンプと同じタッチ：こげ茶の線＋パステル塗り）
const base = { fill: '#fff', stroke: '#5b4636', strokeWidth: 5, strokeLinecap: 'round', strokeLinejoin: 'round' };

// 通知ベル。on=false のときは灰色で斜線
export function BellIcon({ on, className = '' }) {
  return (
    <svg viewBox="0 0 100 100" className={`icon ${className}`} aria-hidden="true">
      <g {...base}>
        <path d="M30 66 Q27 38 50 30 Q73 38 70 66 Z" fill={on ? '#ffd166' : '#e0e0e0'} />
        <path d="M22 70 Q50 60 78 70" fill="none" />
        <circle cx="50" cy="25" r="5" fill={on ? '#ffd166' : '#e0e0e0'} />
        <path d="M41 74 Q50 86 59 74 Z" />
        {on && <path d="M22 36 Q18 26 24 18 M78 36 Q82 26 76 18" fill="none" stroke="#f28b82" strokeWidth="4" />}
        {!on && <path d="M22 22 L78 78" fill="none" stroke="#f28b82" strokeWidth="7" />}
      </g>
    </svg>
  );
}

// ゴミ箱。hot=true（つまんだスタンプが上に来ている）でフタが開いて赤くなる
export function TrashIcon({ hot, className = '' }) {
  const body = hot ? '#ff6b6b' : '#cfd8dc';
  return (
    <svg viewBox="0 0 100 100" className={`icon ${className}`} aria-hidden="true">
      <g {...base}>
        <path d="M26 36 L31 82 Q32 88 38 88 H62 Q68 88 69 82 L74 36 Z" fill={body} />
        <path d="M40 48 V76 M50 48 V76 M60 48 V76" fill="none" strokeWidth="4" />
        <g transform={hot ? 'rotate(-22 74 32) translate(0 -6)' : ''}>
          <rect x="20" y="28" width="60" height="9" rx="4.5" fill={body} />
          <path d="M40 28 V22 Q40 18 44 18 H56 Q60 18 60 22 V28" fill="none" />
        </g>
      </g>
    </svg>
  );
}

// 月送りの矢印。dir='left' | 'right'
export function ChevronIcon({ dir = 'left', className = '' }) {
  return (
    <svg viewBox="0 0 100 100" className={`icon ${className}`} aria-hidden="true">
      <g {...base} transform={dir === 'right' ? 'scale(-1 1) translate(-100 0)' : ''}>
        <path d="M62 20 L30 50 L62 80" fill="none" strokeWidth="9" stroke="#ff6b6b" />
        <path d="M62 20 L30 50 L62 80" fill="none" strokeWidth="4" />
      </g>
    </svg>
  );
}

// 「貼る」ボタンのプラス
export function PlusIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 100 100" className={`icon ${className}`} aria-hidden="true">
      <g {...base}>
        <path d="M50 20 V80 M20 50 H80" fill="none" strokeWidth="12" stroke="#fff" />
      </g>
    </svg>
  );
}

// 検索の虫めがね
export function SearchIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 100 100" className={`icon ${className}`} aria-hidden="true">
      <g {...base}>
        <circle cx="42" cy="42" r="22" fill="#8ecae6" />
        <circle cx="42" cy="42" r="12" fill="#fff" strokeWidth="3" />
        <path d="M58 58 L82 82" fill="none" strokeWidth="9" />
      </g>
    </svg>
  );
}
