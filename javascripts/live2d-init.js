// Live2D猫キャラクター初期化スクリプト - メッセージ表示修正版

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
    clearAllLive2DElements();
    
    setTimeout(() => {
        if (typeof L2Dwidget !== 'undefined') {
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
                    "log": false
                });
                
                console.log('Tororo cat model initialized successfully!');
                
                // メッセージ表示機能を追加
                setTimeout(() => {
                    setupCatMessages();
                }, 3000);
                
            } catch (error) {
                console.error('L2Dwidget initialization failed:', error);
            }
        } else {
            console.error('L2Dwidget library not loaded');
        }
    }, 1000);
}

// 改良されたメッセージシステム
function setupCatMessages() {
    console.log('Setting up cat messages...');
    
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
    
    // キャラクターエリアのクリックイベント
    document.addEventListener('click', function(e) {
        console.log('Click detected:', e.target);
        // キャンバス、または左側エリアをクリックした時
        if (e.target.tagName === 'CANVAS' || 
            (e.clientX < 200 && e.clientY > window.innerHeight - 250)) {
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            showCatMessage(randomMessage);
        }
    });
    
    // コピー機能のメッセージ
    document.addEventListener('copy', function() {
        showCatMessage("コピーしたにゃ〜");
    });
    
    // 開発者ツールを開いたときのメッセージ
    let devtools = { open: false };
    setInterval(() => {
        if (window.outerHeight - window.innerHeight > 160) {
            if (!devtools.open) {
                devtools.open = true;
                showCatMessage("にゃーん、開発者ツールを開いてるにゃ〜");
            }
        } else {
            devtools.open = false;
        }
    }, 1000);
    
    // 初回挨拶メッセージ
    setTimeout(() => {
        showCatMessage("にゃーん！このサイトへようこそ！");
        console.log('Welcome message should be displayed');
    }, 2000);
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
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif !important;
                z-index: 999999 !important;
                max-width: 200px !important;
                word-wrap: break-word !important;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
                border: 2px solid #4CAF50 !important;
                animation: catMessageAnimation 4s ease-in-out forwards !important;
                pointer-events: none !important;
            }
            
            @keyframes catMessageAnimation {
                0% { 
                    opacity: 0; 
                    transform: translateY(20px) scale(0.8); 
                }
                15% { 
                    opacity: 1; 
                    transform: translateY(0) scale(1); 
                }
                85% { 
                    opacity: 1; 
                    transform: translateY(0) scale(1); 
                }
                100% { 
                    opacity: 0; 
                    transform: translateY(-10px) scale(0.9); 
                }
            }
        `;
        document.head.appendChild(style);
        console.log('Cat message styles added');
    }
}

// 改良されたメッセージ表示関数
function showCatMessage(text) {
    console.log('Showing cat message:', text);
    
    // 既存のメッセージを削除
    const existingMessages = document.querySelectorAll('.cat-message');
    existingMessages.forEach(msg => msg.remove());
    
    // 新しいメッセージを作成
    const messageDiv = document.createElement('div');
    messageDiv.className = 'cat-message';
    messageDiv.textContent = text;
    
    // body に直接追加
    document.body.appendChild(messageDiv);
    console.log('Message element added to body');
    
    // 4秒後に削除
    setTimeout(() => {
        if (messageDiv && messageDiv.parentNode) {
            messageDiv.remove();
            console.log('Message removed');
        }
    }, 4000);
    
    // 強制的に表示確認
    setTimeout(() => {
        const rect = messageDiv.getBoundingClientRect();
        console.log('Message position:', rect);
    }, 100);
}

// スマートフォンチェック
function isMobile() {
    return window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// デバッグ用のテスト関数
function testCatMessage() {
    showCatMessage("テストメッセージだにゃ〜");
}

// 初期化実行
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM loaded, initializing...');
        if (!isMobile()) {
            initializeTororoCat();
        } else {
            console.log('Mobile device detected, skipping Live2D');
        }
    });
} else {
    console.log('DOM already loaded, initializing...');
    if (!isMobile()) {
        initializeTororoCat();
    } else {
        console.log('Mobile device detected, skipping Live2D');
    }
}

// グローバルアクセス用
window.testCatMessage = testCatMessage;