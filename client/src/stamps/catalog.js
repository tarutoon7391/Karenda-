// スタンプのカタログ。各カテゴリの items は「ラベル:モチーフ名」をカンマ区切りで並べる。
// 末尾に「!」を付けると絵だけで分かるものとしてラベルを表示しない。
// スタンプIDは `${カテゴリid}/${ラベル}`。DB の events.icon にはこのIDを保存する。
import { MOTIFS } from './motifs.js';

const RAW = [
  {
    id: 'school', name: '学校', colors: ['#FFE0B5', '#FFEBCF', '#FFD9A8'],
    items: `始業式:bell,終業式:bell,修了式:gradcap,入学式:school,卒業式:gradcap,入園式:school,卒園式:gradcap,
      授業参観:people,懇談会:people,三者面談:people,個人面談:people,家庭訪問:house,保護者会:people,PTA:people,役員会:people,
      運動会:bunting,体育祭:bunting,文化祭:lantern,学園祭:lantern,合唱コン:mic,音楽会:note,発表会:mic,学習発表会:board,
      遠足:randoseru,社会科見学:bus,校外学習:bus,修学旅行:suitcase,林間学校:tent,臨海学校:sea,宿泊学習:tent,スキー教室:ski,
      球技大会:soccer,マラソン大会:runner,持久走:runner,水泳:pool,プール開き:pool,プール納め:pool,
      給食開始:tray,給食なし:bento,お弁当:bento,短縮授業:clock,午前授業:clock,休校:school,振替休日:calendar,創立記念日:school,開校記念日:school,
      身体測定:scale,健康診断:stethoscope,歯科検診:tooth,視力検査:eye,聴力検査:ear,内科検診:stethoscope,予防接種:syringe,避難訓練:helmet,引き渡し訓練:people,
      中間テスト:test,期末テスト:test,実力テスト:test,学力テスト:test,模試:test,小テスト:test,漢字テスト:test,英単語テスト:test,追試:test,テスト返却:test,
      課題提出:notebook,レポート:document,宿題:pencil,自由研究:palette,読書感想文:book,プリント:papers,
      塾:pencil,塾テスト:test,塾面談:people,個別指導:pencil,家庭教師:pencil,習字:pencil,そろばん:ruler,英会話:bubble,公文:notebook,プログラミング:laptop,
      部活:megaphone,部活休み:megaphone,朝練:clock,大会:trophy,練習試合:soccer,公式戦:trophy,合宿:tent,引退試合:medal,
      入試:test,受験:test,合格発表:sakura,願書提出:document,説明会:board,学校見学:school,オープンキャンパス:school,体験入学:school,面接練習:people,
      登校日:randoseru,始業:bell,終業:bell,集金:coin,上履き洗い:shoe,体操服:tshirt,持ち物:bag,忘れ物:exclaim,係活動:megaphone,委員会:people,生徒会:megaphone,
      学級閉鎖:ban,早帰り:clock,代休:calendar,春休み:sakura,夏休み:sun,冬休み:snow`,
  },
  {
    id: 'work', name: '仕事', colors: ['#CFE4FF', '#DDEBFF', '#C2DBFF'],
    items: `仕事:briefcase,出勤:briefcase,早番:clock,遅番:clock,中番:clock,夜勤:moon,日勤:sun,残業:clock,休日出勤:briefcase,
      在宅:house,リモート:laptop,出張:suitcase,外出:footprints,直行:footprints,直帰:house,
      会議:people,打合せ:people,面談:people,1on1:people,研修:board,勉強会:book,セミナー:board,講習:board,
      締切:hourglass,納期:hourglass,提出:document,発表:mic,プレゼン:board,営業:handshake,外回り:footprints,来客:people,商談:handshake,契約:document,
      請求書:receipt,見積:document,経費精算:receipt,給料日:moneybag,ボーナス:moneybag,振込日:bank,
      有給:sun,休み:sun,半休:clock,代休:calendar,夏季休暇:sea,年末年始:mochi,
      飲み会:beer,歓迎会:beer,送別会:bouquet,忘年会:beer,新年会:sake,懇親会:beer,ランチ会:plate,
      面接:people,説明会:board,入社:door,初出勤:badge,退社:door,異動:swap,昇進:arrowup,転勤:suitcase,辞令:document,
      棚卸し:box,シフト:calendar,シフト提出:calendar,シフト希望:memo,月末:calendar,月初:calendar,締め日:hourglass,
      バイト:briefcase,副業:laptop,面談日:people,評価:target,目標設定:target,報告:document,資料作成:laptop,電話対応:handset,メール:envelope,
      健康診断:stethoscope,社内イベント:bunting,社員旅行:suitcase,表彰:trophy,創立記念:bunting,朝礼:megaphone,当番:flag,掃除当番:broom,鍵当番:key`,
  },
  {
    id: 'home', name: '家事・生活', colors: ['#D6F5D6', '#E3F8E3', '#C8F0CC'],
    items: `燃えるゴミ:trashbag,燃えないゴミ:trashbag,資源ゴミ:recycle,プラ:recycle,ペットボトル:bottle,缶:can,びん:bottle,古紙:papers,段ボール:box,粗大ゴミ:box,
      掃除:broom,大掃除:broom,洗濯:tshirt,布団干し:sun,シーツ洗い:tshirt,アイロン:tshirt,買い物:bag,食材:cart,日用品:cart,まとめ買い:cart,
      料理:pot,作り置き:pot,宅配:box,荷物受取:box,発送:box,郵便:envelope,銀行:bank,ATM:bank,振込:bank,支払い:bill,引き落とし:card,
      家賃:house,光熱費:bill,電気代:thunder,ガス代:pot,水道代:drop,携帯代:phone,通信費:phone,カード:card,保険:document,税金:bill,確定申告:document,年金:bill,
      更新:document,契約更新:document,車検:car,点検:wrench,免許更新:card,給油:gaspump,洗車:car,タイヤ交換:car,引っ越し:box,内見:house,
      役所:bank,市役所:bank,郵便局:envelope,修理:wrench,業者:wrench,点検日:wrench,水やり:plant,衣替え:hanger,防災:helmet,電池交換:battery,フィルター掃除:broom,
      片付け:box,断捨離:box,模様替え:house,DIY:hammer,草むしり:plant,庭仕事:plant,ベランダ掃除:broom,窓拭き:broom,トイレ掃除:broom,お風呂掃除:bath,
      クリーニング:tshirt,クリーニング受取:tshirt,コインランドリー:tshirt,美容院予約:scissors,予約:calendar,返却:book,返却日:book,図書館:book,
      鍵:key,合鍵:key,管理人:person,回覧板:papers,町内会:people,ゴミ当番:trashbag,節約:coin,家計簿:memo,貯金:moneybag,ポイント:coin,セール:pricetag,特売:percent,クーポン:ticket`,
  },
  {
    id: 'health', name: '健康・美容', colors: ['#FFD6E3', '#FFE3EC', '#FFC9DA'],
    items: `病院:hospital,内科:stethoscope,歯医者:tooth,歯科検診:tooth,眼科:eye,耳鼻科:ear,皮膚科:cross,整形外科:cross,産婦人科:baby,小児科:baby,心療内科:bubble,
      検査:document,健康診断:stethoscope,人間ドック:hospital,予防接種:syringe,インフル予防:syringe,薬:pill,薬受取:pill,処方箋:document,通院:hospital,入院:bed,退院:door,手術:cross,
      リハビリ:runner,整体:person,マッサージ:person,鍼灸:person,カイロ:person,
      美容院:scissors,カット:scissors,カラー:palette,パーマ:scissors,トリートメント:drop,ネイル:nail,まつげ:eye,眉:eye,エステ:sparkle,脱毛:sparkle,美容皮膚科:sparkle,
      コンタクト:eye,メガネ:glasses,体重測定:scale,体調不良:mask,発熱:thermometer,頭痛:sad,腹痛:sad,風邪:mask,休養:bed,早寝:moon,
      サプリ:pill,プロテイン:dumbbell,禁酒:ban,禁煙:ban,断食:ban,デトックス:drop,水分補給:drop,ストレッチ:yoga,
      生理:drop,生理予定:drop,排卵日:drop,基礎体温:thermometer,婦人科:cross,妊婦健診:baby,
      献血:drop,歯磨き指導:tooth,矯正:tooth,ホワイトニング:tooth,セルフケア:heart,日焼け止め:sun,マスク:mask`,
  },
  {
    id: 'sport', name: '運動', colors: ['#C7F0EE', '#D9F5F3', '#B8EAE7'],
    items: `ジム:dumbbell,筋トレ:dumbbell,ランニング:runner,ジョギング:runner,ウォーキング:footprints,散歩:footprints,ヨガ:yoga,ピラティス:yoga,ストレッチ:yoga,
      水泳:pool,サッカー:soccer,フットサル:soccer,野球:baseball,ソフトボール:baseball,バスケ:basketball,バレー:soccer,テニス:racket,バドミントン:racket,卓球:racket,
      ゴルフ:golf,打ちっぱなし:golf,登山:mountain,ハイキング:mountain,トレッキング:mountain,サイクリング:bicycle,自転車:bicycle,スキー:ski,スノボ:ski,スケート:shoe,
      ダンス:note,空手:dogi,柔道:dogi,剣道:shinai,合気道:dogi,ボクシング:dumbbell,ボルダリング:mountain,クライミング:mountain,
      釣り:fish,キャンプ:tent,体操:yoga,ラジオ体操:sun,マラソン:runner,駅伝:runner,大会:trophy,試合:soccer,練習:megaphone,レッスン:board,
      陸上:runner,水泳教室:pool,体育:shoe,サーフィン:sea,ダイビング:sea,乗馬:footprints,スケボー:shoe,ボウリング:bowling,ビリヤード:target,ダーツ:target,
      筋肉痛:dumbbell,休養日:bed,体重:scale,記録:memo`,
  },
  {
    id: 'hobby', name: '趣味・おでかけ', colors: ['#E6D4FF', '#EFE3FF', '#DCC6FF'],
    items: `映画:film,ライブ:penlight,コンサート:note,フェス:bunting,舞台:mic,観劇:ticket,ミュージカル:mic,美術館:palette,博物館:bank,水族館:fish,動物園:paw,植物園:plant,
      遊園地:ferris,テーマパーク:ferris,カラオケ:mic,ボウリング:bowling,ゲーセン:controller,ゲーム:controller,配信:tv,アニメ:tv,ドラマ:tv,
      漫画:book,読書:book,図書館:book,本屋:book,新刊:book,発売日:box,予約:calendar,抽選:ticket,当選:trophy,落選:sad,
      推し活:penlight,握手会:handshake,サイン会:pencil,イベント:bunting,オフ会:people,聖地巡礼:pin,グッズ:bag,物販:bag,
      旅行:suitcase,温泉:bath,ドライブ:car,日帰り:car,帰省:house,ツーリング:motorbike,花見:sakura,花火:fireworks,祭り:lantern,紅葉狩り:leaf,
      海:sea,プール:pool,BBQ:meat,ピクニック:tree,公園:tree,カフェ:coffee,ランチ:plate,ディナー:wine,外食:plate,焼肉:meat,寿司:sushi,ラーメン:noodles,
      スイーツ:cake,パン屋:bread,飲み会:beer,女子会:cocktail,買い物:bag,ショッピング:bag,アウトレット:pricetag,
      写真:camera,撮影:camera,カメラ:camera,習い事:board,ピアノ:piano,ギター:guitar,音楽:note,バンド練習:guitar,料理教室:pot,お菓子作り:cookie,
      手芸:yarn,編み物:yarn,園芸:plant,DIY:hammer,プラモ:palette,絵:palette,イラスト:pencil,ボドゲ:controller,麻雀:controller,
      競馬:footprints,パチンコ:coin,スロット:coin,宝くじ:ticket,釣り:fish,キャンプ:tent,サウナ:bath,銭湯:bath,スパ:bath,マッサージ:person,
      散歩:footprints,夜景:moon,星空:star,天体観測:moon,ネカフェ:laptop,配信視聴:tv`,
  },
  {
    id: 'people', name: '人・イベント', colors: ['#FFF0BF', '#FFF6D6', '#FFEBAB'],
    items: `誕生日:cake,記念日:heart,結婚記念日:ring,付き合った日:heart,デート:heart,結婚式:ring,披露宴:cake,二次会:cocktail,前撮り:camera,入籍:document,
      法事:candle,お葬式:candle,お通夜:candle,お墓参り:grave,命日:candle,お見舞い:bouquet,
      来客:people,友達:people,家族:people,実家:house,義実家:house,親:elder,祖父母:elder,兄弟:people,いとこ:people,子ども:baby,赤ちゃん:baby,
      保育園:school,幼稚園:school,学童:school,送迎:car,お迎え:car,お見送り:footprints,参観:people,発表会:mic,お遊戯会:mic,運動会:bunting,
      七五三:kimono,お宮参り:torii,お食い初め:plate,初節句:koinobori,百日祝い:cake,1歳:cake,ハーフバースデー:cake,成人式:kimono,還暦:cake,
      同窓会:people,クラス会:people,同期会:beer,合コン:cocktail,婚活:heart,お見合い:people,電話:handset,LINE:bubble,連絡:bubble,返信:envelope,手紙:envelope,
      プレゼント:gift,お礼:gift,お返し:gift,お祝い:gift,ご祝儀:envelope,お年玉:envelope,お中元:gift,お歳暮:gift,
      お泊まり:house,ホームパーティ:cake,パーティー:bunting,女子会:cocktail,ママ友:people,パパ友:people,近所:house,ご近所付き合い:people,
      面会:people,訪問:footprints,待ち合わせ:pin,集合:pin,解散:footprints,引っ越し祝い:gift,出産祝い:baby,快気祝い:gift,内祝い:gift,
      ペア:heart,片思い:love,仲直り:handshake,ケンカ:angry,寂しい:sad,会いたい:heart`,
  },
  {
    id: 'season', name: '季節・行事', colors: ['#FFDAD6', '#FFE7E4', '#FFCFC9'],
    items: `正月:mochi,元日:sun,初詣:torii,三が日:mochi,仕事始め:briefcase,成人の日:kimono,鏡開き:mochi,節分:beans,立春:sakura,バレンタイン:chocolate,
      ひな祭り:kimono,ホワイトデー:candy,春分:flower,卒業:gradcap,入学:school,お花見:sakura,エイプリルフール:laugh,GW:sun,昭和の日:flag,憲法記念日:flag,みどりの日:tree,
      こどもの日:koinobori,母の日:carnation,父の日:necktie,衣替え:hanger,梅雨入り:umbrella,梅雨明け:sun,七夕:bamboo,海の日:sea,土用の丑:fish,お盆:candle,
      山の日:mountain,夏祭り:lantern,花火大会:fireworks,盆踊り:lantern,帰省:house,夏休み:sun,残暑:sun,防災の日:helmet,敬老の日:elder,秋分:leaf,十五夜:moon,
      スポーツの日:runner,ハロウィン:pumpkin,文化の日:palette,七五三:kimono,紅葉:leaf,勤労感謝:briefcase,ブラックフライデー:pricetag,
      クリスマス:xmastree,イブ:xmastree,大晦日:moon,年末:broom,年始:mochi,忘年会:beer,新年会:sake,年賀状:envelope,大掃除:broom,お歳暮:gift,お中元:gift,
      立夏:sun,立秋:leaf,立冬:snow,冬至:moon,夏至:sun,初雪:snow,桜開花:sakura,満開:sakura,梅:flower,新緑:tree,
      ボーナス:moneybag,セール:pricetag,福袋:bag,初売り:pricetag,年度末:calendar,新年度:calendar,祝日:flag,振替休日:calendar,連休:sun,三連休:sun`,
  },
  {
    id: 'food', name: '食べ物', colors: ['#FFE3D4', '#FFEDE3', '#FFD8C4'],
    items: `朝ごはん:bread,昼ごはん:plate,夜ごはん:plate,お弁当:bento,外食:plate,パン:bread,おにぎり:riceball,ラーメン:noodles,うどん:noodles,そば:noodles,パスタ:noodles,
      カレー:curry,寿司:sushi,焼肉:meat,ステーキ:meat,鍋:pot,おでん:pot,ピザ:pizza,ハンバーガー:burger,唐揚げ:meat,餃子:bowl,お好み焼き:plate,たこ焼き:dango,
      刺身:sushi,丼:bowl,定食:tray,サラダ:salad,スープ:pot,ケーキ:cake,アイス:icecream,プリン:pudding,和菓子:dango,チョコ:chocolate,クッキー:cookie,ドーナツ:cookie,
      コーヒー:coffee,紅茶:tea,お茶:tea,ジュース:juice,タピオカ:juice,ビール:beer,ワイン:wine,日本酒:sake,カクテル:cocktail,ハイボール:beer,
      お菓子:candy,果物:apple,野菜:carrot,デザート:cake,スイーツ:cake,パフェ:icecream,かき氷:icecream,クレープ:icecream,
      食べ放題:plate,飲み放題:beer,テイクアウト:bag,デリバリー:box,ピザ注文:pizza,コンビニ:bag,スーパー:cart,弁当作り:bento,自炊:pot,作り置き:pot,
      食事会:plate,ランチ会:plate,ディナー:wine,女子会:cocktail,飲み会:beer,カフェ:coffee,喫茶店:coffee,おやつ:cookie,間食禁止:ban,ダイエット:salad,チートデイ:burger`,
  },
  {
    id: 'move', name: '移動', colors: ['#D9E8FF', '#E6F0FF', '#CCE0FF'],
    items: `電車:train,新幹線:shinkansen,バス:bus,車:car,タクシー:taxi,自転車:bicycle,バイク:motorbike,飛行機:plane,船:ship,フェリー:ship,徒歩:footprints,
      空港:plane,駅:train,出発:footprints,到着:pin,帰宅:house,外出:footprints,送迎:car,駐車場:parking,高速:car,渋滞:car,レンタカー:car,
      チェックイン:suitcase,チェックアウト:suitcase,ホテル:bed,搭乗:plane,乗換:swap,終電:moon,始発:sun,定期更新:card,ICチャージ:card,
      ガソリン:gaspump,洗車:car,車検:car,カーナビ:pin,地図:pin,集合場所:pin,道順:footprints,遅延:clock,運休:ban,欠航:ban`,
  },
  {
    id: 'pet', name: 'ペット', colors: ['#F2E6D8', '#F8EFE5', '#EDDCC8'],
    items: `犬:dog,猫:cat,散歩:paw,トリミング:scissors,動物病院:hospital,ワクチン:syringe,フィラリア:pill,ノミダニ:pill,餌購入:bag,フード:bowl,
      水換え:drop,ケージ掃除:broom,トイレ掃除:broom,爪切り:scissors,シャンプー:bath,ペットホテル:bed,ペットシッター:person,
      魚:fish,鳥:bird,ハムスター:hamster,うさぎ:rabbit,爬虫類:lizard,インコ:bird,金魚:fish,メダカ:fish,
      誕生日:cake,お迎え記念日:heart,健康診断:stethoscope,去勢手術:cross,避妊手術:cross,薬:pill,通院:hospital,ドッグラン:paw,しつけ教室:board,
      おやつ:cookie,おもちゃ:controller,グッズ:bag,写真:camera,ブラッシング:paw,お散歩コース:footprints`,
  },
  {
    id: 'mark', name: '気分・マーク', colors: ['#FFF5C2', '#FFF9DB', '#FFF0A8'],
    items: `晴れ:sun!,曇り:cloud!,雨:rain!,雪:snow!,雷:thunder!,風:wind!,暑い:sun,寒い:snow,虹:rainbow!,
      うれしい:smile!,楽しい:laugh!,幸せ:love!,泣く:sad!,怒る:angry!,疲れた:tired!,眠い:sleepy!,元気:laugh,普通:neutral!,がんばる:runner,ドキドキ:love,
      ハート:heart!,失恋:brokenheart!,キラキラ:sparkle!,星:star!,月:moon!,花:flower!,音符:note!,
      びっくり:exclaim!,はてな:question!,重要:exclaim,大事:exclaim,注意:exclaim,禁止:ban,OK:maru,NG:batsu,完了:check,チェック:check!,済:check,
      未定:question,仮:memo,予定:calendar,変更:swap,中止:batsu,延期:hourglass,休み:sun,休日:sun,祝日:flag,休業:ban,定休日:ban,記念:medal,
      〆切:hourglass,急ぎ:exclaim,要確認:question,要連絡:handset,予約済:check,メモ:memo,TODO:notebook,やること:notebook,買う:cart,返す:swap,借りる:book,
      送る:box,受取:box,支払:bill,入金:moneybag,出金:bill,給料:moneybag,ポイント:coin,セール:pricetag,特売:percent,割引:percent,クーポン:ticket,
      ラッキー:sparkle,目標:target,達成:trophy,勝ち:trophy,負け:sad,ゴール:flag,スタート:flag,ごほうび:gift,自分時間:coffee,のんびり:tea,ひとり:person,
      朝活:sun,夜更かし:moon,早起き:sun,寝坊:sleepy,二度寝:sleepy,サボり:tired,全力:laugh,やる気:sparkle,モヤモヤ:cloud,スッキリ:sparkle,
      おめでとう:bunting,ありがとう:heart,ごめんね:sad,がんばった:medal,よくできました:maru,はなまる:maru,100点:medal,一位:trophy`,
  },
];

function parse(cat) {
  const items = [];
  const seen = new Set();
  for (const raw of cat.items.split(',')) {
    const s = raw.trim();
    if (!s) continue;
    const noLabel = s.endsWith('!');
    const [label, motif] = s.replace(/!$/, '').split(':');
    if (seen.has(label)) continue; // 同じカテゴリ内の重複はスキップ
    seen.add(label);
    if (!MOTIFS[motif]) throw new Error(`モチーフが見つかりません: ${motif} (${cat.id}/${label})`);
    items.push({ id: `${cat.id}/${label}`, label, motif, cat: cat.id, showLabel: !noLabel });
  }
  return { id: cat.id, name: cat.name, colors: cat.colors, items };
}

export const CATEGORIES = RAW.map(parse);

export const STAMPS = Object.fromEntries(CATEGORIES.flatMap((c) => c.items.map((s) => [s.id, s])));

export const CATEGORY_BY_ID = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));

export const STAMP_COUNT = Object.keys(STAMPS).length;

export const DEFAULT_STAMP_ID = CATEGORIES[0].items[0].id;

// ラベルの部分一致で検索
export function searchStamps(q) {
  const s = q.trim();
  if (!s) return [];
  return Object.values(STAMPS).filter((st) => st.label.includes(s));
}
