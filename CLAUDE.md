# Karenda- 開発ルール

- コメント・コミットメッセージ・PR説明はすべて日本語
- 構成は README.md を参照（React + Vite / Express 5 / PostgreSQL / Railway 1サービス）
- 1日に貼れる予定は4件まで（`server/routes/events.js` の `MAX_PER_DAY` と `client/src/constants.js` を両方合わせる）
- 日付は 'YYYY-MM-DD' 文字列、時刻は 'HH:MM' で扱う。通知時刻 `notify_at` はクライアント（端末ローカル時刻）で計算して送る
- ログイン・共有・外部連携は現時点では入れない
- デザインは仮。見た目の作り込みは別フェーズ
