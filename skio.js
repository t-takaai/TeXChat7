// dependencies
var mongoose = require('mongoose');
var chatjs = require('./models/chat.js');
var dateutils = require('date-utils');

var conn2 = mongoose.createConnection('mongodb://localhost/chat-contents');
var Chat = conn2.model('Chat');

/**
* socket.io
**/

var skio = function (io) {

  var namestore = {};                                                           // ユーザー名一時格納

  /**
  * chat
  **/

  var chat = io.of('/chat').on('connection', function (socket) {

    // [1-2] メッセージの更新
    socket.on('msg update', function(name) {
      console.log('name is : ' + name);
      namestore[socket.id] = { 'name': name };                                  // ユーザー名一時格納
      Chat.find(function(err, docs) {
        socket.emit('msg open', docs);
      });
    });

    console.log('a user connected');

    // [2-2] 送られてきたメッセージの処理
    socket.on('msg send', function(msg){
      var name = namestore[socket.id].name;
      var date = new Date();
      var data = {
        date: date,
        name: name,
        message: msg
      };
      console.log('message: ' + msg);
      // socket.json.emit('msg push', data);
      // socket.json.broadcast.emit('msg push', data);
      // Save to DB
      var chatdata = new Chat();
      chatdata.date = date;
      chatdata.message = msg;
      chatdata.name = name;
      chatdata.save(function(err) {
        if (err) { console.log(err); }
        socket.json.emit('msg push', chatdata);
        socket.json.broadcast.emit('msg push', chatdata);
      });
    });

    // Delete messages in DB
    socket.on('msg_del', function(id) {
      Chat.findById(id, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          if (result.name === namestore[socket.id].name) {
            result.remove();
            Chat.find(function(err, docs) {
              socket.emit('msg open', docs);
              socket.broadcast.emit('msg open', docs);
            });
          }
        }
      });
    });

    // [under construction]
    socket.on('disconnect', function(){
      console.log('user disconnected');
    });
  });

  /**
  * news
  **/

  var news = io.of('/news').on('connection', function (socket) {
    var dt = new Date();
    socket.emit('news_update', 'Today: ' + dt.toFormat("YYYY / MM / DD DDD"));
  });
}

module.exports = skio;
