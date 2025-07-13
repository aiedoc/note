"""
カスタムブログ機能用マクロプラグイン
MkDocs Material blogプラグインとi18nプラグインの競合を回避するため、
カスタムマクロでブログ機能を実装
"""

import os
import re
from datetime import datetime
from pathlib import Path


def define_env(env):
    """MkDocs macros plugin用の環境定義"""
    
    @env.macro
    def blog_posts_list(category=None, lang='ja', limit=None):
        """ブログ記事一覧を生成"""
        posts = []
        posts_dir = Path('docs/blog/posts')
        
        if not posts_dir.exists():
            return "<!-- ブログ記事が見つかりません -->"
        
        # 言語に応じたファイル拡張子
        file_pattern = '*.en.md' if lang == 'en' else '*.md'
        
        for post_file in posts_dir.glob(file_pattern):
            # 英語版の場合、.en.mdファイルのみ、日本語版の場合は.en.mdを除外
            if lang == 'en' and not post_file.name.endswith('.en.md'):
                continue
            if lang == 'ja' and post_file.name.endswith('.en.md'):
                continue
                
            try:
                with open(post_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # フロントマターの解析
                if content.startswith('---'):
                    parts = content.split('---', 2)
                    if len(parts) >= 3:
                        frontmatter = parts[1]
                        body = parts[2]
                        
                        # メタデータの抽出
                        date_match = re.search(r'date:\s*(.+)', frontmatter)
                        categories_match = re.search(r'categories:\s*\n((?:\s*-\s*.+\n?)*)', frontmatter)
                        tags_match = re.search(r'tags:\s*\n((?:\s*-\s*.+\n?)*)', frontmatter)
                        
                        if date_match:
                            post_date = date_match.group(1).strip()
                            post_title = extract_title_from_body(body)
                            post_excerpt = extract_excerpt(body)
                            post_categories = extract_list_from_match(categories_match)
                            post_tags = extract_list_from_match(tags_match)
                            
                            # カテゴリフィルタ
                            if category and category not in post_categories:
                                continue
                            
                            # URLの生成
                            if lang == 'en':
                                base_name = post_file.stem.replace('.en', '')
                                post_url = f"/en/blog/posts/{base_name}/"
                            else:
                                post_url = f"/blog/posts/{post_file.stem}/"
                            
                            posts.append({
                                'title': post_title,
                                'date': post_date,
                                'url': post_url,
                                'excerpt': post_excerpt,
                                'categories': post_categories,
                                'tags': post_tags
                            })
            except Exception as e:
                continue
        
        # 日付でソート（新しい順）
        posts.sort(key=lambda x: x['date'], reverse=True)
        
        # 制限数の適用
        if limit:
            posts = posts[:limit]
        
        # HTMLの生成
        html = '<div class="blog-posts">'
        for post in posts:
            html += f'''
            <article class="blog-post-card">
                <h3><a href="{post['url']}">{post['title']}</a></h3>
                <div class="blog-meta">
                    <time>{format_date(post['date'], lang)}</time>
                    {format_categories(post['categories'], lang)}
                </div>
                <div class="blog-excerpt">{post['excerpt']}</div>
                {format_tags(post['tags'])}
            </article>
            '''
        html += '</div>'
        
        return html
    
    @env.macro
    def blog_categories_list(lang='ja'):
        """ブログカテゴリ一覧を生成"""
        categories = {}
        posts_dir = Path('docs/blog/posts')
        
        if not posts_dir.exists():
            return "<!-- カテゴリが見つかりません -->"
        
        file_pattern = '*.en.md' if lang == 'en' else '*.md'
        
        for post_file in posts_dir.glob(file_pattern):
            if lang == 'en' and not post_file.name.endswith('.en.md'):
                continue
            if lang == 'ja' and post_file.name.endswith('.en.md'):
                continue
                
            try:
                with open(post_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                if content.startswith('---'):
                    parts = content.split('---', 2)
                    if len(parts) >= 3:
                        frontmatter = parts[1]
                        categories_match = re.search(r'categories:\s*\n((?:\s*-\s*.+\n?)*)', frontmatter)
                        
                        if categories_match:
                            post_categories = extract_list_from_match(categories_match)
                            for cat in post_categories:
                                categories[cat] = categories.get(cat, 0) + 1
            except Exception:
                continue
        
        html = '<div class="blog-categories">'
        for category, count in sorted(categories.items()):
            html += f'<div class="category-item">'
            html += f'<span class="category-name">{category}</span>'
            html += f'<span class="category-count">({count})</span>'
            html += f'</div>'
        html += '</div>'
        
        return html
    
    @env.macro
    def blog_recent_posts(limit=5, lang='ja'):
        """最新記事リストを生成（サイドバー用）"""
        posts = []
        posts_dir = Path('docs/blog/posts')
        
        if not posts_dir.exists():
            return "<!-- 最新記事が見つかりません -->"
        
        file_pattern = '*.en.md' if lang == 'en' else '*.md'
        
        for post_file in posts_dir.glob(file_pattern):
            if lang == 'en' and not post_file.name.endswith('.en.md'):
                continue
            if lang == 'ja' and post_file.name.endswith('.en.md'):
                continue
                
            try:
                with open(post_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                if content.startswith('---'):
                    parts = content.split('---', 2)
                    if len(parts) >= 3:
                        frontmatter = parts[1]
                        body = parts[2]
                        
                        date_match = re.search(r'date:\s*(.+)', frontmatter)
                        if date_match:
                            post_date = date_match.group(1).strip()
                            post_title = extract_title_from_body(body)
                            
                            if lang == 'en':
                                base_name = post_file.stem.replace('.en', '')
                                post_url = f"/en/blog/posts/{base_name}/"
                            else:
                                post_url = f"/blog/posts/{post_file.stem}/"
                            
                            posts.append({
                                'title': post_title,
                                'date': post_date,
                                'url': post_url
                            })
            except Exception:
                continue
        
        posts.sort(key=lambda x: x['date'], reverse=True)
        posts = posts[:limit]
        
        html = '<div class="recent-posts">'
        html += f'<h3>{"Recent Posts" if lang == "en" else "最新記事"}</h3>'
        html += '<ul>'
        for post in posts:
            html += f'<li><a href="{post["url"]}">{post["title"]}</a></li>'
        html += '</ul>'
        html += '</div>'
        
        return html


def extract_title_from_body(body):
    """記事本文からタイトルを抽出"""
    lines = body.strip().split('\n')
    for line in lines:
        line = line.strip()
        if line.startswith('# '):
            return line[2:].strip()
    return "無題"


def extract_excerpt(body, length=150):
    """記事本文から抜粋を抽出"""
    # タイトル行を除去
    lines = body.strip().split('\n')
    content_lines = []
    
    for line in lines:
        line = line.strip()
        if line and not line.startswith('#') and not line.startswith('!['):
            content_lines.append(line)
        if len(' '.join(content_lines)) > length:
            break
    
    excerpt = ' '.join(content_lines)
    if len(excerpt) > length:
        excerpt = excerpt[:length] + '...'
    
    return excerpt


def extract_list_from_match(match):
    """正規表現マッチからリストを抽出"""
    if not match:
        return []
    
    list_text = match.group(1)
    items = []
    for line in list_text.split('\n'):
        line = line.strip()
        if line.startswith('- '):
            items.append(line[2:].strip())
    
    return items


def format_date(date_str, lang='ja'):
    """日付のフォーマット"""
    try:
        date_obj = datetime.strptime(date_str, '%Y-%m-%d')
        if lang == 'en':
            return date_obj.strftime('%B %d, %Y')
        else:
            return date_obj.strftime('%Y年%m月%d日')
    except:
        return date_str


def format_categories(categories, lang='ja'):
    """カテゴリのフォーマット"""
    if not categories:
        return ''
    
    category_links = []
    for cat in categories:
        category_links.append(f'<span class="category-tag">{cat}</span>')
    
    prefix = "Categories: " if lang == 'en' else "カテゴリ: "
    return f'<div class="blog-categories">{prefix}{" ".join(category_links)}</div>'


def format_tags(tags):
    """タグのフォーマット"""
    if not tags:
        return ''
    
    tag_links = []
    for tag in tags:
        tag_links.append(f'<span class="tag">{tag}</span>')
    
    return f'<div class="blog-tags">{"".join(tag_links)}</div>'