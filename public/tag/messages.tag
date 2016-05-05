<messages>
  <ul>
    <li each={ items }>
      <div class="alert alert-success alert-dismissable">
        <button class="close" data-dismiss="alert">&times;</button>
        <div id="msgdate">{ moment(date).format('M/D HH:mm') }</div>{ name } : { message }
      </div>
    </li>
  </ul>
  <style>
    messages #msgdate { font-size: 70% }
  </style>

  var self = this;

  // [1-2] データベースのメッセージ表示
  chat.on('msg open', function(data) {
    if(data.length == 0) {
      console.log('message is empty!');
      return;
    } else {
      self.items = data;
      self.update();
      MathJax.Hub.Queue(["Typeset",MathJax.Hub,"messages"]);                    // MathJaxをかける
    }
  });

  // [2-3] 追加したメッセージの表示
  chat.on('msg push', function(data){
    self.items.push({ date: data.date, name: data.name, message: data.message});
    self.update();
    MathJax.Hub.Queue(["Typeset",MathJax.Hub,"messages"]);                      // MathJaxをかける
  });

  <!-- $(function() {                                                                // 下までスクロール
    $('body').delay(100).animate({
    scrollTop: $(document).height()
    },1500);
    setTimeout(function() {
      window.scroll(0,$(document).height());
    },0);
  }); -->

</messages>
