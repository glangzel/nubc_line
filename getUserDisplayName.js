function getUserDisplayName(user_id) {
// LINE APIを用いて、user_idからLINEのユーザー名を取得する関数。
  var res = UrlFetchApp.fetch(line_endpoint_profile + '/' + user_id, {
                              'headers': {
                              'Content-Type': 'application/json; charset=UTF-8',
                              'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
                              },
                              'method': 'get',
                              });
  return JSON.parse(res).displayName;
  // ユーザー名を返す。
}

function gettime() { //現在日時を取得する関数。
  var date = new Date();
  var format = Utilities.formatDate(date, 'Asia/Tokyo', 'MM/dd/HH:mm');
  return format;
  //日本時刻の'MM/dd/HH:mm'の形式で現在日時を返す。
}
