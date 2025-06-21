// MkDocs Site Enhanced JavaScript
// このファイルは高度な設定ガイドの実装例として作成されています

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 高度なJavaScript機能が読み込まれました');
    
    // 1. 外部リンクのトラッキング（アナリティクス連携用）
    trackExternalLinks();
    
    // 2. コードブロックの機能強化
    enhanceCodeBlocks();
    
    // 3. 検索機能の拡張
    enhanceSearch();
    
    // 4. パフォーマンス監視
    monitorPerformance();
    
    // 5. ユーザーエクスペリエンス向上
    improveUX();
});

// 外部リンクトラッキング
function trackExternalLinks() {
    const externalLinks = document.querySelectorAll('a[href^="http"]:not([href*="aiedoc.github.io"])');
    
    externalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const url = this.href;
            const text = this.textContent;
            
            // アナリティクスにイベント送信（GA4対応）
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    event_category: 'external_link',
                    event_label: url,
                    transport_type: 'beacon'
                });
            }
            
            console.log(`📊 外部リンククリック: ${text} -> ${url}`);
        });
        
        // 外部リンクマーカー追加
        if (!link.querySelector('.external-link-icon')) {
            const icon = document.createElement('span');
            icon.className = 'external-link-icon';
            icon.innerHTML = ' ↗';
            icon.style.fontSize = '0.8em';
            icon.style.opacity = '0.6';
            link.appendChild(icon);
        }
    });
    
    console.log(`🔗 ${externalLinks.length}個の外部リンクにトラッキングを設定`);
}

// コードブロック機能強化
function enhanceCodeBlocks() {
    const codeBlocks = document.querySelectorAll('pre code');
    let enhancedCount = 0;
    
    codeBlocks.forEach(block => {
        const pre = block.parentElement;
        
        // 言語表示の追加
        const className = block.className;
        const language = className.replace('language-', '').replace('hljs', '').trim();
        
        if (language && language !== 'text') {
            // 言語ラベルの追加
            if (!pre.querySelector('.code-language')) {
                const langLabel = document.createElement('div');
                langLabel.className = 'code-language';
                langLabel.textContent = language.toUpperCase();
                langLabel.style.cssText = `
                    position: absolute;
                    top: 0.5rem;
                    right: 0.5rem;
                    background: rgba(0,0,0,0.5);
                    color: white;
                    padding: 0.2rem 0.5rem;
                    border-radius: 0.25rem;
                    font-size: 0.7rem;
                    font-weight: bold;
                `;
                pre.style.position = 'relative';
                pre.appendChild(langLabel);
            }
            
            enhancedCount++;
        }
    });
    
    console.log(`💻 ${enhancedCount}個のコードブロックを強化`);
}

// 検索機能拡張
function enhanceSearch() {
    const searchInput = document.querySelector('[data-md-component="search-query"]');
    
    if (searchInput) {
        // 検索履歴の保存
        searchInput.addEventListener('input', function() {
            const query = this.value.trim();
            
            if (query.length > 2) {
                // ローカルストレージに検索履歴保存
                let searchHistory = JSON.parse(localStorage.getItem('mkdocs_search_history') || '[]');
                
                if (!searchHistory.includes(query)) {
                    searchHistory.unshift(query);
                    searchHistory = searchHistory.slice(0, 10); // 最新10件まで
                    localStorage.setItem('mkdocs_search_history', JSON.stringify(searchHistory));
                }
                
                // アナリティクスイベント
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'search', {
                        search_term: query
                    });
                }
            }
        });
        
        console.log('🔍 検索機能を拡張しました');
    }
}

// パフォーマンス監視
function monitorPerformance() {
    // ページロード時間の測定
    window.addEventListener('load', function() {
        const loadTime = performance.now();
        console.log(`⚡ ページロード時間: ${Math.round(loadTime)}ms`);
        
        // Core Web Vitals監視
        if ('web-vital' in window) {
            // LCP (Largest Contentful Paint)
            new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    console.log(`📊 LCP: ${Math.round(entry.startTime)}ms`);
                }
            }).observe({entryTypes: ['largest-contentful-paint']});
        }
    });
    
    // メモリ使用量監視（開発時のみ）
    if (performance.memory) {
        console.log(`💾 メモリ使用量: ${Math.round(performance.memory.usedJSHeapSize / 1024 / 1024)}MB`);
    }
}

// ユーザーエクスペリエンス向上
function improveUX() {
    // スクロール位置の復元
    const scrollPosition = sessionStorage.getItem('mkdocs_scroll_position');
    if (scrollPosition) {
        window.scrollTo(0, parseInt(scrollPosition));
        sessionStorage.removeItem('mkdocs_scroll_position');
    }
    
    // ページ離脱時にスクロール位置を保存
    window.addEventListener('beforeunload', function() {
        sessionStorage.setItem('mkdocs_scroll_position', window.pageYOffset.toString());
    });
    
    // 読了時間の推定表示
    addReadingTime();
    
    // 目次の改善
    enhanceTableOfContents();
    
    console.log('✨ UX改善機能を適用しました');
}

// 読了時間の推定
function addReadingTime() {
    const content = document.querySelector('.md-content__inner');
    if (!content) return;
    
    const text = content.textContent;
    const wordCount = text.trim().split(/\s+/).length;
    const readingTimeMinutes = Math.ceil(wordCount / 200); // 1分間200語として計算
    
    // ページタイトルの下に読了時間を表示
    const title = document.querySelector('.md-content h1');
    if (title && !title.nextElementSibling?.classList.contains('reading-time')) {
        const readingTimeEl = document.createElement('div');
        readingTimeEl.className = 'reading-time';
        readingTimeEl.innerHTML = `📖 読了時間: 約${readingTimeMinutes}分 (${wordCount.toLocaleString()}文字)`;
        readingTimeEl.style.cssText = `
            color: var(--md-default-fg-color--light);
            font-size: 0.8rem;
            margin: 0.5rem 0 1rem 0;
            padding: 0.5rem;
            background: var(--md-code-bg-color);
            border-radius: 0.25rem;
            border-left: 4px solid var(--md-accent-fg-color);
        `;
        title.insertAdjacentElement('afterend', readingTimeEl);
    }
}

// 目次の改善
function enhanceTableOfContents() {
    const toc = document.querySelector('.md-nav--secondary');
    if (!toc) return;
    
    // 現在の見出しをハイライト
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = entry.target.id;
            const tocLink = toc.querySelector(`a[href="#${id}"]`);
            
            if (tocLink) {
                if (entry.isIntersecting) {
                    tocLink.style.color = 'var(--md-accent-fg-color)';
                    tocLink.style.fontWeight = 'bold';
                } else {
                    tocLink.style.color = '';
                    tocLink.style.fontWeight = '';
                }
            }
        });
    }, {
        rootMargin: '-20% 0px -35% 0px'
    });
    
    // 全ての見出しを監視
    document.querySelectorAll('h2[id], h3[id], h4[id]').forEach(heading => {
        observer.observe(heading);
    });
}

// デバッグ情報（開発時のみ）
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('🔧 開発モード: 追加のデバッグ情報を表示');
    
    // Material for MkDocs バージョン情報
    const generator = document.querySelector('meta[name="generator"]');
    if (generator) {
        console.log(`📦 ${generator.content}`);
    }
    
    // 設定されているプラグイン情報
    console.log('🔌 有効な高度機能:');
    console.log('- ✅ 外部リンクトラッキング');
    console.log('- ✅ コードブロック強化');
    console.log('- ✅ 検索履歴保存');
    console.log('- ✅ パフォーマンス監視');
    console.log('- ✅ 読了時間表示');
    console.log('- ✅ スクロール位置復元');
    console.log('- ✅ 目次ハイライト');
}