
function getUsername(userId) {
  var url = 'https://api.line.me/v2/bot/profile/' + userId;
  var response = UrlFetchApp.fetch(url, {
    'headers': {
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN
    }
  });
  return JSON.parse(response.getContentText()).displayName;
}


function doPost(e) {  
  //変数系
  var contents = e.postData.contents;
  var replyToken = JSON.parse(e.postData.contents).events[0].replyToken;
  var lineType = JSON.parse(e.postData.contents).events[0].type;
  var obj = JSON.parse(contents);
  var events = obj["events"];
  // ユーザーのメッセージを取得
  var userMessage = JSON.parse(e.postData.contents).events[0].message.text;
  //LINEメッセージを「改行」で分割
  var messageParameter = userMessage;
  var userId = JSON.parse(e.postData.contents).events[0].source.userId;
  var userParameter = getUsername(userId);
  //対象のスプレッドシートを取得
  var targetSs = SpreadsheetApp.openById(SPREADSHEET_ID);
  //対象のシート取得
  var targetSht = targetSs.getSheetByName('シート1');
  //最終行取得
  var lastRow = targetSht.getLastRow();
  //現在年月日取得
  var date = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy年MM月dd日');
  var line = 'C';
  //キャッシュ
  var cache = CacheService.getScriptCache();
  var type = cache.get("type");
  var event = cache.get("event");
  
  
  for (var i = 0; i < events.length; i++) {
    if (events[i].type == "message") {
      //choose(events[i]);
      if (events[i].message.type == "text") {
        if (events[i].message.text == "スタート") {
          reply_message(events[i]);
        }else if(events[i].message.text == "実施日を見る"){
          reply(replyToken, "コロナウイルスの影響により新歓の実施は現在未定となっています。\n大変申し訳ありません...");
        }else if(events[i].message.text == "ヘルプ"){
          reply(replyToken, "ただいま準備中です<(＿　＿)>");
        }else if (events[i].message.text == "予約を調べる") {
          var spread = SpreadsheetApp.getActiveSpreadsheet() ;
          var sheet = spread.getSheets()[0] ;          
          var textFinder = sheet.createTextFinder(userParameter);
          var ranges = textFinder.findAll();
          for ( var i = 0; i < ranges.length; i++ ) {
            var range = sheet.getRange(ranges[i].getA1Notation());
            var value = range.getValue();
            var postData = {
              "to": userId,
              "messages": [{
                "type": "text",
                "text": value,
              }]
            };            
            var url = "https://api.line.me/v2/bot/message/push";
            var headers = {
              "Content-Type": "application/json",
              'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
            };
            
            var options = {
              "method": "post",
              "headers": headers,
              "payload": JSON.stringify(postData)
            };
            var response = UrlFetchApp.fetch(url, options);
          }
          //oos(events[i]);
        }else{
          if (type === null) {
            if (userMessage === "予約する") {
              cache.put("type", 1);
              handleMessage(replyToken);
              reply(replyToken, "上記日程からイベントを選択してください。\nプログラムの都合で1度に1つしか選択できません。すみません...");
            }else if (userMessage === "予約を取り消す") {
              cache.put("type", 3);
              reply(replyToken, "予約履歴から、取り消したい予約をコピペして送信してください。\n入力を受け付けています...");
            }else{
              reply(replyToken, "ごめんなさい、個別返信は受け付けていません<(__)>");
            }
          } else {
            if (userMessage === "キャンセル") {
              cache.remove("type");
              reply(replyToken, "受付をキャンセルしました。");
              return;
            }
            
            switch (type) {
              case "1":
                // 予定
                cache.put("event", userMessage);
                cache.put("type", 2);             
                yesorno(events[i]);
                break;
              case "2":
                // 確認の回答がはい or いいえ
                cache.remove("type");
                if (userMessage === "はい") {
                  //A列に年月日
                  targetSht.getRange('A' + (lastRow + 1)).setValue(date);
                  //B列に天気（メッセージの１行目）
                  targetSht.getRange('B' + (lastRow + 1)).setValue(event + " , " + userParameter);  
                  reply(replyToken, "追加しました！\nよろしくお願いします。");
                } else {
                  reply(replyToken, "受付をキャンセルしました。");
                }
                break;
              case "3":
                // 予定
                cache.put("event", userMessage);
                cache.put("type", 4);             
                yesorno(events[i]);
                break;
              case "4":
                // 確認の回答がはい or いいえ
                cache.remove("type");
                if (userMessage === "はい") {
                  var spread = SpreadsheetApp.getActiveSpreadsheet() ;
                  var sheet = spread.getSheets()[0] ;          
                  var textFinder = sheet.createTextFinder(event);
                  var ranges = textFinder.findAll();
                  spread.getRange(ranges[i].getA1Notation()).clear();
                  reply(replyToken, "受付が完了しました。");
                } else {
                  reply(replyToken, "受付をキャンセルしました。");
                }
                break;
              default:
                reply(replyToken, "メッセージを認識できませんでした。\n形式に誤りはないでしょうか。\n「キャンセル」と送信して予定入力をキャンセルすることもできます。");
                break;
            }
          }
        }
      }        
    }
  }
}


function reply(replyToken, message) {
  var url = "https://api.line.me/v2/bot/message/reply";
  UrlFetchApp.fetch(url, {
    "headers": {
      "Content-Type": "application/json; charset=UTF-8",
      "Authorization": "Bearer " + CHANNEL_ACCESS_TOKEN,
    },
    "method": "post",
    "payload": JSON.stringify({
      "replyToken": replyToken,
      "messages": [{
        "type": "text",
        "text": message,
      }],
    }),
  });
  return ContentService.createTextOutput(JSON.stringify({ "content": "post ok" })).setMimeType(ContentService.MimeType.JSON);
}