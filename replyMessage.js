var que; //質問文の文字列を代入する変数。

function yesorno(e) { 
  //「確定しますか?」と聞き、「はい」と「いいえ」のボタン選択肢を表示するプログラム。
  // ボタンを押すか、テキストを入力して送信すると、ボタン上のテキストか入力したテキストが送信される。
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
  
  // 送信するためのLINE APIの設定。
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


function question(e,que) { //変数queに格納された文字列の内容を表示し、「特になし」のボタン選択肢を表示するプログラム。
  var postData = {
    "replyToken": e.replyToken,
    "messages": [{
      "type": "text",
      "text": que,
      "quickReply": {
        "items": [{
          "type": "action",
          "action": {
            "type": "message",
            "label": "特になし",
            "text": "特になし"
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
