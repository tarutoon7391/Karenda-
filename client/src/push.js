// Service Worker 登録と Push 通知の購読
import { api } from './api.js';

export function registerSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch((e) => console.error('SW登録失敗', e));
  }
}

export const pushSupported = () => 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;

function urlBase64ToUint8Array(base64) {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const raw = atob((base64 + padding).replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

// 通知を有効化する（許可ダイアログ → 購読 → サーバー登録）
export async function enablePush() {
  if (!pushSupported()) {
    throw new Error('この環境では通知が使えません。iPhoneは「ホーム画面に追加」してから開いてください');
  }
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') throw new Error('通知が許可されませんでした');

  const reg = await navigator.serviceWorker.ready;
  const { key } = await api.pushKey();
  const sub =
    (await reg.pushManager.getSubscription()) ||
    (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(key) }));
  await api.subscribe(sub.toJSON());
}

export async function isPushEnabled() {
  if (!pushSupported() || Notification.permission !== 'granted') return false;
  const reg = await navigator.serviceWorker.ready;
  return Boolean(await reg.pushManager.getSubscription());
}
