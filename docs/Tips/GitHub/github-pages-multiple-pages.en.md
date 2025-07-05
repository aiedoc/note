# Complete Guide to Creating Multi-Page Websites with GitHub Pages [2025 Edition]

Learn how to create multi-page websites with GitHub Pages, explained in a beginner-friendly way. This guide covers everything from professional site building with static site generators to simple HTML implementations.

## 📋 Table of Contents

1. [What is GitHub Pages?](#what-is-github-pages)
2. [Methods for Creating Multi-Page Sites](#methods-for-creating-multi-page-sites)
3. [Using Static Site Generators](#using-static-site-generators)
4. [Creating with Simple HTML](#creating-with-simple-html)
5. [Common Issues and Solutions](#common-issues-and-solutions)
6. [SEO and Best Practices](#seo-and-best-practices)

## What is GitHub Pages?

GitHub Pages is a free static website hosting service provided by GitHub. You can publish HTML files and Markdown files stored in your repository directly as a website.

### Benefits

- ✅ **Completely free** to use
- ✅ **Custom domain** support
- ✅ **HTTPS** enabled by default
- ✅ **Version control** capability
- ✅ **Automatic deployment** for easy updates

## Methods for Creating Multi-Page Sites

There are three main ways to create multi-page sites with GitHub Pages:

### 1. Using Static Site Generators (Recommended)

The most efficient and maintainable approach.

| Tool | Features | Best For |
|------|----------|----------|
| **Jekyll** | Native GitHub Pages support | Blogs, documentation |
| **MkDocs** | Markdown-focused | Technical documentation |
| **Hugo** | Fast builds | Large-scale sites |
| **Next.js** | React-based | Dynamic web apps |

### 2. Creating with Simple HTML Files

Perfect for small-scale sites.

### 3. Using SPA Frameworks

For creating modern web applications.

## Using Static Site Generators

### Creating Multi-Page Sites with MkDocs

MkDocs is a static site generator specialized for technical documentation. It converts Markdown files into beautiful websites.

#### 1. Environment Setup

```bash
# Check Python installation
python --version

# Install MkDocs and theme
pip install mkdocs mkdocs-material
```

#### 2. Project Initialization

```bash
# Create new project
mkdocs new my-docs
cd my-docs

# Directory structure
my-docs/
├── docs/           # Directory for Markdown files
│   └── index.md    # Homepage
└── mkdocs.yml      # Configuration file
```

#### 3. Adding Multiple Pages

```yaml
# mkdocs.yml
site_name: My Documentation
site_url: https://username.github.io/repository-name/
theme:
  name: material

nav:
  - Home: index.md
  - Getting Started:
    - Installation: getting-started/installation.md
    - Configuration: getting-started/configuration.md
  - Guides:
    - Basic Usage: guides/basic-usage.md
    - Advanced: guides/advanced.md
  - API Reference: api-reference.md
```

#### 4. Creating Pages

```markdown
# docs/getting-started/installation.md
# Installation Guide

This page explains how to install our software.

## Requirements

- Python 3.8 or higher
- pip

## Installation Steps

1. Install the package
   ```bash
   pip install our-package
   ```

2. Initial setup
   ```bash
   our-package init
   ```
```

#### 5. Deploying to GitHub Pages

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: |
          pip install mkdocs-material
          pip install mkdocs-minify-plugin
      
      - name: Build and deploy
        run: mkdocs gh-deploy --force
```

### Creating Multi-Page Sites with Jekyll

Jekyll is the static site generator natively supported by GitHub Pages.

#### 1. Configuring _config.yml

```yaml
# _config.yml
title: My Awesome Site
description: Multi-page site example
baseurl: "/repository-name"
url: "https://username.github.io"

# Navigation
navigation:
  - title: Home
    url: /
  - title: About
    url: /about/
  - title: Blog
    url: /blog/
  - title: Contact
    url: /contact/
```

#### 2. Creating Layout Files

```html
<!-- _layouts/default.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{{ page.title }} - {{ site.title }}</title>
    <link rel="stylesheet" href="{{ '/assets/css/style.css' | relative_url }}">
</head>
<body>
    <nav>
        <ul>
        {% for item in site.navigation %}
            <li><a href="{{ item.url | relative_url }}">{{ item.title }}</a></li>
        {% endfor %}
        </ul>
    </nav>
    
    <main>
        {{ content }}
    </main>
    
    <footer>
        <p>&copy; 2025 {{ site.title }}</p>
    </footer>
</body>
</html>
```

## Creating with Simple HTML

Creating multi-page sites with pure HTML without using static site generators.

### Directory Structure

```
repository-name/
├── index.html          # Homepage
├── about.html          # About page
├── products/
│   ├── index.html      # Product list
│   └── product1.html   # Product detail
├── blog/
│   ├── index.html      # Blog list
│   └── post1.html      # Blog post
├── css/
│   └── style.css       # Stylesheet
└── js/
    └── script.js       # JavaScript
```

### Basic HTML Template

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home - My Website</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <header>
        <nav>
            <ul>
                <li><a href="index.html">Home</a></li>
                <li><a href="about.html">About</a></li>
                <li><a href="products/index.html">Products</a></li>
                <li><a href="blog/index.html">Blog</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <h1>Welcome to My Website</h1>
        <p>This is a sample multi-page website.</p>
    </main>
    
    <footer>
        <p>&copy; 2025 My Website</p>
    </footer>
</body>
</html>
```

### Sharing Navigation (Using JavaScript)

```javascript
// js/navigation.js
const navigation = `
    <nav>
        <ul>
            <li><a href="/index.html">Home</a></li>
            <li><a href="/about.html">About</a></li>
            <li><a href="/products/index.html">Products</a></li>
            <li><a href="/blog/index.html">Blog</a></li>
        </ul>
    </nav>
`;

document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    if (header) {
        header.innerHTML = navigation;
    }
});
```

## Common Issues and Solutions

### 1. Pages Return 404 Error

**Causes and Solutions:**

- **Path issues**: Use absolute paths including repository name instead of relative paths
  ```html
  <!-- ❌ Wrong -->
  <a href="/about.html">About</a>
  
  <!-- ✅ Correct -->
  <a href="/repository-name/about.html">About</a>
  ```

- **Branch settings**: Check source branch in GitHub Pages settings
  - Go to Settings → Pages → Source and select the correct branch

- **.nojekyll file**: Required when using directories starting with underscore
  ```bash
  touch .nojekyll
  ```

### 2. CSS and JavaScript Not Loading

**Solution:**

```html
<!-- Set base URL -->
<base href="/repository-name/">

<!-- Or use relative paths -->
<link rel="stylesheet" href="./css/style.css">
```

### 3. Updates Not Reflecting

**Solutions:**

1. Clear cache (Ctrl + F5)
2. Check GitHub Actions execution status
3. Wait a few minutes and try again

## SEO and Best Practices

### 1. Meta Tag Optimization

```html
<head>
    <!-- Basic meta tags -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Learn how to create multi-page websites with GitHub Pages">
    
    <!-- OGP tags -->
    <meta property="og:title" content="How to Create Multi-Page Sites with GitHub Pages">
    <meta property="og:description" content="Easy methods for beginners to build multi-page websites">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://username.github.io/repository/">
    
    <!-- Structured data -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "My GitHub Pages Site",
        "url": "https://username.github.io/repository/"
    }
    </script>
</head>
```

### 2. Creating Sitemaps

```xml
<!-- sitemap.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://username.github.io/repository/</loc>
        <lastmod>2025-01-04</lastmod>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>https://username.github.io/repository/about.html</loc>
        <lastmod>2025-01-04</lastmod>
        <priority>0.8</priority>
    </url>
</urlset>
```

### 3. Performance Optimization

- Image optimization (use WebP format)
- CSS and JavaScript minification
- Implement lazy loading
- Utilize CDNs

## Summary

The method for creating multi-page websites with GitHub Pages can be chosen based on project scale and requirements:

- **Small sites**: Simple HTML is sufficient
- **Documentation sites**: MkDocs or Jekyll recommended
- **Blog sites**: Jekyll is optimal
- **Modern web apps**: Consider Next.js or Vue.js

Regardless of the method chosen, GitHub Pages allows you to publish high-quality websites for free. It's recommended to start with a simple site and gradually add features.

## Related Articles

- [Creating GitHub Pages with MkDocs](../Mkdocs/mkdocsを使ったGitHubPages.md)
- [GitHub Actions Automated Deployment](../Mkdocs/GitHub Actions自動デプロイ設定.md)
- [SEO Practical Guide](../../SEO/index.md)

## Reference Links

- [GitHub Pages Official Documentation](https://docs.github.com/en/pages)
- [MkDocs Official Site](https://www.mkdocs.org/)
- [Jekyll Official Site](https://jekyllrb.com/)