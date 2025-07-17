# Creating GitHub Pages with MkDocs

## What is MkDocs

MkDocs is a fast, simple, and downright gorgeous static site generator that's geared towards building project documentation. Documentation source files are written in Markdown, and configured with a single YAML configuration file.

## Why Use MkDocs

- ✅ **Simple Setup** - Write in Markdown, configure with YAML
- ✅ **Beautiful Themes** - Especially Material for MkDocs
- ✅ **Built-in Search** - Works out of the box
- ✅ **GitHub Pages Integration** - Easy deployment
- ✅ **Responsive Design** - Mobile-friendly by default

## Quick Start Guide

### 1. Install MkDocs

```bash
# Using pip
pip install mkdocs

# Or with Material theme
pip install mkdocs-material
```

### 2. Create a New Project

```bash
# Create new MkDocs project
mkdocs new my-project
cd my-project

# Directory structure
.
├── mkdocs.yml    # Configuration file
└── docs/
    └── index.md  # Homepage
```

### 3. Basic Configuration

```yaml
# mkdocs.yml
site_name: My Documentation
site_url: https://username.github.io/repository-name/
site_description: Project documentation
site_author: Your Name

theme:
  name: material
  palette:
    - scheme: default
      primary: indigo
      accent: indigo
      toggle:
        icon: material/brightness-7
        name: Switch to dark mode
    - scheme: slate
      primary: indigo
      accent: indigo
      toggle:
        icon: material/brightness-4
        name: Switch to light mode

nav:
  - Home: index.md
  - Getting Started: getting-started.md
  - User Guide: user-guide.md
  - API Reference: api-reference.md
```

### 4. Write Documentation

```markdown
# docs/index.md
# Welcome to My Documentation

This is the homepage of your documentation.

## Features

- Easy to write
- Beautiful output
- GitHub Pages ready

## Quick Links

- [Getting Started](getting-started.md)
- [User Guide](user-guide.md)
- [API Reference](api-reference.md)
```

### 5. Preview Locally

```bash
# Start development server
mkdocs serve

# Access at http://127.0.0.1:8000
```

## Deploy to GitHub Pages

### Option 1: Using `mkdocs gh-deploy`

```bash
# One command deployment
mkdocs gh-deploy

# This command:
# 1. Builds your documentation
# 2. Creates/updates gh-pages branch
# 3. Pushes to GitHub
```

### Option 2: Using GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy MkDocs to GitHub Pages

on:
  push:
    branches:
      - main  # or master

permissions:
  contents: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: 3.x
      
      - name: Install dependencies
        run: |
          pip install mkdocs-material
          # Add other plugins if needed
      
      - name: Deploy to GitHub Pages
        run: mkdocs gh-deploy --force
```

### Enable GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **Deploy from a branch**
4. Select **gh-pages** branch and **/ (root)** folder
5. Click **Save**

Your site will be available at:
```
https://[username].github.io/[repository-name]/
```

## Advanced Features

### 1. Adding Plugins

```yaml
# mkdocs.yml
plugins:
  - search
  - tags
  - git-revision-date-localized:
      type: datetime
      timezone: Asia/Tokyo
```

### 2. Custom Styling

```yaml
# mkdocs.yml
extra_css:
  - stylesheets/extra.css
```

```css
/* docs/stylesheets/extra.css */
.md-header {
  background-color: #2196F3;
}
```

### 3. Adding Extensions

```yaml
# mkdocs.yml
markdown_extensions:
  - admonition
  - codehilite
  - toc:
      permalink: true
  - pymdownx.superfences
  - pymdownx.tabbed:
      alternate_style: true
```

### 4. Multi-language Support

```yaml
# mkdocs.yml
plugins:
  - i18n:
      default_language: en
      languages:
        en: English
        ja: 日本語
```

## Best Practices

### 1. Project Structure

```
.
├── mkdocs.yml
├── docs/
│   ├── index.md
│   ├── getting-started/
│   │   ├── installation.md
│   │   └── configuration.md
│   ├── user-guide/
│   │   ├── basics.md
│   │   └── advanced.md
│   └── api/
│       ├── overview.md
│       └── reference.md
└── .github/
    └── workflows/
        └── deploy.yml
```

### 2. Navigation Tips

```yaml
# mkdocs.yml
nav:
  - Home: index.md
  - Getting Started:
    - Installation: getting-started/installation.md
    - Configuration: getting-started/configuration.md
  - User Guide:
    - Basics: user-guide/basics.md
    - Advanced: user-guide/advanced.md
  - API:
    - Overview: api/overview.md
    - Reference: api/reference.md
```

### 3. SEO Optimization

```yaml
# mkdocs.yml
extra:
  social:
    - icon: fontawesome/brands/github
      link: https://github.com/username
    - icon: fontawesome/brands/twitter
      link: https://twitter.com/username
  
  analytics:
    provider: google
    property: G-XXXXXXXXXX
```

## Troubleshooting

### Common Issues

1. **404 Error on GitHub Pages**
   - Check `site_url` configuration
   - Ensure `gh-pages` branch exists
   - Verify GitHub Pages is enabled

2. **Build Failures**
   - Check YAML syntax
   - Verify all linked files exist
   - Review GitHub Actions logs

3. **Styling Issues**
   - Clear browser cache
   - Check custom CSS specificity
   - Verify theme configuration

## Conclusion

MkDocs with GitHub Pages provides a powerful, free solution for hosting documentation. With minimal setup, you can have a professional-looking documentation site that's easy to maintain and update.

## Resources

- [MkDocs Official Documentation](https://www.mkdocs.org)
- [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)
- [GitHub Pages Documentation](https://docs.github.com/pages)
- [Awesome MkDocs](https://github.com/mkdocs/mkdocs/wiki/MkDocs-Themes)