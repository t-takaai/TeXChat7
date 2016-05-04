var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ChatSchema = new Schema({
  name: {
    type: String        // user name
  },
  message: {
    type: String        // contents of chat message
  },
  date: {
    type: Date          // creation-time
  }
}, {
  collection: "chat"    // define this collection's name explicitly
});

module.exports = mongoose.model('Chat', ChatSchema);
