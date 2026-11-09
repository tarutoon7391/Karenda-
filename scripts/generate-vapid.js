// Web Push 用の VAPID キーを生成して表示する
import webpush from 'web-push';

const keys = webpush.generateVAPIDKeys();
console.log('以下を Railway の Variables（またはローカルの .env）に設定してください\n');
console.log(`VAPID_PUBLIC_KEY=${keys.publicKey}`);
console.log(`VAPID_PRIVATE_KEY=${keys.privateKey}`);
console.log('VAPID_SUBJECT=mailto:you@example.com');
