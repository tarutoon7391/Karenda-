import { useEffect, useState } from 'react';
import EventForm from './EventForm.jsx';
import { formatLong } from '../dateUtils.js';
import { MAX_PER_DAY, NOTIFY_OPTIONS } from '../constants.js';
import { api } from '../api.js';

const notifyLabel = (offset) => NOTIFY_OPTIONS.find((o) => o.value === String(offset))?.label;

// 画面下半分：選択した日の予定一覧と、追加・編集フォーム
export default function DayPanel({ date, events, onChanged, onEditingChange }) {
  // editing: null=一覧表示 / 'new'=新規 / 予定オブジェクト=編集
  const [editing, setEditing] = useState(null);

  useEffect(() => setEditing(null), [date]);
  useEffect(() => onEditingChange?.(Boolean(editing)), [editing, onEditingChange]);

  const save = async (body) => {
    if (editing === 'new') await api.createEvent(body);
    else await api.updateEvent(editing.id, body);
    setEditing(null);
    onChanged();
  };

  const remove = async () => {
    if (!confirm('この予定を削除しますか？')) return;
    await api.deleteEvent(editing.id);
    setEditing(null);
    onChanged();
  };

  return (
    <section className="panel">
      <div className="panel-head">
        <h2>{formatLong(date)}</h2>
        {!editing && (
          <button className="add" disabled={events.length >= MAX_PER_DAY} onClick={() => setEditing('new')}>
            ＋ 貼る
          </button>
        )}
      </div>

      {editing ? (
        <EventForm
          date={date}
          initial={editing === 'new' ? null : editing}
          onSave={save}
          onDelete={editing === 'new' ? null : remove}
          onCancel={() => setEditing(null)}
        />
      ) : events.length === 0 ? (
        <p className="empty">予定はありません</p>
      ) : (
        <ul className={`events${events.length >= 3 ? ' dense' : ''}`}>
          {events.map((ev) => (
            <li key={ev.id} onClick={() => setEditing(ev)}>
              <span className="ev-icon">{ev.icon}</span>
              <div className="ev-body">
                <div className="ev-title">
                  <span className="ev-time">
                    {ev.start_time ? ev.start_time.slice(0, 5) : '終日'}
                    {ev.notify_offset != null && <span className="ev-bell" title={notifyLabel(ev.notify_offset)}>🔔</span>}
                  </span>
                  {ev.title}
                </div>
                {ev.memo && <div className="ev-memo">{ev.memo}</div>}
              </div>
            </li>
          ))}
        </ul>
      )}
      {!editing && events.length >= MAX_PER_DAY && <p className="hint">1日に貼れるのは{MAX_PER_DAY}つまでです</p>}
    </section>
  );
}
