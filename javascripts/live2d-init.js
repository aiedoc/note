// Live2D猫キャラクター初期化スクリプト - 安定版
// stevenjoezhang/live2d-widget-v4を使用

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
                
                // メッセージ表示機能を追加
                setTimeout(() => {
                    addCatMessages();
                }, 2000);
                
                console.log('Tororo cat model initialized successfully!');
            } catch (error) {
                console.error('L2Dwidget initialization failed:', error);
            }
        } else {
            console.error('L2Dwidget library not loaded');
        }
    }, 1000);
}

// 猫のメッセージ機能を追加
function addCatMessages() {
    const messages = [
        "にゃーん！このサイトへようこそ！",
        "技術ドキュメントを見に来てくれてありがとう！",
        "何か質問があったら遠慮なく聞いてね〜",
        "ホームページだにゃ〜",
        "ここから色々な記事を見れるよ！",
        "どこから見始めようかな？"
    ];
    
    // キャラクターがクリックされたときのメッセージ
    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'CANVAS') {
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            showMessage(randomMessage);
        }
    });
    
    // コピー機能のメッセージ
    document.addEventListener('copy', function() {
        showMessage("コピーしたにゃ〜");
    });
    
    // 開発者ツールを開いたときのメッセージ
    let devtools = {
        open: false,
        orientation: null
    };
    
    setInterval(() => {
        if (window.outerHeight - window.innerHeight > 160) {
            if (!devtools.open) {
                devtools.open = true;
                showMessage("にゃーん、開発者ツールを開いてるにゃ〜");
            }
        } else {
            devtools.open = false;
        }
    }, 500);
    
    // 初回メッセージ
    setTimeout(() => {
        showMessage("にゃーん！このサイトへようこそ！");
    }, 3000);
}

// メッセージを表示する関数
function showMessage(text) {
    // 既存のメッセージを削除
    const existingMessage = document.querySelector('.cat-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // 新しいメッセージを作成
    const messageDiv = document.createElement('div');
    messageDiv.className = 'cat-message';
    messageDiv.textContent = text;
    messageDiv.style.cssText = `
        position: fixed;
        left: 20px;
        bottom: 220px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 10px 15px;
        border-radius: 10px;
        font-size: 14px;
        z-index: 9999;
        max-width: 200px;
        word-wrap: break-word;
        animation: fadeInOut 3s ease-in-out;
    `;
    
    // アニメーション用のCSSを追加
    if (!document.querySelector('#cat-message-style')) {
        const style = document.createElement('style');
        style.id = 'cat-message-style';
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translateY(10px); }
                20% { opacity: 1; transform: translateY(0); }
                80% { opacity: 1; transform: translateY(0); }
                100% { opacity: 0; transform: translateY(-10px); }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(messageDiv);
    
    // 3秒後に削除
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 3000);
}

// スマートフォンチェック
function isMobile() {
    return window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// 初期化実行
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        if (!isMobile()) {
            initializeTororoCat();
        }
    });
} else {
    if (!isMobile()) {
        initializeTororoCat();
    }
}