function reply_message(e) {
  var postData = {
    "replyToken": e.replyToken,
    "messages": [{
      "type": "text",
      "text": "こんにちは!\nここではイベント参加の予約、確認が行えます。\nまた「実施日を見る」では、イベントのスケジュールカレンダーが見られます。",
      "quickReply": {
        "items": [{
          "type": "action",
          "action": {
            "type": "message",
            "label": "予約する",
            "text": "予約する"
          }
        },
                  {
                    "type": "action",
                    "action": {
                      "type": "message",
                      "label": "予約を調べる",
                      "text": "予約を調べる"
                    }
                  },
                  {
                    "type": "action",
                    "action": {
                      "type": "message",
                      "label": "予約を取り消す",
                      "text": "予約を取り消す"
                    }
                  },
                  {
                    "type": "action",
                    "action": {
                      "type": "message",
                      "label": "実施日を見る",
                      "text": "実施日を見る"
                    }
                  }
                 ]
      }
    }
                 
                ]
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