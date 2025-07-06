// Live2D猫キャラクター初期化スクリプト - デバッグ強化版

// 既存のすべてのLive2D要素を強制削除
function clearAllLive2DElements() {
    const canvases = document.querySelectorAll('canvas');
    canvases.forEach(canvas => {
        if (canvas.id && (canvas.id.includes('live2d') || canvas.id.includes('L2D'))) {
            canvas.remove();
        }
    });
    
    const waifuElements = document.querySelectorAll('#waifu, .waifu, [id*="live2d"], [class*="live2d"]');
    waifuElements.forEach(element => element.remove());
    
    try {
        localStorage.clear();
        sessionStorage.clear();
    } catch (e) {
        console.log('Storage clear failed:', e);
    }
}

// 新しいLive2Dウィジェット初期化
function initializeTororoCat() {
    console.log('🐱 Starting Tororo cat initialization...');
    clearAllLive2DElements();
    
    setTimeout(() => {
        if (typeof L2Dwidget === 'undefined') {
            console.error('❌ L2Dwidget library not loaded!');
            return;
        }
        
        try {
            // 基本的なTororoモデル設定
            L2Dwidget.init({
                "model": {
                    "jsonPath": "https://unpkg.com/live2d-widget-model-tororo@1.0.5/assets/tororo.model.json",
                    "scale": 1
                },
                "display": {
                    "position": "left",
                    "width": 150,
                    "height": 200,
                    "hOffset": 0,
                    "vOffset": -20,
                    "superSample": 2
                },
                "mobile": {
                    "show": false
                },
                "react": {
                    "opacity": 0.8
                },
                "log": true // デバッグログ有効
            });
            
            console.log('✅ L2Dwidget initialized successfully');
            
            // メッセージ表示機能を追加（短縮した待機時間）
            setTimeout(() => {
                console.log('🔧 Setting up cat messages and hover...');
                setupCatMessages();
                setupMouseHover();
            }, 2000); // 2秒に短縮
            
        } catch (error) {
            console.error('❌ L2Dwidget initialization failed:', error);
        }
    }, 1000);
}

// 改良されたメッセージシステム（コピー機能を先に設定）
function setupCatMessages() {
    console.log('📝 Setting up cat messages...');
    
    const messages = [
        "にゃーん！このサイトへようこそ！",
        "技術ドキュメントを見に来てくれてありがとう！",
        "何か質問があったら遠慮なく聞いてね〜",
        "ホームページだにゃ〜",
        "ここから色々な記事を見れるよ！",
        "どこから見始めようかな？"
    ];
    
    // メッセージ表示用のCSSを確実に追加
    ensureMessageStyles();
    
    // コピー機能のメッセージ（最優先で設定）
    document.addEventListener('copy', function(e) {
        console.log('📋 Copy event detected!', e);
        showCatMessage("コピーしたにゃ〜");
    });
    console.log('✅ Copy event listener added');
    
    // キャラクターエリアのクリックイベント
    document.addEventListener('click', function(e) {
        console.log('👆 Click detected:', e.target, 'at', e.clientX, e.clientY);
        
        // キャンバス、または左側エリアをクリックした時
        if (e.target.tagName === 'CANVAS' || 
            (e.clientX < 200 && e.clientY > window.innerHeight - 250)) {
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            showCatMessage(randomMessage);
            // クリック時はホバーメッセージを隠す
            hideHoverMessage();
            console.log('🐱 Cat clicked, showing message:', randomMessage);
        }
    });
    console.log('✅ Click event listener added');
    
    // 開発者ツールを開いたときのメッセージ
    let devtools = { open: false };
    const devtoolsInterval = setInterval(() => {
        if (window.outerHeight - window.innerHeight > 160) {
            if (!devtools.open) {
                devtools.open = true;
                showCatMessage("にゃーん、開発者ツールを開いてるにゃ〜");
                console.log('🔧 Developer tools opened');
            }
        } else {
            devtools.open = false;
        }
    }, 1000);
    console.log('✅ Developer tools detection added');
    
    // 初回挨拶メッセージ
    setTimeout(() => {
        showCatMessage("にゃーん！このサイトへようこそ！");
        console.log('👋 Welcome message displayed');
    }, 1000); // 1秒に短縮
}

// マウスホバー機能設定（簡略化）
function setupMouseHover() {
    console.log('🖱️ Setting up mouse hover...');
    
    // ホバー位置に応じたメッセージ
    const hoverMessages = {
        head: ["頭を撫でてくれるの？にゃ〜", "気持ちいいにゃん♪"],
        face: ["お顔を見つめてくれてるにゃ〜", "こんにちは！にゃん"],
        body: ["お腹を触ろうとしてる？", "くすぐったいにゃ〜"],
        tail: ["しっぽに興味あるの？", "触らないで〜！"],
        paws: ["肉球を見てるの？", "足先はくすぐったいにゃ〜"]
    };
    
    let hoverTimer;
    let isHovering = false;
    
    // キャンバス要素の監視（より頻繁にチェック）
    function setupCanvasHover() {
        const canvas = document.querySelector('canvas');
        if (!canvas) {
            console.log('⏳ Canvas not found, retrying...');
            setTimeout(setupCanvasHover, 300);
            return;
        }
        
        console.log('🎯 Canvas found, setting up hover events:', canvas);
        
        // マウスイベントをより詳細にログ
        canvas.addEventListener('mouseenter', function(e) {
            isHovering = true;
            console.log('🐭 Mouse entered cat area');
        });
        
        canvas.addEventListener('mouseleave', function(e) {
            isHovering = false;
            clearTimeout(hoverTimer);
            hideHoverMessage();
            console.log('🐭 Mouse left cat area');
        });
        
        canvas.addEventListener('mousemove', function(e) {
            if (!isHovering) return;
            
            clearTimeout(hoverTimer);
            hoverTimer = setTimeout(() => {
                try {
                    const rect = canvas.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    console.log(`🎯 Mouse position: ${x}, ${y} (canvas: ${rect.width}x${rect.height})`);
                    
                    const bodyPart = detectBodyPart(x, y, rect.width, rect.height);
                    const messages = hoverMessages[bodyPart];
                    const message = messages[Math.floor(Math.random() * messages.length)];
                    
                    showHoverMessage(message, e.clientX, e.clientY);
                    console.log(`💬 Hovering over ${bodyPart}: ${message}`);
                } catch (error) {
                    console.error('❌ Hover error:', error);
                }
            }, 600); // 0.6秒に短縮
        });
        
        console.log('✅ Canvas hover events added successfully');
    }
    
    setupCanvasHover();
}

// キャラクターの身体部位を検出（シンプル化）
function detectBodyPart(x, y, width, height) {
    const relativeX = x / width;
    const relativeY = y / height;
    
    console.log(`📍 Relative position: ${relativeX.toFixed(2)}, ${relativeY.toFixed(2)}`);
    
    // シンプルな判定
    if (relativeY < 0.3) {
        return relativeX > 0.3 && relativeX < 0.7 ? 'face' : 'head';
    } else if (relativeY < 0.7) {
        return 'body';
    } else {
        return relativeX < 0.3 || relativeX > 0.8 ? 'tail' : 'paws';
    }
}

// ホバーメッセージ表示（エラーハンドリング強化）
function showHoverMessage(text, mouseX, mouseY) {
    try {
        console.log('💭 Showing hover message:', text);
        
        // 既存のホバーメッセージを削除
        hideHoverMessage();
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'cat-hover-message';
        messageDiv.textContent = text;
        
        // マウス位置に表示（画面外に出ないよう調整）
        const left = Math.min(mouseX + 15, window.innerWidth - 200);
        const top = Math.max(mouseY - 50, 10);
        
        messageDiv.style.cssText = `
            position: fixed !important;
            left: ${left}px !important;
            top: ${top}px !important;
            background: linear-gradient(135deg, #ff6b6b, #feca57) !important;
            color: #fff !important;
            padding: 8px 12px !important;
            border-radius: 20px !important;
            font-size: 12px !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
            z-index: 999999 !important;
            max-width: 180px !important;
            word-wrap: break-word !important;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2) !important;
            animation: hoverMessageFadeIn 0.3s ease-out !important;
            pointer-events: none !important;
            white-space: nowrap !important;
        `;
        
        document.body.appendChild(messageDiv);
        console.log('✅ Hover message displayed');
    } catch (error) {
        console.error('❌ Show hover message error:', error);
    }
}

// ホバーメッセージ非表示
function hideHoverMessage() {
    const existingHoverMessage = document.querySelector('.cat-hover-message');
    if (existingHoverMessage) {
        existingHoverMessage.remove();
        console.log('🗑️ Hover message removed');
    }
}

// メッセージ表示用CSS確実追加
function ensureMessageStyles() {
    if (!document.querySelector('#cat-message-styles')) {
        const style = document.createElement('style');
        style.id = 'cat-message-styles';
        style.textContent = `
            .cat-message {
                position: fixed !important;
                left: 20px !important;
                bottom: 220px !important;
                background: #333 !important;
                color: #fff !important;
                padding: 12px 16px !important;
                border-radius: 12px !important;
                font-size: 14px !important;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
                z-index: 999999 !important;
                max-width: 200px !important;
                word-wrap: break-word !important;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
                border: 2px solid #4CAF50 !important;
                animation: catMessageAnimation 4s ease-in-out forwards !important;
                pointer-events: none !important;
            }
            
            @keyframes catMessageAnimation {
                0% { opacity: 0; transform: translateY(20px) scale(0.8); }
                15% { opacity: 1; transform: translateY(0) scale(1); }
                85% { opacity: 1; transform: translateY(0) scale(1); }
                100% { opacity: 0; transform: translateY(-10px) scale(0.9); }
            }
            
            @keyframes hoverMessageFadeIn {
                from { opacity: 0; transform: scale(0.8); }
                to { opacity: 1; transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
        console.log('🎨 Cat message styles added');
    }
}

// 改良されたメッセージ表示関数
function showCatMessage(text) {
    try {
        console.log('💬 Showing cat message:', text);
        
        // 既存のメッセージを削除
        const existingMessages = document.querySelectorAll('.cat-message');
        existingMessages.forEach(msg => msg.remove());
        
        // ホバーメッセージも隠す
        hideHoverMessage();
        
        // 新しいメッセージを作成
        const messageDiv = document.createElement('div');
        messageDiv.className = 'cat-message';
        messageDiv.textContent = text;
        
        // body に直接追加
        document.body.appendChild(messageDiv);
        console.log('✅ Cat message displayed successfully');
        
        // 4秒後に削除
        setTimeout(() => {
            if (messageDiv && messageDiv.parentNode) {
                messageDiv.remove();
                console.log('🗑️ Cat message removed');
            }
        }, 4000);
        
    } catch (error) {
        console.error('❌ Show cat message error:', error);
    }
}

// スマートフォンチェック
function isMobile() {
    const mobile = window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    console.log('📱 Mobile check:', mobile, 'Width:', window.innerWidth);
    return mobile;
}

// デバッグ用のテスト関数（拡張版）
function testCatMessage(text = "テストメッセージだにゃ〜") {
    console.log('🧪 Testing cat message...');
    showCatMessage(text);
}

// システム情報表示
function debugInfo() {
    console.log('🔍 Debug Info:');
    console.log('- L2Dwidget loaded:', typeof L2Dwidget !== 'undefined');
    console.log('- Canvas elements:', document.querySelectorAll('canvas').length);
    console.log('- Screen size:', window.innerWidth + 'x' + window.innerHeight);
    console.log('- Is mobile:', isMobile());
    console.log('- Message styles loaded:', !!document.querySelector('#cat-message-styles'));
}

// 初期化実行
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('📄 DOM loaded, initializing...');
        debugInfo();
        if (!isMobile()) {
            initializeTororoCat();
        } else {
            console.log('📱 Mobile device detected, skipping Live2D');
        }
    });
} else {
    console.log('📄 DOM already loaded, initializing...');
    debugInfo();
    if (!isMobile()) {
        initializeTororoCat();
    } else {
        console.log('📱 Mobile device detected, skipping Live2D');
    }
}

// グローバルアクセス用（拡張）
window.testCatMessage = testCatMessage;
window.debugInfo = debugInfo;
window.showCatMessage = showCatMessage;