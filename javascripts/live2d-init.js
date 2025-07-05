// Live2D猫キャラクター初期化スクリプト - 完全リセット版

// 既存のすべてのLive2D要素を強制削除
function clearAllLive2DElements() {
    // 既存のキャンバス要素を削除
    const canvases = document.querySelectorAll('canvas');
    canvases.forEach(canvas => {
        if (canvas.id && (canvas.id.includes('live2d') || canvas.id.includes('L2D'))) {
            canvas.remove();
        }
    });
    
    // 既存のwaifu要素を削除
    const waifuElements = document.querySelectorAll('#waifu, .waifu, [id*="live2d"], [class*="live2d"]');
    waifuElements.forEach(element => element.remove());
    
    // LocalStorageを完全クリア
    try {
        localStorage.clear();
        sessionStorage.clear();
    } catch (e) {
        console.log('Storage clear failed:', e);
    }
}

// 新しいLive2Dウィジェット初期化
function initializeTororoCat() {
    // 既存要素をクリア
    clearAllLive2DElements();
    
    // 少し待ってから初期化
    setTimeout(() => {
        if (typeof L2Dwidget !== 'undefined') {
            try {
                L2Dwidget.init({
                    "model": {
                        "jsonPath": "https://cdn.jsdelivr.net/npm/live2d-widget-model-tororo@1.0.5/assets/tororo.model.json",
                        "scale": 1
                    },
                    "display": {
                        "position": "left",
                        "width": 150,
                        "height": 200,
                        "hOffset": 0,
                        "vOffset": -20
                    },
                    "mobile": {
                        "show": false
                    },
                    "react": {
                        "opacity": 0.8
                    },
                    "log": false,
                    "dialog": {
                        "enable": true,
                        "hitokoto": {
                            "enable": true,
                            "api": "https://v1.hitokoto.cn",
                            "message": {
                                "welcome": ["にゃーん！このサイトへようこそ！", "技術ドキュメントを見に来てくれてありがとう！", "何か質問があったら遠慮なく聞いてね〜"],
                                "home": ["ホームページだにゃ〜", "ここから色々な記事を見れるよ！", "どこから見始めようかな？"],
                                "theme": ["テーマ変更だにゃ！", "ダークモードもライトモードも素敵だよ〜", "目に優しいモードを選んでね！"],
                                "copy": ["コピーしたにゃ〜", "コードをコピーできたよ！", "便利な機能だにゃ〜"],
                                "photo": ["写真を見つけたにゃ〜", "この画像、参考になりそうだね！", "技術資料は図解があると分かりやすいよね〜"]
                            }
                        }
                    },
                    "tips": {
                        "console": ["にゃーん、開発者ツールを開いてるにゃ〜", "コンソールで何か調べてるの？", "デバッグ頑張って！"],
                        "copy": ["コピーしたにゃ〜", "クリップボードにコピーできたよ！", "便利でしょ？"],
                        "visibility_change": ["おかえりなさい〜", "ページを見に戻ってきてくれたにゃ〜", "他のタブも見てたの？"]
                    }
                });
                console.log('Tororo cat model initialized successfully!');
            } catch (error) {
                console.error('L2Dwidget initialization failed:', error);
            }
        } else {
            console.error('L2Dwidget library not loaded');
        }
    }, 1000);
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