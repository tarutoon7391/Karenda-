import { useState } from 'react';
import { NOTIFY_OPTIONS } from '../constants.js';
import { DEFAULT_STAMP_ID, STAMPS } from '../stamps/catalog.js';
import StampPicker, { pushRecent } from './StampPicker.jsx';
import { calcNotifyAt } from '../dateUtils.js';

// 予定の追加・編集フォーム
export default function EventForm({ date, initial, onSave, onDelete, onCancel, onDragStart }) {
  const [form, setForm] = useState(() => ({
    date: initial?.date ?? date,
    icon: initial?.icon ?? DEFAULT_STAMP_ID,
    title: initial?.title ?? '',
    start_time: initial?.start_time?.slice(0, 5) ?? '',
    memo: initial?.memo ?? '',
    notify: initial?.notify_offset != null ? String(initial.notify_offset) : '',
  }));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const offset = form.notify === '' ? null : Number(form.notify);
    setBusy(true);
    setError('');
    try {
      pushRecent(form.icon);
      await onSave({
        date: form.date,
        icon: form.icon,
        title: form.title.trim() || STAMPS[form.icon]?.label || form.icon,
        start_time: form.start_time || null,
        memo: form.memo,
        notify_offset: offset,
        notify_at: calcNotifyAt(form.date, form.start_time, offset),
      });
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="form" onSubmit={submit}>
      <StampPicker value={form.icon} onChange={(icon) => setForm({ ...form, icon })} onDragStart={onDragStart} />

      <input placeholder={`タイトル（空ならスタンプ名「${STAMPS[form.icon]?.label ?? ''}」）`} value={form.title} onChange={set('title')} maxLength={50} />

      {/* 日付・時刻・通知を1行にまとめて縦幅を節約 */}
      <div className="row">
        <label>日付<input type="date" value={form.date} onChange={set('date')} required /></label>
        <label>時刻<input type="time" value={form.start_time} onChange={set('start_time')} /></label>
        <label>
          通知
          <select value={form.notify} onChange={set('notify')}>
            {NOTIFY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </label>
      </div>

      <textarea placeholder="メモ" value={form.memo} onChange={set('memo')} rows={2} />

      {error && <p className="error">{error}</p>}

      <div className="actions">
        {onDelete && <button type="button" className="danger" onClick={handleDelete}>削除</button>}
        <span className="spacer" />
        <button type="button" onClick={onCancel}>キャンセル</button>
        <button type="submit" className="primary" disabled={busy}>保存</button>
      </div>
    </form>
  );
}
