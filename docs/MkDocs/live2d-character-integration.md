# MkDocsサイトにLive2Dキャラクターを追加する方法

!!! info "Live2Dキャラクター実装ガイド"
    無料のLive2Dウィジェットを使って、MkDocsサイトに動くキャラクターを追加する手順を詳しく解説します。
    
    完全無料で実装可能で、GitHub Pagesでも動作します。

## 実現できること

<div class="grid cards" markdown>

-   :material-account-heart: **キャラクターアシスタント**

    ---

    サイトに動くキャラクターが常駐し、訪問者をサポート

-   :material-message-text: **インタラクティブメッセージ**

    ---

    ホバーやクリックで状況に応じたメッセージを表示

-   :material-cellphone-off: **レスポンシブ対応**

    ---

    スマートフォンでは自動的に非表示

-   :material-palette: **カスタマイズ可能**

    ---

    メッセージ、サイズ、位置をカスタマイズ

</div>

## Live2Dウィジェットとは

Live2Dウィジェットは、Webサイトに2Dキャラクターアニメーションを追加できるJavaScriptライブラリです。

### 主な特徴
- **軽量**: 追加のプラグインなしで動作
- **無料**: MIT/GPL-3.0ライセンスで商用利用可能
- **簡単実装**: CDNから読み込むだけで使用可能
- **カスタマイズ性**: メッセージや動作を自由に設定

### 技術仕様
- **WebGL対応**: モダンブラウザで滑らかなアニメーション
- **ファイルサイズ**: 約150KB（圧縮済み）
- **対応ブラウザ**: Chrome, Firefox, Safari, Edge

## 実装手順

### 1. MkDocsの設定ファイル更新

`mkdocs.yml`にJavaScriptとCSSを追加：

```yaml
extra_css:
    - stylesheets/extra.css
    - stylesheets/live2d-custom.css

extra_javascript:
    - 'javascripts/extra.js'
    - 'javascripts/live2d-config.js'
    - https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS_HTML
    - https://fastly.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/autoload.js
```

### 2. 設定ファイルの作成

`docs/javascripts/live2d-config.js`を作成：

```javascript
// Live2D Widget Configuration
window.live2d_settings = {
    // CDNパス設定
    "cdnPath": "https://fastly.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/",
    
    // ウィジェット設定
    "waifuSize": "280x250",    // キャラクターサイズ
    "waifuMinWidth": "768px",  // 最小表示幅（スマホ非表示）
    "waifuDraggable": "axis-x", // ドラッグ可能設定
    
    // モデル設定
    "modelAPI": "https://fastly.jsdelivr.net/gh/fghrsh/live2d_api@gh-pages/",
    "modelStorage": true,  // モデル記憶
    "modelRandMode": "switch", // ランダムモード
    
    // メッセージ設定
    "waifuWelcomeMessage": {
        "homepage": "技術ノートサイトへようこそ！",
        "console": "デベロッパーツールを開いているんですね。",
        "copy": "何かをコピーしましたね？引用元を忘れずに！"
    },
    
    // ホバーメッセージ
    "waifuTips": {
        "mouseover[data-md-toggle=search]": [
            "検索機能を使ってくださいね！",
            "何かお探しですか？"
        ],
        "click.md-nav__link": [
            "その記事、面白そうですね！",
            "学習がんばってください！"
        ]
    }
};
```

### 3. カスタムスタイルの作成

`docs/stylesheets/live2d-custom.css`を作成：

```css
/* Live2D Widget Custom Styles */
#waifu {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 1000;
    transition: all 0.3s ease-in-out;
}

/* 吹き出しメッセージのスタイル */
#waifu-tips {
    position: absolute;
    top: -60px;
    left: 6px;
    color: #fff;
    background-color: rgba(51, 51, 51, 0.9);
    border-radius: 12px;
    font-size: 12px;
    line-height: 18px;
    padding: 8px 12px;
    max-width: 250px;
    min-height: 70px;
    text-align: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* スマートフォンでは非表示 */
@media screen and (max-width: 767px) {
    #waifu {
        display: none !important;
    }
}
```

### 4. メッセージファイルの作成（オプション）

`docs/assets/waifu-tips.json`でより詳細なメッセージ設定：

```json
{
  "mouseover [data-md-toggle=drawer]": [
    "メニューを開こうとしていますね！",
    "ナビゲーションメニューはここから操作できます"
  ],
  "click [data-md-toggle=search]": [
    "検索機能を使ってくださいね！",
    "何かお探しですか？"
  ],
  "copy": [
    "コードをコピーしましたね！",
    "使用する際は、出典を忘れずに",
    "役立つ情報だったでしょうか？"
  ],
  "idle": [
    "何かお手伝いできることはありますか？",
    "技術学習、がんばってくださいね！",
    "新しい知識を発見しましたか？"
  ]
}
```

## 高度なカスタマイズ

### キャラクターモデルの変更

```javascript
// 設定ファイルでモデルAPIを変更
"modelAPI": "https://your-custom-api.com/live2d/",

// 複数モデルのランダム切り替え
"modelRandMode": "switch",
"modelStorage": true
```

### ダークモード対応

```css
/* ダークモード時の吹き出しスタイル */
[data-md-color-scheme="slate"] #waifu-tips {
    background-color: rgba(45, 55, 72, 0.95);
    color: #e2e8f0;
    border: 1px solid rgba(255, 255, 255, 0.1);
}
```

### パフォーマンス最適化

```javascript
// ローディング最適化
document.addEventListener('DOMContentLoaded', function() {
    // スマートフォンでは読み込まない
    if (window.innerWidth < 768) {
        return;
    }
    
    // プリロード設定
    console.log('Live2D Widget loading...');
});
```

## トラブルシューティング

### よくある問題と解決方法

#### 1. キャラクターが表示されない
```javascript
// ブラウザの開発者ツールでエラーを確認
console.log('Live2D settings:', window.live2d_settings);

// CDNの接続確認
// https://fastly.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/
```

#### 2. メッセージが表示されない
```json
// CSS セレクタの確認
{
  "mouseover .correct-selector": ["メッセージ"],
  "click #correct-id": ["クリックメッセージ"]
}
```

#### 3. スマホで表示される
```css
/* CSS で確実に非表示 */
@media screen and (max-width: 767px) {
    #waifu {
        display: none !important;
    }
}
```

#### 4. サイトの表示速度が遅くなる
```javascript
// 遅延読み込みを追加
setTimeout(function() {
    // Live2D Widget の初期化
}, 1000);
```

## ライセンスと注意事項

### 使用ライセンス
- **Live2D Widget**: GPL-3.0（商用利用可能）
- **Live2D SDK**: 非商用無料、商用は要ライセンス
- **キャラクターモデル**: 各モデルのライセンスに従う

### 注意点
1. **パフォーマンス**: 低スペック端末では動作が重い場合がある
2. **アクセシビリティ**: 視覚障害者向けの配慮が必要
3. **プライバシー**: CDN使用時はプライバシーポリシーの更新を検討

## 🚀 高度なLive2D機能実装

### 時間帯・季節対応メッセージシステム

実際のサイト運用で効果的な、より高度なインタラクション機能の実装方法を解説します。

#### 時間帯別メッセージ機能

```javascript
// 時間帯別メッセージ取得関数
function getTimeBasedMessages() {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
        // 朝 (5-12時)
        return [
            "おはようございます！今日も勉強頑張るにゃ〜",
            "朝の時間は集中できるにゃ〜",
            "コーヒーでも飲みながら学習しましょ♪",
            "今日はどの技術について学ぼうかな？"
        ];
    } else if (hour >= 12 && hour < 17) {
        // 昼 (12-17時)
        return [
            "お昼休憩中ですか？軽く記事を読むのもいいにゃ〜",
            "午後の学習タイムだにゃ〜",
            "ランチ後の勉強は眠気に注意にゃ〜",
            "午後も頑張って学習しましょ！"
        ];
    } else if (hour >= 17 && hour < 22) {
        // 夕方〜夜 (17-22時)
        return [
            "お疲れ様でした〜一日の締めくくりに勉強にゃ〜",
            "夕方の時間を有効活用だにゃ〜",
            "今日学んだことを復習してみて♪",
            "夜の学習時間、始まりだにゃ〜"
        ];
    } else {
        // 深夜〜早朝 (22-5時)
        return [
            "夜更かしは体に良くないにゃ〜",
            "深夜の学習は適度にしてね",
            "たまには早く寝ることも大切だにゃ〜",
            "夜の静けさで集中できるけど、無理は禁物にゃ〜"
        ];
    }
}
```

#### 季節別メッセージ機能

```javascript
// 季節別メッセージ取得関数
function getSeasonalMessages() {
    const month = new Date().getMonth() + 1; // 1-12月
    
    if (month >= 3 && month <= 5) {
        // 春 (3-5月)
        return [
            "桜の季節だにゃ〜新しい技術を学ぼう！",
            "春は新しいことを始める季節にゃ〜",
            "暖かくなってきたにゃ〜勉強も快適♪",
            "新年度、スキルアップの季節だにゃ〜"
        ];
    } else if (month >= 6 && month <= 8) {
        // 夏 (6-8月)
        return [
            "暑い日は涼しい部屋で勉強だにゃ〜",
            "夏休みは集中して学習できるチャンスにゃ〜",
            "冷房の効いた部屋で快適に学習♪",
            "夏の間にスキルを伸ばそうにゃ〜"
        ];
    } else if (month >= 9 && month <= 11) {
        // 秋 (9-11月)
        return [
            "秋は読書の季節だにゃ〜",
            "涼しくなって集中しやすいにゃ〜",
            "秋の夜長は学習にぴったり♪",
            "紅葉を見ながらの勉強もいいにゃ〜"
        ];
    } else {
        // 冬 (12-2月)
        return [
            "寒い日は暖かい部屋でコーディング♪",
            "年末年始、新しいスキルを身につけよう！",
            "冬の間に基礎をしっかり固めるにゃ〜",
            "温かい飲み物と一緒に学習タイムにゃ〜"
        ];
    }
}
```

### サイト案内・ナビゲーション支援機能

#### ページ別ガイドメッセージ

```javascript
// サイト案内・ナビゲーション支援機能
function setupSiteNavigation() {
    console.log('🧭 Setting up site navigation features...');
    
    // 現在のページに応じたガイドメッセージ
    const currentPath = window.location.pathname;
    let categoryMessage = "";
    
    if (currentPath.includes('/AI/')) {
        categoryMessage = "AI開発の記事を見てるにゃ〜最新技術が満載だよ♪";
    } else if (currentPath.includes('/Tips/')) {
        categoryMessage = "開発効率化のTipsを確認中にゃ〜便利な情報がいっぱい！";
    } else if (currentPath.includes('/MkDocs/')) {
        categoryMessage = "MkDocsでサイト構築中にゃ〜素敵なサイトを作ろう♪";
    } else if (currentPath.includes('/Infrastructure/')) {
        categoryMessage = "インフラ関連の記事だにゃ〜運用のコツを学ぼう♪";
    } else if (currentPath.includes('/Info/')) {
        categoryMessage = "学習リソースを見てるにゃ〜情報収集は大切だよ♪";
    } else if (currentPath === '/' || currentPath === '/index.html') {
        categoryMessage = "ホームページにゃ〜どのカテゴリから見始めようかな？";
    }
    
    // カテゴリメッセージがある場合は少し遅れて表示
    if (categoryMessage) {
        setTimeout(() => {
            showCatMessage(categoryMessage);
        }, 8000); // 8秒後に表示
    }
}
```

#### 外部リンク警告機能

```javascript
// 外部リンクへの警告
document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (link && link.href && link.hostname !== window.location.hostname) {
        if (!link.hasAttribute('data-external-warned')) {
            e.preventDefault();
            showCatMessage("外部サイトに移動しますにゃ〜");
            link.setAttribute('data-external-warned', 'true');
            setTimeout(() => {
                window.open(link.href, link.target || '_blank');
            }, 1500);
            console.log('🔗 External link warning shown for:', link.href);
        }
    }
});
```

### 学習支援機能

#### 読書進捗追跡

```javascript
// 学習支援機能
function setupLearningSupport() {
    console.log('📚 Setting up learning support features...');
    
    let startTime = Date.now();
    let scrollProgress = 0;
    let hasScrolled = false;
    
    // ページ滞在時間の追跡
    function trackReadingTime() {
        const currentTime = Date.now();
        const timeSpent = Math.floor((currentTime - startTime) / 1000); // 秒単位
        
        // 3分経過
        if (timeSpent === 180 && !hasScrolled) {
            showCatMessage("じっくり読んでくれてありがとう♪理解できてる？");
        }
        // 5分経過
        else if (timeSpent === 300) {
            showCatMessage("5分も読んでくれてるにゃ〜勉強熱心だね！");
        }
        // 10分経過
        else if (timeSpent === 600) {
            showCatMessage("もう10分！集中してるにゃ〜素晴らしい♪");
        }
    }
    
    // スクロール進捗の追跡
    function trackScrollProgress() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const newProgress = Math.round((scrollTop / scrollHeight) * 100);
        
        if (newProgress > scrollProgress + 20) { // 20%ずつ
            scrollProgress = newProgress;
            hasScrolled = true;
            
            if (scrollProgress >= 50 && scrollProgress < 70) {
                showCatMessage("記事の半分まで読んだにゃ〜頑張って！");
            } else if (scrollProgress >= 90) {
                showCatMessage("最後まで読んでくれてありがとう♪他の記事もどうぞ〜");
            }
        }
    }
    
    // イベントリスナーの設定
    setInterval(trackReadingTime, 1000); // 1秒ごと
    window.addEventListener('scroll', trackScrollProgress);
}
```

#### ユーザーアクション検出

```javascript
// 高度なインタラクション検出
function setupAdvancedInteractions() {
    // コピー検出
    document.addEventListener('copy', () => {
        showCatMessage("コピーしたにゃ〜");
    });
    
    // 開発者ツール検出
    let devtools = { open: false };
    setInterval(() => {
        if (window.outerHeight - window.innerHeight > 160) {
            if (!devtools.open) {
                devtools.open = true;
                showCatMessage("にゃーん、開発者ツールを開いてるにゃ〜");
            }
        } else {
            devtools.open = false;
        }
    }, 1000);
    
    // ページ離脱・復帰検出
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            showCatMessage("おかえりなさい〜");
        }
    });
}
```

### 実装時のベストプラクティス

#### 1. パフォーマンス配慮

```javascript
// スマートフォンチェック
function isMobile() {
    const mobile = window.innerWidth < 768 || 
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    return mobile;
}

// モバイルでは機能を制限
if (!isMobile()) {
    initializeTororoCat();
    setupCatMessages();
    setupSiteNavigation();
    setupLearningSupport();
}
```

#### 2. デバッグ機能

```javascript
// デバッグ用のテスト関数
function testCatMessage(text = "テストメッセージだにゃ〜") {
    console.log('🧪 Testing cat message...');
    showCatMessage(text);
}

// システム情報表示
function debugInfo() {
    console.log('🔍 Debug Info:');
    console.log('- L2Dwidget loaded:', typeof L2Dwidget !== 'undefined');
    console.log('- Canvas elements:', document.querySelectorAll('canvas').length);
    console.log('- Screen size:', window.innerWidth + 'x' + window.innerHeight);
    console.log('- Is mobile:', isMobile());
    console.log('- Message styles loaded:', !!document.querySelector('#cat-message-styles'));
}

// グローバルテスト関数
window.testCatMessage = testCatMessage;
window.debugInfo = debugInfo;
```

#### 3. エラーハンドリング

```javascript
// 安全な初期化
function safeInitialize() {
    try {
        if (typeof L2Dwidget === 'undefined') {
            console.error('❌ L2Dwidget library not loaded!');
            return;
        }
        
        // 初期化処理
        initializeTororoCat();
        
    } catch (error) {
        console.error('❌ Live2D initialization failed:', error);
    }
}
```

### 実装チェックリスト

- [ ] **基本設定**: Tororoモデルの読み込み確認
- [ ] **時間帯メッセージ**: 朝昼夜のメッセージが切り替わる
- [ ] **季節メッセージ**: 春夏秋冬のメッセージが表示される
- [ ] **サイト案内**: ページ別ガイドが適切に動作
- [ ] **学習支援**: 滞在時間とスクロール進捗を追跡
- [ ] **モバイル対応**: スマートフォンでは非表示
- [ ] **デバッグ機能**: コンソールでテスト可能
- [ ] **エラーハンドリング**: 問題発生時も安全に動作

### トラブルシューティング

#### よくある問題

1. **メッセージが表示されない**
   - CSS競合を確認（z-index調整）
   - JavaScriptエラーをコンソールで確認

2. **時間帯判定が正しくない**
   - ブラウザのタイムゾーン設定を確認
   - サーバー時間とクライアント時間の差異

3. **モバイルで表示される**
   - CSS メディアクエリを追加
   - JavaScript の画面サイズ判定を強化

## GitHub Pagesでの運用

### GitHub Actionsでの自動デプロイ

```yaml
name: Deploy MkDocs with Live2D
on:
  push:
    branches: [ master ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Python
        uses: actions/setup-python@v2
        with:
          python-version: '3.x'
      - name: Install dependencies
        run: |
          pip install mkdocs-material
      - name: Build site
        run: mkdocs build
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${% raw %}{{ secrets.{% endraw %}GITHUB_TOKEN }}
          publish_dir: ./site
```

## パフォーマンス最適化

### ファイルサイズの削減
```javascript
// 必要な機能のみ読み込み
window.live2d_settings = {
    "cdnPath": "https://fastly.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/",
    "modelAPI": "", // 外部APIを使わない場合は空文字
    "waifuDraggable": false, // ドラッグ機能を無効化
    "modelRandMode": false, // ランダム機能を無効化
};
```

### キャッシュ活用
```html
<!-- Service Worker でキャッシュ -->
<script>
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
}
</script>
```

## まとめ

Live2Dウィジェットを使うことで、技術文書サイトに親しみやすさとインタラクティブ性を追加できます。

### 実装のポイント
1. **段階的導入**: 最小構成から始めて徐々にカスタマイズ
2. **パフォーマンス配慮**: スマホ非表示、遅延読み込みの活用
3. **ユーザビリティ**: 邪魔にならない配置とメッセージ設計
4. **保守性**: 設定ファイルを分離して管理しやすく

### 発展的な活用
- AI チャットボットとの連携
- 学習進捗の可視化
- 多言語対応メッセージ
- カスタムキャラクターモデルの作成

技術文書サイトでも、適切に実装すればユーザーエクスペリエンスの向上に貢献できる有用な機能です。

## 関連記事

- [MkDocsを使ったGitHub Pages作成方法](mkdocsを使ったGitHubPages.md)
- [デザイン改善ガイド](デザイン改善ガイド.md)
- [高度な設定](高度な設定.md)