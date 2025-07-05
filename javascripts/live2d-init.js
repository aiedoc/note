// Live2D猫キャラクター初期化スクリプト
// 既存のウィジェットを完全に置き換え

document.addEventListener('DOMContentLoaded', function() {
    // スマートフォンでは非表示
    if (window.innerWidth < 768) {
        return;
    }
    
    // 既存のLive2D要素を削除
    const existingWaifu = document.getElementById('waifu');
    if (existingWaifu) {
        existingWaifu.remove();
    }
    
    // LocalStorageクリア
    Object.keys(localStorage).forEach(function(key) {
        if (key.includes('live2d') || key.includes('waifu')) {
            localStorage.removeItem(key);
        }
    });
    
    // 新しいLive2Dウィジェット初期化
    if (typeof L2Dwidget !== 'undefined') {
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
                "vOffset": -20
            },
            "mobile": {
                "show": false
            },
            "react": {
                "opacity": 0.8
            },
            "log": false
        });
        
        console.log('Tororo cat model loaded successfully!');
    } else {
        console.error('L2Dwidget not loaded');
    }
});