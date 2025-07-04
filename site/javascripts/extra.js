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
    
    // 6. コードブロックのコピーボタン
    addCopyButtons();
    
    // 7. スムーズスクロール
    enableSmoothScroll();
    
    // 8. キーボードショートカット
    setupKeyboardShortcuts();
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
    
    // プログレスバーの追加
    addProgressBar();
    
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

// コードブロックのコピーボタン追加
function addCopyButtons() {
    const codeBlocks = document.querySelectorAll('pre > code');
    
    codeBlocks.forEach(code => {
        const pre = code.parentElement;
        if (pre.querySelector('.copy-button')) return; // 既にボタンがある場合はスキップ
        
        const button = document.createElement('button');
        button.className = 'copy-button';
        button.innerHTML = '📋 コピー';
        button.style.cssText = `
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            background: var(--md-primary-fg-color);
            color: white;
            border: none;
            padding: 0.25rem 0.5rem;
            border-radius: 0.25rem;
            font-size: 0.75rem;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.2s;
        `;
        
        pre.style.position = 'relative';
        pre.appendChild(button);
        
        // ホバー時にボタンを表示
        pre.addEventListener('mouseenter', () => {
            button.style.opacity = '1';
        });
        
        pre.addEventListener('mouseleave', () => {
            button.style.opacity = '0';
        });
        
        // コピー機能
        button.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(code.textContent);
                button.innerHTML = '✅ コピー完了!';
                setTimeout(() => {
                    button.innerHTML = '📋 コピー';
                }, 2000);
            } catch (err) {
                console.error('コピーに失敗しました:', err);
                button.innerHTML = '❌ 失敗';
            }
        });
    });
    
    console.log(`📋 ${codeBlocks.length}個のコードブロックにコピーボタンを追加`);
}

// スムーズスクロール
function enableSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerOffset = 80; // ヘッダーの高さ分オフセット
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    console.log('🔄 スムーズスクロールを有効化');
}

// キーボードショートカット
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K で検索
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.querySelector('[data-md-component="search-query"]');
            if (searchInput) {
                searchInput.focus();
            }
        }
        
        // Ctrl/Cmd + / でショートカット一覧表示
        if ((e.ctrlKey || e.metaKey) && e.key === '/') {
            e.preventDefault();
            showShortcutHelp();
        }
        
        // ESCで検索を閉じる
        if (e.key === 'Escape') {
            const searchReset = document.querySelector('[data-md-component="search-reset"]');
            if (searchReset) {
                searchReset.click();
            }
        }
    });
    
    console.log('⌨️ キーボードショートカットを設定');
}

// ショートカット一覧の表示
function showShortcutHelp() {
    const existingHelp = document.getElementById('shortcut-help');
    if (existingHelp) {
        existingHelp.remove();
        return;
    }
    
    const helpModal = document.createElement('div');
    helpModal.id = 'shortcut-help';
    helpModal.innerHTML = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--md-default-bg-color);
            border: 2px solid var(--md-primary-fg-color);
            border-radius: 8px;
            padding: 2rem;
            z-index: 1000;
            max-width: 400px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        ">
            <h3 style="margin-top: 0;">⌨️ キーボードショートカット</h3>
            <table style="width: 100%; margin: 1rem 0;">
                <tr><td><kbd>Ctrl</kbd> + <kbd>K</kbd></td><td>検索を開く</td></tr>
                <tr><td><kbd>Ctrl</kbd> + <kbd>/</kbd></td><td>この一覧を表示</td></tr>
                <tr><td><kbd>ESC</kbd></td><td>検索を閉じる</td></tr>
                <tr><td><kbd>G</kbd> <kbd>H</kbd></td><td>ホームに移動</td></tr>
            </table>
            <button onclick="this.parentElement.parentElement.remove()" style="
                background: var(--md-primary-fg-color);
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 4px;
                cursor: pointer;
            ">閉じる</button>
        </div>
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 999;
        " onclick="document.getElementById('shortcut-help').remove()"></div>
    `;
    
    document.body.appendChild(helpModal);
}

// 読み込み進行状況バー
function addProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.id = 'reading-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: var(--md-accent-fg-color);
        transition: width 0.2s ease;
        z-index: 1000;
    `;
    document.body.appendChild(progressBar);
    
    function updateProgress() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / documentHeight) * 100;
        progressBar.style.width = progress + '%';
    }
    
    window.addEventListener('scroll', updateProgress);
    window.addEventListener('resize', updateProgress);
    updateProgress();
    
    console.log('📊 読み込み進行状況バーを追加');
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
    console.log('- ✅ コピーボタン');
    console.log('- ✅ スムーズスクロール');
    console.log('- ✅ キーボードショートカット');
    console.log('- ✅ 読み込み進行状況バー');
}