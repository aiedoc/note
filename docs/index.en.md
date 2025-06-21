# Technical Notes & Documentation Collection

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

!!! tip "About This Site"
    A systematically organized knowledge base of technical notes and documentation. Covers a wide range of technical fields including infrastructure operations, programming, and development tools.

## Quick Access

<div class="homepage-grid">
  <div class="homepage-card quick-access">
    <h3>🔥 Popular Content</h3>
    <ul>
      <li><a href="./AI/claude-code-best-practices.en.md">Claude Code Best Practices</a></li>
      <li><a href="./Tips/Mkdocs/mkdocsを使ったGitHubPages.en.md">Creating GitHub Pages</a></li>
      <li><a href="./AI/ai-development-tools.en.md">2025 AI Development Tools Comparison</a></li>
      <li><a href="./Tips/Mkdocs/デザイン改善ガイド.en.md">Site Design Improvement Guide</a></li>
    </ul>
  </div>

  <div class="homepage-card">
    <h3>📚 Learning & Information</h3>
    <ul>
      <li><a href="./Info/気になったニュース.en.md">📰 News & Trends</a></li>
      <li><a href="./Info/英語.en.md">🌍 English Learning Resources</a></li>
      <li><a href="./Info/リンク集.en.md">🔗 Reference Links</a></li>
    </ul>
  </div>

  <div class="homepage-card">
    <h3>🖥️ Infrastructure & Operations</h3>
    <ul>
      <li><a href="./Infrastructure/OSコマンド/OSの確認.en.md">OS Environment Check</a></li>
      <li><a href="./Infrastructure/OSコマンド/DNS設定.en.md">DNS Configuration</a></li>
      <li><a href="./Infrastructure/OSコマンド/SELinux.en.md">SELinux Settings</a></li>
      <li><a href="./Infrastructure/OSコマンド/sedコマンドメモ.en.md">Sed Command Usage</a></li>
    </ul>
  </div>

  <div class="homepage-card">
    <h3>🤖 AI Development</h3>
    <ul>
      <li><a href="./AI/claude-code-best-practices.en.md">Claude Code Best Practices</a></li>
      <li><a href="./AI/ai-development-tools.en.md">AI Development Tools Comparison 2025</a></li>
      <li><a href="./AI/llm-programming-guide.en.md">LLM Programming Practice</a></li>
      <li><a href="./AI/agentic-ai-development.en.md">Agentic AI Development</a></li>
    </ul>
  </div>

  <div class="homepage-card">
    <h3>💻 Programming</h3>
    <ul>
      <li><a href="./Programming/Bash/sample.sh">Bash Script Examples</a></li>
      <li><a href="./Tips/git ignoreで特定ディレクトリを管理対象外にする.en.md">Git Configuration & Operations</a></li>
    </ul>
    <p><em>More content in this field coming soon</em></p>
  </div>

  <div class="homepage-card">
    <h3>🛠️ Development Tools & Tips</h3>
    <ul>
      <li><a href="./Tips/Mkdocs/mkdocsメモ.en.md">MkDocs Basic Configuration</a></li>
      <li><a href="./Tips/Mkdocs/高度な設定.en.md">Advanced Site Features</a></li>
      <li><a href="./Tips/Mkdocs/アナリティクス設定.en.md">Analytics Configuration</a></li>
    </ul>
  </div>

  <div class="homepage-card external-links">
    <h3>🌐 Daily Information Sources</h3>
    <ul>
      <li><a href="https://menthas.com/" target="_blank">menthas - News for Programmers</a></li>
      <li><a href="https://qiita.com/" target="_blank">Qiita - Programming Knowledge</a></li>
      <li><a href="https://gigazine.net/" target="_blank">GIGAZINE - Tech News</a></li>
      <li><a href="https://kiwi-english.net/list-of-articles" target="_blank">Daily English Life</a></li>
      <li><a href="https://www.server-world.info/" target="_blank">Server World - Server Construction</a></li>
      <li><a href="https://japan.zdnet.com/paper/" target="_blank">ZDNet Japan - Enterprise IT</a></li>
    </ul>
  </div>
</div>

---

## Site Search Tips

- **Keyword Search**: Use the search box at the top for technical terms or command names
- **Browse by Category**: Select your area of interest from the left sidebar
- **Recent Updates**: Update timestamps shown at the bottom of each page

!!! note "Content Enhancement"
    This site is continuously updated and improved. If you have new content or improvement suggestions, please create an Issue on [GitHub](https://github.com/aiedoc/note).

## Daily Update Sites

- [menthas](https://menthas.com/) : News curation service for programmers
- [GIGAZINE](http://gigazine.net/) : IT news site providing useful information for daily life
- [Daily English Life](https://kiwi-english.net/list-of-articles) : Quick 3-minute English columns every morning
- [Qiita Trends](https://qiita.com/) : Programming knowledge community
- [Server World](https://www.server-world.info/) : Network server construction
- [Hatena Blog](http://hatenablog.com/) : Write about your daily thoughts and feelings
- [GIZMODO JAPAN](https://www.gizmodo.jp/articles/) : Technology media covering latest tech and digital society
- [ZDNet Japan](https://japan.zdnet.com/paper/) : Providing hints for IT-based problem solving and value creation for CIOs and IT departments
- [Japan cnet](https://japan.cnet.com/archives/) : Technology & business media site with columns, interviews, and blogs by opinion leaders
- [THE BRIDGE](http://thebridge.jp/) : Blog media covering technology & startup topics, "connecting entrepreneurs and investors"
- [NewSphere](https://newsphere.jp/) : Media delivering international perspectives, values, and intelligence to millennials connected with the world
- [IT media](http://www.itmedia.co.jp/news/) : Technology news and breaking news with reviews and features
- [Cloud Watch](https://cloud.watch.impress.co.jp/) : Latest news on enterprise IT and cloud solutions