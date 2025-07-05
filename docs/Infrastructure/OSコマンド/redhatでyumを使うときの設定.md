# ページが移動しました

!!! info "このページは移動しました"
    このページの内容は [Linux プロキシ設定完全ガイド](/Infrastructure/OSコマンド/linux-proxy-configuration-guide/) に移動しました。
    
    5秒後に自動的にリダイレクトされます。

<div class="redirect-container" style="text-align: center; margin: 2rem 0;">
    <p>リダイレクトされない場合は、以下のボタンをクリックしてください：</p>
    <a href="https://smartscope.blog/Infrastructure/OSコマンド/linux-proxy-configuration-guide/" class="md-button md-button--primary">
        新しいページへ移動
    </a>
</div>

<script>
// ページ読み込み後にリダイレクト
document.addEventListener('DOMContentLoaded', function() {
    // カウントダウン表示
    var countdown = 5;
    var countdownElement = document.createElement('p');
    countdownElement.style.textAlign = 'center';
    countdownElement.style.fontSize = '1.2em';
    countdownElement.innerHTML = '自動リダイレクトまで: <strong>' + countdown + '</strong>秒';
    document.querySelector('.redirect-container').appendChild(countdownElement);
    
    var countdownInterval = setInterval(function() {
        countdown--;
        countdownElement.innerHTML = '自動リダイレクトまで: <strong>' + countdown + '</strong>秒';
        
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            window.location.replace('https://smartscope.blog/Infrastructure/OSコマンド/linux-proxy-configuration-guide/');
        }
    }, 1000);
});
</script>

## 関連記事

- [Linux プロキシ設定完全ガイド - curl・wget・Docker・yum対応](/Infrastructure/OSコマンド/linux-proxy-configuration-guide/)
- [yumコマンドメモ](/Infrastructure/OSコマンド/yumコマンドメモ/)
- [pythonのインストール](/Infrastructure/OSコマンド/pythonのインストール/)