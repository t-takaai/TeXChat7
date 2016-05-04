
// dependencies
var xssFilters = require('xss-filters');
var mongoose = require('mongoose');
var chatjs = require('./models/chat.js');
var dateutils = require('date-utils');

var conn2 = mongoose.createConnection('mongodb://localhost/chat-contents');
var Chat = conn2.model('Chat');

/**
* socket.io
**/

var skio = function (io) {

  var namestore = {};                                                           // ユーザー名一時格納場所

  /**
  * chat
  **/

  var chat = io.of('/chat').on('connection', function (socket) {

    // [1-2] メッセージの更新
    socket.on('msg update', function(name) {
      console.log('name is : ' + name);
      namestore[socket.id] = { 'name': name };                                  // ユーザー名の一時格納
      Chat.find(function(err, docs) {
        socket.emit('msg open', docs);
        // socket.emit('msg open', JSON.stringify(docs));
      });
    });

    console.log('a user connected');

    // [2-2] 送られてきたメッセージの処理
    socket.on('msg send', function(msg){
      msg = xssFilters.inHTMLData(msg);
      name = namestore[socket.id].name;
      console.log('message: ' + msg);
      socket.json.emit('msg push', {
        msg: msg,
        name: name
      });
      socket.json.broadcast.emit('msg push', {
        msg: msg,
        name: name
      });
      // Save to DB
      var chatdata = new Chat();
      chatdata.message = msg;
      chatdata.date = new Date();
      chatdata.name = namestore[socket.id].name;
      chatdata.save(function(err) {
        if (err) { console.log(err); }
      });
    });

    // [under construction] Delete messages in DB
    socket.on('deleteDB', function() {
      socket.emit('db drop');
      socket.broadcast.emit('db drop');
      Chat.find().remove();
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
