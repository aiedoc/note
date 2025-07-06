# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 📝 Article Creation Checklist

When creating new articles for this documentation site, follow this checklist:

### Pre-Writing Phase
- [ ] **Topic Research**: Research the topic thoroughly using official documentation and best practices
- [ ] **Existing Content Check**: Search for similar articles to avoid duplication
- [ ] **Target Audience**: Define the target audience (beginner/intermediate/advanced)
- [ ] **Outline Creation**: Create a clear outline with main sections

### Writing Phase
- [ ] **Japanese Article**: Write the main article in Japanese (.md file)
- [ ] **English Translation**: Create English version (.en.md file)
- [ ] **Code Examples**: Include practical, working code examples
- [ ] **Visual Elements**: Add emoji icons and Material cards for better readability
- [ ] **Cross-References**: Link to related articles within the documentation
- [ ] **External Links**: Include relevant external resources

### Quality Assurance
- [ ] **Grammar Check**: Review for grammatical errors and typos
- [ ] **Code Validation**: Test all code examples for functionality
- [ ] **Link Verification**: Ensure all internal and external links work
- [ ] **Format Consistency**: Follow the established article format
- [ ] **Navigation Update**: Add article to mkdocs.yml with proper categorization

### Deployment Phase
- [ ] **Git Add**: Stage new files for commit
- [ ] **Git Commit**: Create meaningful commit message
- [ ] **Git Push**: Push changes to master branch
- [ ] **MkDocs Deploy**: Run `mkdocs gh-deploy` to publish
- [ ] **Site Verification**: Access the live site to confirm publication
- [ ] **Search Test**: Use site search to verify article is indexed

### Post-Deployment
- [ ] **Analytics Check**: Monitor page views and engagement (after 24h)
- [ ] **Error Monitoring**: Check for 404s or build errors
- [ ] **Community Feedback**: Monitor for user feedback or issues

### Article Creation Workflow

```bash
# 1. Create new article
touch docs/Category/new-article.md
touch docs/Category/new-article.en.md

# 2. Write content following the checklist above

# 3. Update navigation
# Edit mkdocs.yml to add the new article

# 4. Test locally
mkdocs serve
# Visit http://localhost:8000 to preview

# 5. Deploy
git add .
git commit -m "Add article: [Article Title]"
git push origin master
mkdocs gh-deploy

# 6. Verify deployment
# Visit https://smartscope.blog/Category/new-article/
```

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

#### Standard Article Template

```markdown
# Article Title

![Badge](https://img.shields.io/badge/Category-Topic-color.svg)

## 実現できること

<div class="grid cards" markdown>

-   :material-icon: **Feature 1**
    
    Brief description of what can be achieved

-   :material-icon: **Feature 2**
    
    Brief description of what can be achieved

</div>

## 📖 Overview

Introduction paragraph explaining the topic...

## 🔧 Implementation

### Step 1: Setup

Detailed instructions...

## 💡 Best Practices

1. **Practice 1**: Description
2. **Practice 2**: Description

## 🔗 Related Articles

- [Related Article 1](./related-1.md)
- [Related Article 2](./related-2.md)

---

*最終更新: YYYY-MM-DD*
```

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