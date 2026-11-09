// API 呼び出し
async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `通信エラー（${res.status}）`);
  return data;
}

export const api = {
  listEvents: (from, to) => request(`/api/events?from=${from}&to=${to}`),
  createEvent: (body) => request('/api/events', { method: 'POST', body: JSON.stringify(body) }),
  updateEvent: (id, body) => request(`/api/events/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteEvent: (id) => request(`/api/events/${id}`, { method: 'DELETE' }),
  pushKey: () => request('/api/push/public-key'),
  subscribe: (sub) => request('/api/push/subscribe', { method: 'POST', body: JSON.stringify(sub) }),
  testPush: () => request('/api/push/test', { method: 'POST' }),
};
