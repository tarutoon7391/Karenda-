# Karenda- 開発ルール

- コメント・コミットメッセージ・PR説明はすべて日本語
- 構成は README.md を参照（React + Vite / Express 5 / PostgreSQL / Railway 1サービス）
- 1日に貼れる予定は4件まで（`server/routes/events.js` の `MAX_PER_DAY` と `client/src/constants.js` を両方合わせる）
- 日付は 'YYYY-MM-DD' 文字列、時刻は 'HH:MM' で扱う。通知時刻 `notify_at` はクライアント（端末ローカル時刻）で計算して送る
- ログイン・共有・外部連携は現時点では入れない
- スタンプは `client/src/stamps/catalog.js`（一覧）と `motifs.js`（絵の部品）で管理。events.icon には `カテゴリid/ラベル` を保存。旧データの絵文字はそのまま表示される
- スタンプの見た目は「手描き風の線＋パステル台紙＋ゆるいフォント（Yomogi）のラベル」。既存アプリの絵をそのまま写さない
- デザインは仮。見た目の作り込みは別フェーズ
