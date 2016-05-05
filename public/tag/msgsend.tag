<msgsend>
<form onsubmit={ add } class="input-group" style="margin-bottom:5px">
  <input type="text" id="m" autocomplete="off" class="form-control" placeholder="message">
  <span class="input-group-btn">
    <button type="submit" class="btn btn-primary">Send</button>
  </span>
</form>

// [2-1] メッセージの送信
add(e) {
  var input = e.target[0];
  msg = xssFilters.inHTMLData(input.value);
  chat.emit('msg send', msg);                                                   // サーバーに送る
  input.value = ''
}

</msgsend>
