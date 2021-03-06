<messages>
  <ul>
    <li each={ items }>
      <div>
        <button id="delbutton" onclick='{click}' type="button" class="close" aria-hidden="true">&times;</button>
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
    self.items.push({ date: data.date, name: data.name, message: data.message, _id: data._id });
    self.update();
    MathJax.Hub.Queue(["Typeset",MathJax.Hub,"messages"]);                      // MathJaxをかける
  });

  // メッセージの削除
  this.click = function(e) {
    console.log(e.item._id + 'is clicked!');
    chat.emit('msg_del', e.item._id);
  };

</messages>
