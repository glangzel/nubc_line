function sendGraph(sheet,user_id,folderId) { 
  // 数日間の体温の変動グラフを作成する関数。
  // スプレッドシートのシートのデータと、LINE ユーザーIDが引数。
  
  var to = user_id; // 送信先を格納する変数。トークを送信してきたLINE IDを指定。
  var lastRow = sheet.getLastRow();// シートの最終行を求め、代入する変数。
  
  var range = sheet.getRange(1,1,lastRow,2); // シート上の記録の、日付と体温の部分をすべて取得し、格納する変数。
  var chart = sheet.newChart().addRange(range).setPosition(1, 3, 0, 0).build(); // シート上に一旦rangeの範囲をもとにグラフを生成する。
  var graphImg = chart.getBlob(); // 生成したグラフを画像に変換して格納する変数。
   
  
  var folder = DriveApp.getFolderById(folderId); //上のフォルダIDをもとにフォルダを指定。
  var file = folder.createFile(graphImg); // 指定したフォルダに画像を保存。
  
  var today = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'YYYY-MM-dd'); // YYYY-MM-ddというフォーマットで、送信する日時を画像のファイル名にする。
  file.setName(today);  //画像のファイル名を、今日の日付にする。
  
  file.setSharing(DriveApp.Access.ANYONE, DriveApp.Permission.EDIT); // 画像データの権限を「公開」に設定。
  pushImage(to, file.getDownloadUrl(),file.getDownloadUrl()); // 画像を送信するpushImage関数に、画像とそのURLを送信。
  DriveApp.getFolderById(folderId).removeFile(file); // 送信し終わったら、画像を削除。
}

function pushImage(to, src, srcPreview) {
  // sendGraphで生成した、体温グラフの画像データをLINE APIを用いて送信する関数。
  // 送信先のLINE IDと生成した画像のURL(srcは画像データそのもののURL、srcPreviewはプレビューとして表示する用の画像データのURL)が引数。
  var url = "https://api.line.me/v2/bot/message/push";
  var headers = {
    "Content-Type" : "application/json; charset=UTF-8",
    'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
  };

  var postData = {
    "to" : to,
    "messages" : [
      {
        'type':'image',
        'originalContentUrl':src, // 送信する画像のURLを指定。
        'previewImageUrl':srcPreview,// プレビューとして表示する画像のURLを指定。
      }
    ]
  };

  var options = {
    "method" : "post",
    "headers" : headers,
    "payload" : JSON.stringify(postData)
  };

  return UrlFetchApp.fetch(url, options);
}
