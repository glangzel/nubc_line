// LINE への接続アドレス。
var line_endpoint = 'https://api.line.me/v2/bot/message/reply';
var line_endpoint_profile = 'https://api.line.me/v2/bot/profile';


function doPost(e) {
// 一般的なプログラムのmain関数部分にあたる。チャット内容やユーザ情報を内包したデータを引数 eとして受け取る。
  
  // ここから、受信したデータ eを加工し、ユーザーIDやメッセージを取り出せるようにするための処理。
  var json = JSON.parse(e.postData.contents);  
  var reply_token= json.events[0].replyToken;  
  var contents = e.postData.contents;
  var obj = JSON.parse(contents);
  var events = obj["events"];
  //ここまで
    
  var user_id = json.events[0].source.userId; // LINE ユーザーIDを取得して格納する変数。
  var user_message = json.events[0].message.text; // 受信したメッセージを取得して格納する変数。  
  var user_messageParameter = user_message.split(/\s|\r\n|\n/); // 受信したメッセージを改行で分割して配列として格納する変数。
  
  var reply_messages; // 送信内容を格納する変数。
  
  var spreadSheet = getSpreadSheet(user_id); // ユーザーIDをもとに個々人のスプレッドシート・ブック識別子を取得し、格納する変数。
  Utilities.sleep(500); // 上記処理は少し時間がかかるので、わざと500ミリ秒プログラムを一時停止させる。
  
  var sheet = spreadSheet.getSheets()[0]; // スプレッドシート・ブックの最初のシートを取得し、格納する変数。
    
  
  // キャッシュを定義。一定時間、プログラムが終了されても変数が破棄されないようにする。
  var cache = CacheService.getScriptCache();
  var type = cache.get("type"); // Switch 文での分岐用の変数。
  var temp = cache.get("temp"); // 体温の変数。
  var cond = cache.get("cond"); // 体調に関する変数。
  var travel = cache.get("travel"); // 2週間以内の県外への移動歴に関する変数。
  
  
  //以下、送信された文字列の内容によって処理を変える。
  //記録・削除などの処理の最後には、必ずdeleteAllCache関数を使ってキャッシュの内容を破棄する。

  if ('記録' == user_messageParameter[0]) { //「記録」と入力された場合、体温・体調などの記録を開始する。このタイミングで体温の入力を受け付ける。
    cache.put("type", 1); // Switch文のcase 1に処理を移す。
    reply_messages = ["記録を開始します。\n入力を間違えた場合は、キャンセルボタンで記録をやり直してください\n\nはじめに、体温を数字で入力してください(例:35):"];
  } else if ('削除' == user_messageParameter[0]) {　//「削除」と入力された場合、削除したい記録の行を選択させる。このタイミングで行番号の入力を受け付ける。
    cache.put("type", 5);　// Switch文のcase 5に処理を移す。
    reply_messages = ["検索で表示された表から、削除したい行を入力してください。\nキャンセルボタンで操作を取り消せます。\n\n入力を待機しています..."];
  } else if ('検索' == user_messageParameter[0]) { //「検索」と入力された場合、スプレッドシートのリンクを送信し、入力内容を一覧できるようにする。
    reply_messages = [spreadSheet.getUrl()];
    deleteAllCache(cache);        
  } else if ('グラフ' == user_messageParameter[0]) { //「記録」と入力された場合、sendGraph関数とsendImage関数を使って直近数日間の体温のグラフを送信する。
    //sendGraph(sheet,user_id);
    //deleteAllCache(cache);
    reply_messages = ["調整中です🙇‍♂️"];
  }else if ('キャンセル' == user_messageParameter[0]){  //「キャンセル」と入力された場合、直ちにすべてのキャッシュを破棄して今後の動作に支障をきたさないようにする。
    reply_messages = [ "キャンセルしました。"];
    cache.put("type", 7); // Switch文のcase 7に処理を移す。
  }else{
    
    switch (type) {
      case "1":
        cache.put("temp", user_messageParameter[0]);//入力された体温をキャッシュ tempに格納。
        cache.put("type", 2);// Switch文のcase 2に処理を移す。
        question(events[0],"体に異常があれば症状を記入してください\n特にない場合は、以下のボタンを選択してください。");　// nostatus　関数を使って、体調に関する質問をし、回答を受け付ける。
        break;
      case "2":
        cache.put("cond", user_messageParameter[0]);//入力された、体調についての文字列をキャッシュ tempに格納。
        cache.put("type", 3);// Switch文のcase 3に処理を移す。
        question(events[0],"2週間以内の県外への移動歴を入力してください\n特にない場合は、以下のボタンを選択してください。");// notravel　関数を使って、2週間以内の県外渡航先に関する質問をし、回答を受け付ける。
        break;
      case "3":
        cache.put("travel", user_messageParameter[0]);//入力された、2週間以内の県外渡航先についての文字列をキャッシュ tempに格納。
        cache.put("type", 4);// Switch文のcase 4に処理を移す。
        yesorno(events[0]);// yesorno　関数を使って、「はい」「いいえ」の選択肢ボタンを表示し、確定するか回答を受け付ける。
        break;
      case "4":
        if ("はい"== user_messageParameter[0]) { //case 3において"はい"という文字列が送信された場合
          addToSpreadsheet(temp,cond,travel,sheet); //体温、体調、県外渡航先を、addToSpreadsheet 関数を使ってsheetパラメータのシートに記録。
          if(temp>=37 || cond != "特になし" || travel != "特になし")
          //体温が37度以上、体調と県外渡航先が"特になし"でなかった場合
          //(異常が特にない場合は「特になし」ボタンで簡単に入力できる。nostatus,notravel関数参照)、
          //メッセージを変化させる。
          {
            reply_messages = ["記帳しました。\nコロナウイルスへの感染を特に警戒し、\n人との接触に気を付けつつ、お大事になさってください。"];
          }else{
          reply_messages = [ "記帳しました。"];
          }
          deleteAllCache(cache);
        } else { //case 3において"いいえ"という文字列が送信された場合も含め、"はい"以外であれば、記録をキャンセルしたとみなす。
          reply_messages = [ "受付をキャンセルしました。"];
          deleteAllCache(cache);
        }
        break;
      
      case "5":
        // 予定
        cache.put("temp", user_messageParameter[0]); //入力された、行番号を示す数値をキャッシュ tempに格納。
        cache.put("type", 6);// Switch文のcase 6に処理を移す。
        yesorno(events[0]);// yesorno　関数を使って、「はい」「いいえ」の選択肢ボタンを表示し、確定するか回答を受け付ける。
        break;
      case "6":
        //case 5において"はい"という文字列が送信された場合
        if ("はい"== user_messageParameter[0]) {         
          reply_messages = ["受付が完了しました。"];
          deleteInSpreadSheet(sheet,temp); //deleteInSpreadsheet 関数を使ってsheetパラメータで指定されたシートから、指定された行番号の行の内容を削除する。
        }else { //case 5において"いいえ"という文字列が送信された場合も含め、"はい"以外であれば、記録をキャンセルしたとみなす。
          reply_messages = ["受付をキャンセルしました。"];
        }
        deleteAllCache(cache);
        break;
        
      case "7"://「キャンセル」と入力された場合からの分岐。
        deleteAllCache(cache);
        break;
      
      default: //"記録","検索", "グラフ", "削除" 以外の文字列が送信された場合
        reply_messages = [ "プログラムは開始していません。\n画面下部のメニューボタンから操作してください。"];
        deleteAllCache(cache);
        break;
    }   
  }
  
  // reply_messages=["文字列"]という形式で送信用のテキストを入力できるようにし、その内容を取得する。
  var messages = reply_messages.map(function (v) {
    return {'type': 'text', 'text': v};    
  });     
  // 以下、メッセージ送信用のLINE APIの設定。
  UrlFetchApp.fetch(line_endpoint, {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': reply_token,
      'messages': messages,
    }),
  });
  return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
}
