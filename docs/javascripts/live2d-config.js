// Live2D Widget Configuration
window.live2d_settings = {
    // CDNパス設定
    "cdnPath": "https://fastly.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/",
    
    // API設定 (一言API、使わない場合は空文字)
    "apiPath": "",
    
    // ウィジェット設定
    "waifuSize": "280x250",    // キャラクターサイズ
    "waifuTipsSize": "250x70", // 吹き出しサイズ
    "waifuFontSize": "12px",   // フォントサイズ
    "waifuToolFont": "14px",   // ツールチップフォントサイズ
    "waifuToolLine": "20px",   // ツールチップ行高
    "waifuToolTop": "-60px",   // ツールチップ位置
    "waifuMinWidth": "768px",  // 最小表示幅（スマホ非表示）
    "waifuDraggable": "axis-x", // ドラッグ可能設定
    "waifuDraggableRevert": true, // ドラッグ後の復帰
    
    // モデル設定 - 猫モデル直接指定
    "modelAPI": "https://unpkg.com/live2d-widget-model-tororo@1.0.5/assets/tororo.model.json",
    "modelStorage": false,  // キャッシュ無効化で確実に変更
    "modelRandMode": "disabled",
    
    // メッセージ設定 - 猫キャラクター用にカスタマイズ
    "waifuWelcomeMessage": {
        "referrer": "にゃーん！他のサイトから来てくれたんですね！",
        "homepage": "技術ノートサイトへようこそ！白猫のTororoです！",
        "console": "にゃ？デベロッパーツールを覗いているんですね！",
        "copy": "何かをコピーしましたね？出典を忘れずに～にゃん！",
        "visibilitychange": "おかえりなさい！待ってましたにゃ～"
    },
    
    // ホバーメッセージ - 猫らしい表現に変更
    "waifuTips": {
        "mouseover[data-md-toggle=drawer]": [
            "にゃ？メニューを開くんですか？",
            "ナビゲーションはここから操作できますにゃ～"
        ],
        "click[data-md-toggle=search]": [
            "検索機能ですね！何を探してるにゃ？",
            "お手伝いできることがあれば言ってくださいにゃん"
        ],
        "mouseover.md-header__title": [
            "ここは技術ノートサイトですにゃ！",
            "インフラやAI開発の情報がいっぱいにゃん♪"
        ],
        "click.md-nav__link": [
            "その記事、気になりますにゃ～",
            "勉強がんばってくださいにゃん！"
        ],
        "copy": [
            "コードをコピーしましたにゃ！",
            "使う時は出典を忘れずににゃ～",
            "役に立ちそうですかにゃ？"
        ],
        "mouseover.grid.cards": [
            "便利な機能がカード形式で紹介されてますにゃ",
            "気になるものはクリックしてみてくださいにゃん"
        ],
        "clickcode": [
            "コードブロックですにゃ！実行時は注意してくださいにゃ",
            "このコマンド、使えそうですかにゃ？"
        ],
        "mouseover.admonition": [
            "重要な情報ボックスですにゃ！",
            "見落とさないでくださいにゃん"
        ]
    },
    
    // アイドルメッセージ - 猫らしく変更
    "waifuIdleMessage": {
        "message": [
            "何かお手伝いできることはありますかにゃ？",
            "技術学習、がんばってくださいにゃん！",
            "新しい知識を発見しましたかにゃ？",
            "質問があれば、検索機能を使ってみてくださいにゃ",
            "このサイトでスキルアップしていきましょうにゃん！",
            "*耳をかきかき* 今日も一日お疲れ様ですにゃ",
            "*足をぺろぺろ* 休憩も大切ですよにゃ～"
        ],
        "timeout": 8000
    },
    
    // 時間帯別メッセージ - 猫らしく変更
    "waifuTimeMessage": {
        "morning": ["おはようございますにゃん！今日も学習がんばりましょうにゃ！"],
        "afternoon": ["お疲れ様ですにゃ！午後の学習はいかがですかにゃ？"],
        "evening": ["お疲れ様でしたにゃん！今日の学習成果はいかがでしたかにゃ？"],
        "night": ["夜遅くまでお疲れ様ですにゃ！体調管理も大切ですよにゃん"],
        "midnight": ["夜更かしは体に毒ですよにゃ！明日もがんばりましょうにゃん"]
    },
    
    // モデル切り替えメッセージ - Tororo/Hijiki切り替え
    "waifuModelMessage": [
        "白猫のTororoに変身ですにゃ～",
        "黒猫のHijikiになりましたにゃん！",
        "今度はどっちの猫が気に入りましたかにゃ？",
        "気分転換に猫を変えてみましたにゃ～"
    ],
    
    // クリック時のランダムメッセージ - 猫らしく変更
    "waifuClickMessage": [
        "にゃ？何か用事ですかにゃ？",
        "お疲れ様ですにゃん！",
        "質問はありませんかにゃ？",
        "頑張って学習してくださいにゃん！",
        "何かお手伝いできることがあれば言ってくださいにゃ",
        "*ゴロゴロ* 撫でてくれるんですかにゃ？",
        "*耳をピクピク* 呼びましたかにゃ？"
    ]
};

// ページロード後に設定を適用
document.addEventListener('DOMContentLoaded', function() {
    // スマートフォンでは非表示にする
    if (window.innerWidth < 768) {
        return;
    }
    
    // ブラウザキャッシュクリア強制
    if ('caches' in window) {
        caches.keys().then(function(names) {
            names.forEach(function(name) {
                caches.delete(name);
            });
        });
    }
    
    // LocalStorage内のLive2Dデータをクリア
    Object.keys(localStorage).forEach(function(key) {
        if (key.includes('live2d') || key.includes('waifu')) {
            localStorage.removeItem(key);
        }
    });
    
    console.log('Live2D Widget loading with cache cleared...');
});