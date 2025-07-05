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
    
    // モデル設定
    "modelAPI": "https://fastly.jsdelivr.net/gh/fghrsh/live2d_api@gh-pages/",
    "modelTexturesID": 0,  // テクスチャID
    "modelStorage": true,  // モデル記憶
    "modelRandMode": "switch", // ランダムモード
    
    // メッセージ設定
    "waifuWelcomeMessage": {
        "referrer": "こんにちは！リンクから来てくださったんですね。",
        "homepage": "技術ノートサイトへようこそ！",
        "console": "こんにちは！デベロッパーツールを開いているんですね。",
        "copy": "何かをコピーしましたね？引用元を忘れずに！",
        "visibilitychange": "おかえりなさい！"
    },
    
    // ホバーメッセージ
    "waifuTips": {
        "mouseover[data-md-toggle=drawer]": [
            "メニューを開こうとしていますね！",
            "ナビゲーションはここから操作できます"
        ],
        "click[data-md-toggle=search]": [
            "検索機能を使ってくださいね！",
            "何かお探しですか？"
        ],
        "mouseover.md-header__title": [
            "これは技術ノートサイトです！",
            "インフラやAI開発の情報がたくさんありますよ"
        ],
        "click.md-nav__link": [
            "その記事、面白そうですね！",
            "学習がんばってください！"
        ],
        "copy": [
            "コードをコピーしましたね！",
            "使用する際は、出典を忘れずに",
            "役立つ情報だったでしょうか？"
        ],
        "mouseover.grid.cards": [
            "便利な機能がカード形式で紹介されています",
            "気になるものはクリックしてみてください"
        ],
        "clickcode": [
            "コードブロックですね！実行時は注意してください",
            "このコマンド、使えそうですか？"
        ],
        "mouseover.admonition": [
            "重要な情報ボックスです！",
            "見落とさないでくださいね"
        ]
    },
    
    // アイドルメッセージ
    "waifuIdleMessage": {
        "message": [
            "何かお手伝いできることはありますか？",
            "技術学習、がんばってくださいね！",
            "新しい知識を発見しましたか？",
            "質問があれば、検索機能を使ってみてください",
            "このサイトでスキルアップしていきましょう！"
        ],
        "timeout": 6000
    },
    
    // 時間帯別メッセージ
    "waifuTimeMessage": {
        "morning": ["おはようございます！今日も学習がんばりましょう！"],
        "afternoon": ["お疲れ様です！午後の学習はいかがですか？"],
        "evening": ["お疲れ様でした！今日の学習成果はいかがでしたか？"],
        "night": ["夜遅くまでお疲れ様です！体調管理も大切ですよ"],
        "midnight": ["夜更かしは体に毒ですよ！明日もがんばりましょう"]
    },
    
    // モデル切り替えメッセージ
    "waifuModelMessage": [
        "新しい衣装はどうですか？",
        "イメージチェンジしてみました！",
        "この見た目はいかがでしょう？",
        "気分転換にモデルを変えてみました"
    ],
    
    // クリック時のランダムメッセージ
    "waifuClickMessage": [
        "何か用事ですか？",
        "お疲れ様です！",
        "質問はありませんか？",
        "頑張って学習してくださいね！",
        "何かお手伝いできることがあれば言ってください"
    ]
};

// ページロード後に設定を適用
document.addEventListener('DOMContentLoaded', function() {
    // スマートフォンでは非表示にする
    if (window.innerWidth < 768) {
        return;
    }
    
    console.log('Live2D Widget loading...');
});