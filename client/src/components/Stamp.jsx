import { MOTIFS } from '../stamps/motifs.js';
import { STAMPS, CATEGORY_BY_ID } from '../stamps/catalog.js';

// 文字列から安定した小さな数を作る（スタンプごとの傾き・色のゆらぎに使う）
function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

// ラベルの文字数に応じたフォントサイズ
function labelSize(len) {
  if (len <= 2) return 19;
  if (len === 3) return 16;
  if (len === 4) return 13.5;
  if (len === 5) return 11.5;
  return 10;
}

// 1枚のスタンプ（シール）を SVG で描く。id が見つからないときは旧データ（絵文字）としてそのまま表示する
export default function Stamp({ id, className = '', style }) {
  const st = STAMPS[id];
  if (!st) {
    return <span className={`stamp stamp-fallback ${className}`} style={style}>{id}</span>;
  }
  const cat = CATEGORY_BY_ID[st.cat];
  const h = hash(id);
  const bg = cat.colors[h % cat.colors.length];
  const rot = (h % 9) - 4; // -4〜+4度の傾き
  const motif = MOTIFS[st.motif];
  const withLabel = st.showLabel;

  return (
    <svg className={`stamp ${className}`} style={style} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-label={st.label}>
      <g transform={`rotate(${rot} 50 50)`}>
        {/* シール台紙：白フチ＋パステル色 */}
        <rect x="3" y="3" width="94" height="94" rx="24" fill="#fff" stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" />
        <rect x="8" y="8" width="84" height="84" rx="20" fill={bg} />
        {/* 絵 */}
        <g
          transform={withLabel ? 'translate(50 42) scale(0.6) translate(-50 -50)' : 'translate(50 50) scale(0.74) translate(-50 -50)'}
          fill="#fff" stroke="#5b4636" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
          dangerouslySetInnerHTML={{ __html: motif }}
        />
        {/* ゆるいフォントのラベル */}
        {withLabel && (
          <>
            <rect x="9" y="68" width="82" height="23" rx="11.5" fill="#fff" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
            <text
              x="50" y="80" textAnchor="middle" dominantBaseline="middle"
              fontFamily="'Yomogi', 'Zen Maru Gothic', 'Hiragino Maru Gothic ProN', sans-serif"
              fontSize={labelSize(st.label.length)} fontWeight="700" fill="#5b4636"
              {...(st.label.length >= 6 ? { textLength: 74, lengthAdjust: 'spacingAndGlyphs' } : {})}
            >
              {st.label}
            </text>
          </>
        )}
      </g>
    </svg>
  );
}
