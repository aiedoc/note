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
          github_token: ${{ secrets.GITHUB_TOKEN }}
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