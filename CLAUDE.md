# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a technical documentation site built with MkDocs Material, published to GitHub Pages. The site serves as a comprehensive knowledge base covering infrastructure operations, programming, AI development tools, and development tips. Content is primarily in Japanese with English translations for key articles.

## Common Commands

### Local Development
```bash
# Install dependencies
pip install mkdocs-material mkdocs-git-revision-date-localized-plugin mkdocs-minify-plugin mkdocs-static-i18n

# Start local development server
mkdocs serve

# Build site locally (output to site/ directory)
mkdocs build

# Deploy to GitHub Pages manually (if needed)
mkdocs gh-deploy
```

### Content Management
```bash
# Add new article to navigation in mkdocs.yml
# Follow the existing hierarchical structure with emojis

# Test for broken links (if available)
pytest --check-links docs/

# Check markdown syntax (if available)  
markdownlint docs/**/*.md
```

## Architecture & Structure

### Content Organization
- `docs/` - All markdown content organized by category
  - `AI/` - AI development tools and best practices
  - `Infrastructure/` - System administration and DevOps content
  - `Tips/Mkdocs/` - Site building and MkDocs documentation
  - `SEO/` - Search engine optimization guides
  - `Programming/` - Development code samples and guides
- `mkdocs.yml` - Main configuration with comprehensive navigation structure
- `custom_theme/` - Theme customizations
- `docs/stylesheets/extra.css` - Custom CSS for homepage grid layout
- `docs/javascripts/extra.js` - Custom JavaScript enhancements

### Multilingual Support
- Primary language: Japanese (`ja`)
- Secondary language: English (`en`) 
- English translations stored as `.en.md` files
- Navigation translations defined in `mkdocs.yml` under `nav_translations`
- i18n plugin handles automatic language switching

### Deployment Architecture
- **Source**: `master` branch contains all source markdown and configuration
- **Build**: GitHub Actions automatically builds and deploys on push to master
- **Output**: Static site deployed to `gh-pages` branch and served via GitHub Pages
- **URL**: https://aiedoc.github.io/note/

### Key Integrations
- Git revision dates automatically added to each page
- HTML/CSS/JS minification for performance
- Google Analytics integration (GA4)
- FontAwesome icons for enhanced UI
- Code syntax highlighting with copy buttons
- Search functionality with Japanese language support

## Content Guidelines

### Navigation Structure
Follow the existing emoji-based categorization:
- 📚 学習・情報 (Learning & Information)
- 🖥️ インフラ・運用 (Infrastructure & Operations) 
- 🤖 AI開発 (AI Development)
- 💻 プログラミング (Programming)
- 🛠️ ツール・Tips (Tools & Tips)
- 🚀 SEO実践ガイド (SEO Practical Guide)

### Article Format
- Use admonition blocks (!!!) sparingly and avoid bold text within them
- Include "実現できること" (What you can achieve) sections using Material cards syntax
- Cross-reference related articles in each document
- Maintain consistent Japanese technical writing style with です/ます form

### Git Workflow
- `site/` directory is gitignored (build output managed by GitHub Actions)
- Always commit to `master` branch - deployment is automatic
- GitHub Actions triggers on changes to `docs/**`, `mkdocs.yml`, or `custom_theme/**`
- No manual gh-pages branch management required

## Dependencies

### Python Packages
- `mkdocs-material` - Main theme and functionality
- `mkdocs-git-revision-date-localized-plugin` - Automatic page timestamps
- `mkdocs-minify-plugin` - HTML/CSS/JS compression
- `mkdocs-static-i18n` - Multilingual site support

### Build Requirements
- Python 3.11+
- Git history required for revision date plugin (GitHub Actions uses `fetch-depth: 0`)
- All dependencies installed automatically via GitHub Actions workflow