# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🚀 Quick Start

**必須**: [Article Creation Workflow](./workflows/article-creation-checklist.md) に従い、TodoWriteでタスク管理してください。

## 📋 Core Rules (絶対厳守)

1. **手動更新日時禁止** - 全て `mkdocs-git-revision-date-localized-plugin` に統一
2. **YAML Escaping** - GitHub Actions変数は `{% raw %}{{ }}{% endraw %}` で必ずエスケープ
3. **Live Site Check** - WebFetchで記事URLの実際の表示を必ず確認
4. **TodoWrite必須** - 全作業をTodoWriteでタスク化して進捗管理

## 🏗️ Repository Architecture

### Content Organization
- `docs/` - All markdown content organized by category
- `workflows/` - Detailed procedural guidelines  
- `templates/` - Reusable templates for articles and tasks
- `mkdocs.yml` - Navigation structure with emoji-based categorization

### Deployment Flow
- **Source**: `master` branch → **Build**: GitHub Actions → **Live**: https://smartscope.blog/

### Key Features
- Automatic article discovery in recent updates
- Git-based revision dates
- Multi-language support (Japanese/English)
- Integrated search with Japanese language support

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
- 🤖 AI開発 (AI Development)
- 💻 プログラミング (Programming)
- 🛠️ ツール・Tips (Tools & Tips)
- 🚀 SEO実践ガイド (SEO Practical Guide)

## ⚡ Dependencies

- `mkdocs-material` - Main theme and functionality
- `mkdocs-git-revision-date-localized-plugin` - Automatic page timestamps
- `mkdocs-minify-plugin` - HTML/CSS/JS compression
- `mkdocs-static-i18n` - Multilingual site support

---

**Important**: Always start and end your work by updating TodoWrite to track progress and ensure nothing is missed.