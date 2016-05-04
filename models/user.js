var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
  uid: {                // User ID
    type: String,
    unique: true
  },
  displayName: {        // User name
    type: String
  }
}, {
  collection: "users"   // define this collection's name explicitly
});

module.exports = mongoose.model('User', User);
