# ペタカレ（Karenda-）

日付にアイコンをペタッと貼るタイプの、スマホ向けカレンダー（PWA・1人用）。

- 上半分：月カレンダー。1日に最大4つのアイコン（＝予定）を2×2で表示
- 下半分：タップした日の予定詳細。追加・編集・削除
- 通知：Web Push。予定ごとに「ちょうど／10分前／30分前／1時間前／前日」を選べる（時刻なしの予定は当日9:00基準）
- 保存：Railway の PostgreSQL
- ログイン・共有・外部連携なし

## 構成

| 層 | 技術 |
|---|---|
| フロント | React + Vite（`client/`）、PWA（manifest + Service Worker） |
| サーバー | Node.js + Express 5（`server/`） |
| DB | PostgreSQL（起動時にテーブル自動作成） |
| 通知 | web-push（VAPID）＋ サーバー内の1分間隔スケジューラ |
| ホスティング | Railway（1サービスでAPIとフロントを両方配信） |

```
server/
  index.js        エントリポイント（API + client/dist を配信）
  db.js           接続とテーブル作成
  push.js         Push送信
  scheduler.js    1分ごとに通知時刻を過ぎた予定を送信
  routes/events.js  予定CRUD（1日4件まで）
  routes/push.js    購読登録・テスト通知
client/
  src/App.jsx, components/Calendar.jsx, DayPanel.jsx, EventForm.jsx
  public/sw.js    Push受信・通知タップ処理
```

## API

| メソッド | パス | 内容 |
|---|---|---|
| GET | `/api/events?from=YYYY-MM-DD&to=YYYY-MM-DD` | 期間内の予定一覧 |
| POST | `/api/events` | 追加（同じ日が4件なら409） |
| PUT | `/api/events/:id` | 編集（通知は再セット） |
| DELETE | `/api/events/:id` | 削除 |
| GET | `/api/push/public-key` | VAPID公開鍵 |
| POST | `/api/push/subscribe` | 端末の購読登録 |
| POST | `/api/push/test` | テスト通知 |

## Railway へのデプロイ

1. Railway で New Project → Deploy from GitHub repo → `Karenda-` を選ぶ
2. 同じプロジェクトに **PostgreSQL** を追加し、アプリ側の Variables に `DATABASE_URL` を参照で追加（`${{Postgres.DATABASE_URL}}`）
3. VAPID キー（通知用）は初回起動時に自動生成して DB に保存されるので設定不要（自分で指定したい場合だけ `npm run vapid` の値を Variables に入れる）
4. Settings → Networking → Generate Domain で URL を発行
5. Build は `npm run build`、Start は `npm start`（package.json のままで自動認識される）

## スマホでの使い方

- **iPhone**：Safari で開く → 共有 → 「ホーム画面に追加」→ ホーム画面のアイコンから開いて 🔕 をタップ（iOS 16.4以降。Safari のままだと通知は使えない）
- **Android**：Chrome で開いて 🔕 をタップ（ホーム画面追加推奨）
- 🔕 をタップすると通知を許可 → テスト通知が届けばOK（🔔 になる）

## ローカル開発

```powershell
npm install
copy .env.example .env   # DATABASE_URL と VAPID を設定
npm run dev:server       # :3000
npm run dev:client       # :5173（/api は :3000 へプロキシ）
```

※ `npm run dev:server` は `.env` があれば自動で読み込む。
