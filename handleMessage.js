function handleMessage(e) {
  var postData = {
    "replyToken": e,
    "messages": [{
      "type": "text",
      "text": "以下の日程からイベントを選択してください。\nプログラムの都合で1度に1つしか選択できません。すみません...",
      "type": "flex",
      "altText": "参加したい日時を選択してください:",
      "contents":
      {
        "type": "carousel",
        "contents": [
          {
            "type": "bubble",
            "header": {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "text",
                  "text": "平日"
                }
              ]
            },
            "footer": {
              "type": "box",
              "layout": "vertical",
              "spacing": "sm",
              "contents": [
                {
                  "type": "button",
                  "style": "link",
                  "height": "sm",
                  "action": {
                    "type": "message",
                    "label": "4/8水 試乗",
                    "text": "4/8水 試乗"
                  }
                },
                {
                  "type": "button",
                  "style": "link",
                  "height": "sm",
                  "action": {
                    "type": "message",
                    "label": "4/10金 試乗",
                    "text": "4/10金 試乗"
                  }
                },
                {
                  "type": "button",
                  "action": {
                    "type": "message",
                    "label": "4/13月 試乗",
                    "text": "4/13月 試乗"
                  }
                },
                {
                  "type": "button",
                  "action": {
                    "type": "message",
                    "label": "4/16木 試乗",
                    "text": "4/16木 試乗"
                  }
                },
                {
                  "type": "button",
                  "action": {
                    "type": "message",
                    "label": "4/17金 食事会",
                    "text": "4/17金 食事会"
                  }
                },
                {
                  "type": "button",
                  "action": {
                    "type": "message",
                    "label": "4/21月 試乗会",
                    "text": "4/21月 試乗会"
                  }
                },
                {
                  "type": "button",
                  "action": {
                    "type": "message",
                    "label": "4/24金 食事会",
                    "text": "4/24金 食事会"
                  }
                }
              ],
              "flex": 0
            }
          },
          {
            "type": "bubble",
            "header": {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "text",
                  "text": "土日"
                }
              ]
            },
            "footer": {
              "type": "box",
              "layout": "vertical",
              "spacing": "sm",
              "contents": [
                {
                  "type": "button",
                  "style": "link",
                  "height": "sm",
                  "action": {
                    "type": "message",
                    "label": "4/12日 BBQ",
                    "text": "4/12日 BBQ"
                  }
                },
                {
                  "type": "button",
                  "style": "link",
                  "height": "sm",
                  "action": {
                    "type": "message",
                    "label": "4/18土 白山まつり",
                    "text": "4/18土 白山まつり"
                  }
                },
                {
                  "type": "button",
                  "action": {
                    "type": "message",
                    "label": "4/25土 球技大会",
                    "text": "4/25土 球技大会"
                  }
                },
                {
                  "type": "button",
                  "action": {
                    "type": "message",
                    "label": "4/26日 新歓コンパ",
                    "text": "4/26日 新歓コンパ"
                  }
                }
              ],
              "flex": 0
            }
          }
        ]
      }
    }]
  };
  var options = {
    "method": "post",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + CHANNEL_ACCESS_TOKEN
    },
    "payload": JSON.stringify(postData)
  };
  UrlFetchApp.fetch("https://api.line.me/v2/bot/message/reply", options);
}