function getSpreadSheet(user_id) {
  // user_id を識別子としてシートを取得する関数。
  var sid = PropertiesService.getScriptProperties().getProperty(user_id); //user_id 識別子とスプレッドシート・ブック自体のIDの関連付けをもとにブックのIDを取得して格納する関数。
  if (sid == null) { //user_id 識別子と関連付けられたスプレッドシート・ブックのIDが見つからなかった場合
    return createSpreadSheet(user_id); // createSpreadSheet 関数で新たにブックを作成。
  } else {
    try {
      return SpreadsheetApp.openById(sid);  // sidをもとにスプレッドシート・ブックのIDを取得。
    } catch(e) {
      return createSpreadSheet(user_id); //失敗した場合、createSpreadSheet 関数で新たにブックを作成する。
    }
  }
}

function createSpreadSheet(user_id) {
// user_id を識別子として新たにシートを生成する関数。
  var spreadSheet = SpreadsheetApp.create(getUserDisplayName(user_id));
  // getUserDisplayName 関数で取得したLINE ユーザー名で新たなスプレッドシート・ブックを作る。
  
  var sheet = spreadSheet.getSheets()[0];
  //上記のブックの先頭のシートを取得。
  
  //シートの次の範囲に指定した文字列を埋め込む。
  //(列番号, 行番号)で指定。
  sheet.getRange(1, 1).setValue("日付");
  sheet.getRange( 1, 2).setValue("体温");
  sheet.getRange( 1, 3).setValue("体調");
  sheet.getRange(1, 4).setValue("2週間以内の県外移動先");
  
  
  PropertiesService.getScriptProperties().setProperty(user_id, spreadSheet.getId());// user_id 識別子とスプレッドシート・ブック自体のIDを関連付ける。
  var file = DriveApp.getFileById(spreadSheet.getId()); //スプレッドシート自体のIDを取得。
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.EDIT); // 取得したIDでブックの権限を「公開」に設定。
  
  Utilities.sleep(7500); // 上記処理は少し時間がかかるので、わざと500ミリ秒プログラムを一時停止させる。
  
  return spreadSheet; // スプレッドシート・ブックのデータを返す。
}

function addToSpreadsheet(temp,cond,travel,sheet) {
  // sheet のパラメータで指定したシートに記録を埋め込む関数。
  //引数は、左から体温、症状、2週間以内の県外渡航先、スプレッドシートのシートの識別子。
  
  // シートの最終行を求め、代入する関数。
  var lastRow = sheet.getLastRow();
  
  //シートの次の範囲に指定した文字列を埋め込む。
  //(列番号, 行番号)で指定。
  //最初の行にタイトルを、最後の行+1行に新たに取得した記録を書き込む。
  
  sheet.getRange(1, 1).setValue("日付");
  sheet.getRange( 1, 2).setValue("体温");
  sheet.getRange( 1, 3).setValue("体調");
  sheet.getRange(1, 4).setValue("2週間以内の県外移動先");
  
  sheet.getRange(lastRow + 1, 1).setValue(gettime());//入力した日付
  sheet.getRange(lastRow + 1, 2).setValue(temp);//体温
  sheet.getRange(lastRow + 1, 3).setValue(cond);//症状
  sheet.getRange(lastRow + 1, 4).setValue(travel);//2週間以内の県外渡航先
}

function deleteInSpreadSheet(sheet,temp) {
  // sheet パラメータで指定されたシート内の、temp パラメータに格納されている、指定された行番号の行を削除。
  var lastRow = sheet.getLastRow();
  sheet.deleteRows(temp);
}
