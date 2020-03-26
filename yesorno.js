function yesorno(e) {
  var postData = {
    "replyToken": e.replyToken,
    "messages": [{
      "type": "text",
      "text": "確定しますか?",
      "quickReply": {
        "items": [{
          "type": "action",
          "action": {
            "type": "message",
            "label": "はい",
            "text": "はい"
          }
        },
                  {
                    "type": "action",
                    "action": {
                      "type": "message",
                      "label": "いいえ",
                      "text": "いいえ"
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