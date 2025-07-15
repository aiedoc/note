# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 📝 Article Creation Checklist

When creating new articles for this documentation site, follow this checklist:

### Pre-Writing Phase
- [ ] **Topic Research**: Research the topic thoroughly using official documentation and best practices
- [ ] **Internet Research**: Search for the latest blog articles and information about the topic
- [ ] **Use Case Analysis**: Identify practical use cases and real-world applications
- [ ] **Pros and Cons**: Document advantages and disadvantages comprehensively
- [ ] **Existing Content Check**: Search for similar articles to avoid duplication
- [ ] **Target Audience**: Define the target audience (beginner/intermediate/advanced)
- [ ] **Outline Creation**: Create a clear outline with main sections

### Writing Phase
- [ ] **Japanese Article**: Write the main article in Japanese (.md file)
- [ ] **English Translation**: Create English version (.en.md file) immediately after Japanese completion
- [ ] **Code Examples**: Include practical, working code examples
- [ ] **Visual Elements**: Add emoji icons and Material cards for better readability
- [ ] **Cross-References**: Link to related articles within the documentation
- [ ] **External Links**: Include relevant external resources
- [ ] **SEO Optimization**: Apply SEO best practices to both language versions
- [ ] **Article Structure**: Follow optimal length and hierarchy guidelines
- [ ] **NO Manual Dates**: NEVER include manual update dates (automated by git plugin)

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
- [ ] **Feature Verification**: Test all implemented features work correctly via WebFetch
- [ ] **Live Site Check**: Verify actual article URLs are accessible and render without errors
- [ ] **Cross-browser Testing**: Verify functionality across different browsers
- [ ] **Performance Check**: Ensure page load times and responsiveness are acceptable

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

### AI-Assisted Article Creation Workflow

When using Claude Code to create articles based on provided topics:

1. **Topic Input Phase**
   - User provides basic topic information
   - Claude Code conducts comprehensive internet research using WebSearch
   - Searches for latest blog articles and documentation
   - Analyzes current trends and best practices

2. **Research & Analysis Phase**
   - Compile information about use cases and applications
   - Document pros and cons from multiple sources
   - Create comprehensive outline based on research

3. **Article Writing Phase**
   - Write Japanese article following the standard template
   - Immediately create English version (.en.md file)
   - Include practical examples and real-world scenarios
   - Apply SEO optimization to both versions
   - Follow article length and structure guidelines

4. **Automated Deployment Phase**
   - Stage files with `git add`
   - Update mkdocs.yml navigation for both languages
   - Create descriptive commit message
   - Push to master branch
   - Deploy with `mkdocs gh-deploy`
   - Verify live publication

Example workflow command:
```bash
# Claude Code will automatically:
# 1. Research the topic online
# 2. Create comprehensive article with use cases, pros/cons
# 3. Generate both Japanese and English versions
# 4. Update mkdocs.yml navigation
# 5. Commit and deploy to GitHub Pages
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
- **NEVER include manual update dates** - All update dates are automatically managed by `mkdocs-git-revision-date-localized-plugin`

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

## 📊 Article Design & SEO Optimization Guidelines

### Optimal Article Length Strategy

#### Article Type Classification
- **Parent Articles (Overview/Guide)**: 2000-3000 characters
  - Comprehensive topic overview
  - Link to child articles for detailed coverage
  - Include "実現できること" cards section
  
- **Child Articles (Specific Methods)**: 1500-2500 characters
  - Focused on specific techniques or implementations
  - Detailed step-by-step instructions
  - Link back to parent and related articles
  
- **Tutorial/Example Articles**: 1000-2000 characters
  - Practical examples and case studies
  - Code-heavy content with explanations
  - Quick reference guides
  
- **Tips/Quick Notes**: 500-1000 characters
  - Short, actionable insights
  - Single concept focus
  - Easy to scan and implement

### Article Branching Strategy

#### Hierarchical Structure Example
```
Claude Code活用法 (Parent - 2800 chars)
├── コマンド自動実行ガイド (Child - 2200 chars)
├── Hooks完全ガイド (Child - 2400 chars)
├── MCP統合戦略 (Child - 2100 chars)
└── 実践例集 (Grandchild - 1800 chars)
    ├── CI/CD自動化例 (Tutorial - 1200 chars)
    ├── バッチ処理例 (Tutorial - 1000 chars)
    └── エラー対応例 (Tutorial - 1100 chars)
```

#### Content Distribution Rules
1. **Avoid Article Bloat**: Don't expand a single article beyond 3500 characters
2. **Split Complex Topics**: Create child articles for detailed explanations
3. **Cross-Reference**: Link related articles strategically
4. **Update Parent Articles**: Add links to new child articles

### SEO Optimization Rules

#### Title Optimization
- **Japanese**: 32文字以内、主要キーワード含有
- **English**: 60 characters max, include primary keywords
- Include action words: "ガイド", "方法", "実践", "Guide", "How to", "Best Practices"

#### Meta Description Guidelines
- **Japanese**: 120-160文字で魅力的な要約
- **English**: 120-160 characters with compelling summary
- Include primary keyword and value proposition

#### Heading Structure (H1-H6)
```markdown
# Main Title (H1) - 1 per article
## Major Sections (H2) - 3-6 per article
### Subsections (H3) - As needed
#### Details (H4) - Sparingly
```

#### Internal Linking Strategy
- **3-7 internal links** per article
- Link to parent articles from child articles
- Link to child articles from parent articles
- Include "Related Articles" section at the end
- Use descriptive anchor text

#### Keyword Optimization
- **Keyword Density**: 1-3% of total content
- **Natural Placement**: In title, headers, first paragraph, conclusion
- **Semantic Keywords**: Use related terms and synonyms
- **Japanese SEO**: Use both hiragana/katakana and kanji variations

### Readability Optimization

#### Content Structure
- **Introduction**: 150-250 characters - Hook reader and set expectations
- **Main Sections**: 300-500 characters each - One concept per section
- **Conclusion**: 100-200 characters - Summarize key takeaways
- **Code Blocks**: Keep within one screen view when possible

#### Visual Enhancement
- Use emoji icons consistently (🔧, 📖, 💡, 🚀, etc.)
- Implement Material cards for feature highlights
- Break long paragraphs (max 3-4 sentences)
- Use bullet points and numbered lists effectively
- Include code syntax highlighting

### Multilingual Content Strategy

#### English Version Requirements
- Create `.en.md` file immediately after Japanese version
- Adapt content for English-speaking audience (not direct translation)
- Maintain consistent structure between language versions
- Update mkdocs.yml nav_translations section
- Ensure all internal links work in both languages

#### Content Localization
- **Japanese**: Use です/ます form, technical terms in katakana when appropriate
- **English**: Use clear, professional tone, explain Japanese-specific contexts
- **Code Examples**: Keep code universal, adapt comments to target language
- **Cultural Context**: Adjust examples and references for target audience

### Automation & Homepage Integration

#### New Article Discovery
- Articles automatically appear in navigation after mkdocs deployment
- Latest articles show in search index immediately
- RSS feed updates automatically include new content
- Site analytics track new page performance

#### Content Maintenance
- Review and update parent articles when adding child articles
- Check and fix broken internal links monthly
- Update "Related Articles" sections when relevant content is added
- Monitor article performance and split high-traffic long articles

### Performance Monitoring

#### Success Metrics
- **Engagement**: Time on page, bounce rate, scroll depth
- **SEO**: Search ranking, click-through rate, organic traffic
- **Usability**: Mobile responsiveness, loading speed, navigation flow
- **Conversion**: Task completion rate, internal link clicks

#### Optimization Triggers
- **Split Article**: If word count exceeds guidelines or bounce rate > 70%
- **Create Child Article**: If specific section gets high engagement
- **Update Parent**: If child articles receive more traffic than parent
- **Merge Articles**: If multiple short articles cover same topic