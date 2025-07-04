#Incoming WebHooksのURL
WEBHOOKURL=""
TOKEN=""

# 送信チャンネル
CHANNEL=""

# 送信名
BOTNAME="お知らせ"

# アイコン(mattermostの設定で上書き不可)
FACEICON="https://developer.github.com/assets/images/gundamcat.png"

# 今週の月曜日の日付け取得
DATE_MON=`date --date 'next monday last week' +'%m/%d'`

# 今日の日付を取得
DATE1=`date +"%m/%d"`
DATE2=`date +%-m/%-d`

# GitHubのAPIURL
GITHUB_API=""
# GitHubの組織名
GITHUB_ORG=""
# GitHubのプロジェクト(カンバン)名
PROJECT_NAME=""

PROJECT_ID=`curl -s -u username:$TOKEN GET $GITHUB_API/orgs/$GITHUB_ORG/projects -H 'Accept: application/vnd.github.inertia-preview+json'  | jq -r '.[] | select(.name | startswith("'$PROJECT_NAME'"))' | jq .id`
COLUMNS_ID=`curl -s -u username:$TOKEN GET $GITHUB_API/projects/$PROJECT_ID/columns -H 'Accept: application/vnd.github.inertia-preview+json'  | jq -r '.[] | select(.name | startswith("'$DATE_MON'"))' | jq .id`
TEXT=`curl -s -u username:$TOKEN GET $GITHUB_API/projects/columns/$COLUMNS_ID/cards -H 'Accept: application/vnd.github.inertia-preview+json' |  jq -c .[].note | grep -e $DATE1 -e $DATE2`

#メッセージ作成
echo "#### @channel  本日 `date +"%m/%d %a"` のCIC帯同作業当番は\n" > test.txt
echo "$TEXT" >> test.txt
echo "- [$PROJECT_NAME](https://bps-github.pstg.paas.cloud.global.fujitsu.com/orgs/K5PaaS-Ops/projects/3)\n" >> test.txt
echo "- [PaaS担当　CICルーム　入室申請サイト](http://workflow.gcs.g01.fujitsu.local/sites/f4042/cic/Lists/PaaSCIC/NewForm.aspx?RootFolder=)\n" >> test.txt

sed -i 's/"//g' test.txt
MESSAGE=`cat test.txt`

rm test.txt

# json形式に整形
payload="payload={
    \"channel\": \"${CHANNEL}\",
    \"username\": \"${BOTNAME}\",
    \"icon_url\": \"${FACEICON}\",
    \"text\": \"${MESSAGE}\"
}"

# 送信
curl -s -S -X POST --data-urlencode "payload={\"channel\": \"${CHANNEL}\", \"username\": \"${BOTNAME}\", \"icon_url\": \"${FACEICON}\", \"text\": \"${MESSAGE}\" }" ${WEBHOOKURL}
