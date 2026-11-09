// 長押しでドラッグを始めるためのイベントハンドラ群を返す。
// 指を置いて delay ミリ秒動かさなければ onStart を呼ぶ。先に動いたら（スクロール意図）取りやめる。
const MOVE_CANCEL_PX = 8;

export function longPressHandlers(onStart, delay = 280) {
  const clear = (el) => {
    if (el?._lpTimer) {
      clearTimeout(el._lpTimer);
      el._lpTimer = null;
    }
  };
  return {
    onPointerDown(e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      const el = e.currentTarget;
      clear(el);
      const sx = e.clientX;
      const sy = e.clientY;
      el._lpStart = { sx, sy };
      el._lpTimer = setTimeout(() => {
        el._lpTimer = null;
        if (navigator.vibrate) navigator.vibrate(12);
        onStart({ x: sx, y: sy, pointerId: e.pointerId });
      }, delay);
    },
    onPointerMove(e) {
      const el = e.currentTarget;
      if (el._lpTimer && el._lpStart) {
        if (Math.hypot(e.clientX - el._lpStart.sx, e.clientY - el._lpStart.sy) > MOVE_CANCEL_PX) clear(el);
      }
    },
    onPointerUp(e) { clear(e.currentTarget); },
    onPointerCancel(e) { clear(e.currentTarget); },
    onPointerLeave(e) { clear(e.currentTarget); },
    onContextMenu(e) { e.preventDefault(); }, // iOS の長押しメニューを出さない
  };
}

// 画面座標の下にあるカレンダーの日付（data-date）を返す
export function dateAtPoint(x, y) {
  const el = document.elementFromPoint(x, y);
  return el?.closest?.('[data-date]')?.dataset.date || null;
}
