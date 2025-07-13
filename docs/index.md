# 技術ノート・ドキュメント集

<style>
/* 全体のレイアウト */
.homepage-grid {
  display: grid !important;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)) !important;
  gap: 1.5rem !important;
  margin-bottom: 2rem !important;
}

/* カードスタイル */
.homepage-card {
  background: var(--md-default-bg-color) !important;
  border: 1px solid var(--md-default-fg-color--light) !important;
  border-radius: 12px !important;
  padding: 1.5rem !important;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1) !important;
  transition: transform 0.2s ease, box-shadow 0.2s ease !important;
}

.homepage-card:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 16px rgba(0,0,0,0.15) !important;
}

.homepage-card h3 {
  margin-top: 0 !important;
  color: var(--md-primary-fg-color) !important;
  border-bottom: 2px solid var(--md-primary-fg-color) !important;
  padding-bottom: 0.5rem !important;
}

/* リストスタイルをリセット */
.homepage-card ul {
  list-style: none !important;
  padding: 0 !important;
  display: block !important;
}

.homepage-card li {
  margin: 0.5rem 0 !important;
  padding: 0.3rem 0 !important;
  border-bottom: 1px solid var(--md-default-fg-color--lightest) !important;
}

.homepage-card li:last-child {
  border-bottom: none !important;
}

/* 特別セクション */
.quick-access {
  background: linear-gradient(135deg, var(--md-primary-fg-color--light), var(--md-accent-fg-color--transparent)) !important;
  border: none !important;
  color: var(--md-default-fg-color) !important;
}

.quick-access h3 {
  color: var(--md-default-fg-color) !important;
  border-bottom-color: var(--md-default-fg-color--light) !important;
}

.quick-access a {
  color: var(--md-default-fg-color) !important;
  text-decoration: underline !important;
}

/* 外部リンクセクション */
.external-links {
  grid-column: 1 / -1 !important;
  background: var(--md-code-bg-color) !important;
}

.external-links ul {
  display: grid !important;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)) !important;
  gap: 0.5rem !important;
}

.external-links li {
  background: var(--md-default-bg-color) !important;
  border-radius: 6px !important;
  padding: 0.5rem 0.8rem !important;
  border: 1px solid var(--md-default-fg-color--lightest) !important;
}

/* レスポンシブ */
@media (max-width: 768px) {
  .homepage-grid {
    grid-template-columns: 1fr !important;
  }
  
  .external-links ul {
    grid-template-columns: 1fr !important;
  }
}
</style>

!!! tip "このサイトについて"
    技術的なメモやドキュメントを体系的に整理したナレッジベースです。インフラ運用、プログラミング、開発ツールなど幅広い技術分野をカバーしています。

## 📝 最新記事

{{ blog_recent_posts(limit=5, lang="ja") }}

<div style="text-align: center; margin: 1rem 0;">
  <a href="./blog/" class="md-button md-button--primary">すべての記事を見る</a>
</div>

## クイックアクセス

<div class="homepage-grid">
  <div class="homepage-card quick-access">
    <h3>🔥 人気コンテンツ</h3>
    <ul>
      <li><a href="./AI/claude-code-best-practices/">Claude Code活用法</a></li>
      <li><a href="./Tips/Mkdocs/mkdocsを使ったGitHubPages/">GitHub Pages作成方法</a></li>
      <li><a href="./AI/ai-development-tools/">2025年AI開発ツール比較</a></li>
      <li><a href="./Tips/Mkdocs/デザイン改善ガイド/">サイトデザイン改善ガイド</a></li>
    </ul>
  </div>

  <div class="homepage-card">
    <h3>📚 学習・情報収集</h3>
    <ul>
      <li><a href="./Info/気になったニュース/">📰 ニュース・トレンド</a></li>
      <li><a href="./Info/英語/">🌍 英語学習リソース</a></li>
      <li><a href="./Info/リンク集/">🔗 参考サイト集</a></li>
    </ul>
  </div>

  <div class="homepage-card">
    <h3>🖥️ インフラ・運用</h3>
    <ul>
      <li><a href="./Infrastructure/OSコマンド/OSの確認/">OS環境確認</a></li>
      <li><a href="./Infrastructure/OSコマンド/DNS設定/">DNS設定</a></li>
      <li><a href="./Infrastructure/OSコマンド/SELinux/">SELinux設定</a></li>
      <li><a href="./Infrastructure/OSコマンド/sedコマンドメモ/">sedコマンド活用</a></li>
    </ul>
  </div>

  <div class="homepage-card">
    <h3>🤖 AI開発</h3>
    <ul>
      <li><a href="./AI/claude-code-best-practices/">Claude Code活用法</a></li>
      <li><a href="./AI/ai-development-tools/">2025年AI開発ツール比較</a></li>
      <li><a href="./AI/llm-programming-guide/">LLMプログラミング実践</a></li>
      <li><a href="./AI/agentic-ai-development/">エージェント型AI開発</a></li>
    </ul>
  </div>

  <div class="homepage-card">
    <h3>💻 プログラミング</h3>
    <ul>
      <li><a href="./Programming/Bash/sample.sh">Bashスクリプトサンプル</a></li>
      <li><a href="./Tips/git ignoreで特定ディレクトリを管理対象外にする/">Git設定・運用</a></li>
    </ul>
    <p><em>この分野のコンテンツを拡充予定です</em></p>
  </div>

  <div class="homepage-card">
    <h3>🛠️ 開発ツール・Tips</h3>
    <ul>
      <li><a href="./Tips/Mkdocs/mkdocsメモ/">MkDocsの基本設定</a></li>
      <li><a href="./Tips/Mkdocs/高度な設定/">サイト高度機能設定</a></li>
      <li><a href="./Tips/Mkdocs/アナリティクス設定/">アクセス解析設定</a></li>
    </ul>
  </div>

  <div class="homepage-card external-links">
    <h3>🌐 毎日チェックしたい情報源</h3>
    <ul>
      <li><a href="https://menthas.com/" target="_blank">menthas - プログラマ向けニュース</a></li>
      <li><a href="https://qiita.com/" target="_blank">Qiita - プログラミング情報</a></li>
      <li><a href="https://gigazine.net/" target="_blank">GIGAZINE - IT系ニュース</a></li>
      <li><a href="https://kiwi-english.net/list-of-articles" target="_blank">日刊英語ライフ</a></li>
      <li><a href="https://www.server-world.info/" target="_blank">Server World - サーバー構築</a></li>
      <li><a href="https://japan.zdnet.com/paper/" target="_blank">ZDNet Japan - 企業IT情報</a></li>
    </ul>
  </div>
</div>

---

## サイト内検索のコツ

- **キーワード検索**: 上部の検索ボックスで技術用語やコマンド名を検索
- **カテゴリ別探索**: 左サイドバーから興味のある分野を選択
- **最近の更新**: 各ページ下部に更新日時を表示

!!! note "コンテンツの充実化"
    このサイトは継続的に更新・改善されています。新しいコンテンツや改善提案があれば、[GitHub](https://github.com/aiedoc/note)でIssueを作成してください。

## 毎日更新系サイト

- [menthas](https://menthas.com/) : プログラマ向けニュースキュレーションサービス
- [GIGAZINE（ギガジン）](http://gigazine.net/) : 日々のあらゆるシーンで役立つ情報を提供するIT系ニュースサイト
- [日刊英語ライフ](https://kiwi-english.net/list-of-articles) : 毎朝たった3分でサクッと読める英語コラムサイト
- [Qiita トレンド](https://qiita.com/) : プログラミング情報のナレッジコミュニティ
- [Server World](https://www.server-world.info/) : ネットワークサーバー構築
- [はてなブログ](http://hatenablog.com/) : 日々の生活から感じたこと、考えたことを書き残しましょう
- [GIZMODO JAPAN](https://www.gizmodo.jp/articles/) : 最新テクノロジーやデジタル社会に関連するニュースを扱うテクノロジーメディアサイト
- [ZDNet Japan](https://japan.zdnet.com/paper/) : CIOや企業の情報システム部門に向けて、ITを活用した課題解決や価値創造のヒントを提供
- [Japan cnet](https://japan.cnet.com/archives/) : テクノロジー＆ビジネス情報のメディアサイト。オピニオンリーダーによるコラムやインタビュー、ブログなども掲載
- [THE BRIDGE](http://thebridge.jp/) : 「起業家と投資家を繋ぐ」テクノロジー＆スタートアップ関連の話題をお届けするブログメディア
- [NewSphere](https://newsphere.jp/) : 世界と繋がるミレニアル世代に向けて、国際的な視点・価値観・知性を届けるメディア
- [IT media](http://www.itmedia.co.jp/news/) : テクノロジー関連のニュース及び速報を中心に、レビューや特集記事を掲載
- [クラウド Watch](https://cloud.watch.impress.co.jp/) : 法人向けIT・クラウドソリューションの最新ニュース