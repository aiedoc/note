# How to Publish GitHub Pages from Private Repositories

![GitHub Pages Private](https://img.shields.io/badge/GitHub%20Pages-Private%20Repository-blue.svg)

## What You Can Achieve

<div class="grid cards" markdown>

-   :material-lock: **Private Repository Protection**
    
    Keep source code private while publishing your site

-   :material-domain: **Custom Domain Support**
    
    Professional publishing with your own domain

-   :material-shield-check: **Access Control**
    
    Organization-only access and IP restrictions

-   :material-currency-usd: **Plan-Specific Features**
    
    Understand free vs paid plan differences

</div>

## 📖 GitHub Pages and Private Repositories Basics

GitHub Pages is a static site hosting service, but using it with private repositories requires **specific conditions**.

### Important Prerequisites

!!! warning "Plan Requirements"
    
    To use GitHub Pages with private repositories, you need one of the following:
    
    - **GitHub Pro** (for individuals)
    - **GitHub Team** (for organizations)
    - **GitHub Enterprise** (for enterprises)
    - **GitHub Free for organizations** (with conditions)

## 💰 Detailed GitHub Plan Comparison

### Individual Account Plans

| Plan | Monthly Price | Pages Support | Key Features |
|------|---------------|---------------|--------------|
| **Free** | $0 | Public only | Basic features, unlimited public repos |
| **Pro** | $4 | **Private supported** | Private Pages, advanced analytics, Wiki |
| **Pro with Copilot** | $10+ | **Private supported** | Pro + AI assistance |

### Organization Account Plans

| Plan | Monthly Price | Pages Support | Key Features |
|------|---------------|---------------|--------------|
| **Free for organizations** | $0 | Public only* | Basic organization features |
| **Team** | $4/user | **Private supported** | Team management, SAML SSO |
| **Enterprise** | $21/user | **Private supported** | Advanced security, audit logs |

*Note: Educational and non-profit organizations may have special conditions for private support

## 🔍 How to Check Your Current Plan

### 1. For Individual Accounts

```bash
# Check via browser
1. Log in to GitHub
2. Click your profile picture (top right)
3. Select "Settings"
4. Click "Billing and plans" in the left sidebar
5. Check the "Current plan" section
```

### 2. For Organization Accounts

```bash
# Check from organization settings
1. Navigate to your organization page
2. Click the "Settings" tab
3. Select "Billing and plans"
4. Check "Current plan"
```

### 3. Using CLI

```bash
# Using GitHub CLI
gh api user --jq '.plan.name'

# For organizations
gh api orgs/ORG_NAME --jq '.plan.name'
```

## 🚀 Setting Up Pages with Private Repositories

### Step 1: Upgrade Your Plan (if needed)

```bash
# Steps to upgrade to GitHub Pro
1. Settings → Billing and plans
2. Click "Upgrade" button
3. Select "GitHub Pro"
4. Enter payment information
5. Confirm with "Purchase"
```

### Step 2: Create and Configure Repository

```bash
# Create a new private repository
gh repo create my-private-site --private

# Change existing repository to private
gh repo edit --visibility private
```

### Step 3: Enable GitHub Pages

1. **Access Repository Settings**
   ```
   Repository → Settings → Pages
   ```

2. **Select Source**
   ```yaml
   Source: Deploy from a branch
   Branch: main (or gh-pages)
   Folder: / (root) or /docs
   ```

3. **Verify Visibility Settings**
   
   !!! info "Important Setting Options"
       
       For private repositories, you'll see these options:
       
       - **Visibility**: Public (default)
       - The site itself will be public, but source code remains private

### Step 4: Configure Custom Domain (Optional)

```bash
# Create CNAME file
echo "www.example.com" > CNAME
git add CNAME
git commit -m "Add custom domain"
git push
```

## 🔒 Security and Access Control

### 1. Basic Access Control

Note that with private repositories, **the GitHub Pages site itself is still public**!

```yaml
# Key Understanding
- Repository: Private (source code hidden)
- Pages site: Public (accessible to anyone)
```

### 2. Organization-Only Access (Enterprise Only)

GitHub Enterprise Cloud allows member-only access:

```yaml
# Settings → Pages → Access control
Visibility: Private
Access: Members of [organization] only
```

### 3. Authenticated Pages (Alternative Methods)

Standard GitHub Pages doesn't have authentication, consider these alternatives:

```javascript
// Simple JavaScript authentication (NOT recommended)
const password = prompt("Enter password");
if (password !== "secret123") {
    window.location.href = "https://github.com";
}
```

More secure methods:
- Use **Netlify** or **Vercel** (with authentication)
- **GitHub Actions** + **AWS S3** combination
- **Cloudflare Access** for access control

## 📝 Practical Configuration Examples

### 1. Private Site with Jekyll

```yaml
# _config.yml
title: My Private Documentation
description: Internal documentation site
baseurl: "/my-private-site"
url: "https://username.github.io"

# Build settings
markdown: kramdown
theme: minima

# Private settings
github: [metadata]
repository: username/my-private-site
```

### 2. Automated Deployment with GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v4
      - uses: actions/jekyll-build-pages@v1
        with:
          source: ./
          destination: ./_site
      - uses: actions/upload-pages-artifact@v3

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 3. Private Repository Dependencies

```yaml
# package.json configuration
{
  "dependencies": {
    "private-package": "git+https://${GITHUB_TOKEN}@github.com/org/private-repo.git"
  }
}

# Environment variable in GitHub Actions
env:
  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. "GitHub Pages is not available for private repositories"

**Cause**: Using free plan
**Solution**: 
```bash
# Upgrade your plan
Settings → Billing → Change plan → Select "Pro"
```

#### 2. Page shows 404 error

**Cause**: Branch or folder misconfiguration
**Solution**:
```bash
# Verify correct branch
git branch -a

# Create gh-pages branch
git checkout -b gh-pages
git push origin gh-pages
```

#### 3. Build errors occur

**Cause**: Jekyll configuration or Gemfile issues
**Solution**:
```ruby
# Gemfile
source "https://rubygems.org"
gem "github-pages", group: :jekyll_plugins
gem "webrick" # Required for Ruby 3.0+

# Test locally
bundle install
bundle exec jekyll serve
```

## 💡 Best Practices

### 1. Security Measures

```yaml
# .gitignore
# Exclude sensitive files
.env
secrets/
*.key
config/production.yml

# Build artifacts
_site/
.sass-cache/
.jekyll-cache/
```

### 2. Efficient Workflow

```bash
# Branch strategy
main        → Source code (private)
gh-pages    → Built site (for Pages)
develop     → Development work
```

### 3. Cost Optimization

```yaml
# Utilize free tiers
- Public repositories: Documentation and demos
- Private repositories: Production code and sensitive data
- GitHub Actions: Use 2,000 free minutes efficiently
```

## 📊 Plan Selection Criteria

### When GitHub Pro is Suitable

- Individual developers
- Private project portfolios
- Small commercial sites

### When GitHub Team is Suitable

- Team development
- Internal documentation sites
- Client demo sites

### When Enterprise is Necessary

- Large organizations
- Strict security requirements
- Audit log requirements
- SAML SSO mandatory

## 🌟 Alternative Solutions

Alternative methods to bypass GitHub Pages limitations:

### 1. Netlify (Recommended)

```yaml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

# Authentication settings
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
  conditions = {Role = ["admin", "member"]}
```

### 2. Vercel

```json
// vercel.json
{
  "builds": [
    { "src": "package.json", "use": "@vercel/static-build" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "/$1" }
  ]
}
```

### 3. AWS Amplify

```yaml
# amplify.yml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
```

## 🔗 Related Resources

- [GitHub Pages Official Documentation](https://docs.github.com/en/pages)
- [GitHub Pricing Comparison](https://github.com/pricing)
- [GitHub Pages Usage Limits](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages#limits-on-use-of-github-pages)

---

*Last updated: 2025-01-06*