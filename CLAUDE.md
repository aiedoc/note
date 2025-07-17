# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🚀 Quick Start

**必須**: [Article Creation Workflow](./workflows/article-creation-checklist.md) に従い、TodoWriteでタスク管理してください。

## 📋 Core Rules (絶対厳守)

1. **手動更新日時禁止** - 全て `mkdocs-git-revision-date-localized-plugin` に統一
2. **YAML Escaping** - GitHub Actions変数は `{% raw %}{{ }}{% endraw %}` で必ずエスケープ
3. **Live Site Check** - WebFetchで記事URLの実際の表示を必ず確認
4. **TodoWrite必須** - 全作業をTodoWriteでタスク化して進捗管理
5. **GitHub Actions自動化** - git pushで自動ビルド・デプロイ、main.pyも自動実行される

## 🏗️ Repository Architecture

### Content Organization
- `docs/` - All markdown content organized by category
- `workflows/` - Detailed procedural guidelines  
- `templates/` - Reusable templates for articles and tasks
- `mkdocs.yml` - Navigation structure with emoji-based categorization

### Deployment Flow
- **Source**: `master` branch → **GitHub Actions Auto-Deploy** → **Live**: https://smartscope.blog/
- **Triggers**: Push to master, docs/**, mkdocs.yml, custom_theme/** changes

### Key Features
- **Full Automation**: GitHub Actions handles build, main.py execution, and deployment
- **Git-based timestamps**: Automatic revision dates via plugin
- **Multi-language support**: Japanese/English with i18n plugin
- **Advanced Live2D**: Time-based messages and learning support
- **SEO Optimized**: Automatic sitemap, search indexing

## 📁 Detailed Guidelines

- [📋 Article Creation Checklist](./workflows/article-creation-checklist.md) - Step-by-step article creation process
- [🎯 SEO Optimization Guide](./workflows/seo-optimization.md) - SEO best practices and guidelines  
- [✅ Quality Assurance](./workflows/quality-assurance.md) - Pre-publication quality checks

## 🔧 Templates & Tools

- [📝 Article Template](./templates/article-template.md) - Standard article structure
- [📋 Todo Template](./templates/todo-template.json) - TodoWrite task templates
- [🚀 Common Commands](./workflows/common-commands.md) - Frequently used development commands

## 🎯 Navigation Structure

Follow the emoji-based categorization:
- 📚 学習・情報 (Learning & Information)
- 🖥️ インフラ・運用 (Infrastructure & Operations) 
- 🤖 AI開発・自動化 (AI Development & Automation)
- 📘 MkDocs・サイト構築 (MkDocs & Site Building)
- 🛠️ ツール・開発効率化 (Tools & Development Efficiency)

## ⚡ Dependencies

- `mkdocs-material` - Main theme and functionality
- `mkdocs-git-revision-date-localized-plugin` - Automatic page timestamps
- `mkdocs-minify-plugin` - HTML/CSS/JS compression
- `mkdocs-static-i18n` - Multilingual site support

---

**Important**: Always start and end your work by updating TodoWrite to track progress and ensure nothing is missed.