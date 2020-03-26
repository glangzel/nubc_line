function reply_pict(e) {
  var postData = {
    "replyToken": e.replyToken,
    "messages": [{
      "type": "image",
      "originalContentUrl": "https://lh3.googleusercontent.com/46YIzKWVukeOUutuCXkc6zpPcz33N1OeRzERMOcwYLDavD6v8dKg2r04AvipvtQ1ugfBK1fkcUf9PWIGuFiCe8bcgA0GJj2sqFinFGmIc4AcnZeRJrAhyRAY_U7snVQDuhxVKUUoRcR4SkhvIQqN_oIu_6O4KZj2oePTYgZKWo4KxFlIqtNQl65SlJOhiu1Dar1MAQTGqEbOxocqeqg6KPPl7SuASfgGjDV81w0_BEnRTyJYlR_Gsk8AAzLzfW0_aeIVgvShPnZMlrbEXFochItRgVDI7Mk5uPMeMvo9pSiB0ts4paxdSjH0s-AgPcLXO0mecBZkk5rhLyvYLVkcy49YejVJ4JNMHvBSWDEtZGt04mm0AX6RVU7IQyAuv09VEfTUxR7NWd3c2SeGkZSg-nQ3JYP64bAIaA-TUm_v_FZ2pkVzVWoayg1TXAE2aW6q8cRaIUMg21wde1ZIwcP-oPHf01KX9EA1c8MB_w5jL-egswQv7U1hBIEVyCaJwoUgCEMhqcGwUaZilwfDJsa5mCIYCg64gQQx83ntQzSRT95yhz8_KV86L_9bqfJTOMsW9NXYYU17peqm9Gv7x8XnnoO_ygMyiwc6xojOb9q7GgNoiywQIcsQV956uMASYNQPNKDZE5ZNQqNxO0meprSUt5_bINDfQmmqu8sA6KZ8OSxmFqO5Mwf1nJAmsz8jzWTN9yJUbEYZEA_iLJPhX7fXpVCP20vWlTF0CGvMDpHddSlS_hxK=w640-h646-no",
      "previewImageUrl": "https://lh3.googleusercontent.com/46YIzKWVukeOUutuCXkc6zpPcz33N1OeRzERMOcwYLDavD6v8dKg2r04AvipvtQ1ugfBK1fkcUf9PWIGuFiCe8bcgA0GJj2sqFinFGmIc4AcnZeRJrAhyRAY_U7snVQDuhxVKUUoRcR4SkhvIQqN_oIu_6O4KZj2oePTYgZKWo4KxFlIqtNQl65SlJOhiu1Dar1MAQTGqEbOxocqeqg6KPPl7SuASfgGjDV81w0_BEnRTyJYlR_Gsk8AAzLzfW0_aeIVgvShPnZMlrbEXFochItRgVDI7Mk5uPMeMvo9pSiB0ts4paxdSjH0s-AgPcLXO0mecBZkk5rhLyvYLVkcy49YejVJ4JNMHvBSWDEtZGt04mm0AX6RVU7IQyAuv09VEfTUxR7NWd3c2SeGkZSg-nQ3JYP64bAIaA-TUm_v_FZ2pkVzVWoayg1TXAE2aW6q8cRaIUMg21wde1ZIwcP-oPHf01KX9EA1c8MB_w5jL-egswQv7U1hBIEVyCaJwoUgCEMhqcGwUaZilwfDJsa5mCIYCg64gQQx83ntQzSRT95yhz8_KV86L_9bqfJTOMsW9NXYYU17peqm9Gv7x8XnnoO_ygMyiwc6xojOb9q7GgNoiywQIcsQV956uMASYNQPNKDZE5ZNQqNxO0meprSUt5_bINDfQmmqu8sA6KZ8OSxmFqO5Mwf1nJAmsz8jzWTN9yJUbEYZEA_iLJPhX7fXpVCP20vWlTF0CGvMDpHddSlS_hxK=w640-h646-no"
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