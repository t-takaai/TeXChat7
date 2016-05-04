// dependencies
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('./models/user.js');
var conf = require('config');

var routes = require('./routes/index');

var app = express();

// API Access link for creating client ID and secret:
// https://code.google.com/apis/console/
var GOOGLE_CLIENT_ID = conf.id;
var GOOGLE_CLIENT_SECRET = conf.secret;
var CALLBACK_URL = conf.callback;

// User infomation DB
var conn1 = mongoose.createConnection('mongodb://localhost/passport-google-oauth');
var User = conn1.model('User');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// session & passport settings
app.use(cookieParser());
app.use(session({
  secret: "zombie_walked",
  saveUninitialized: false,
  resave: false,
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

//
// routing
app.use('/', routes);
//

// passport config
// session serializer
passport.serializeUser(function(req, uid, done) {
  console.log("passport.serializeUser uid=", uid);
  // save userID into session
  done(null, uid);
});

// session deserializer
passport.deserializeUser(function(req, uid, done) {
  console.log("passport.deserializeUser uid=", uid);
  // get a user by uid from DB
  User.findOne({
    uid: uid
  }, function(err, user) {
    console.log("findOne: err:", err, "\nuser:", user);
    // Then pass "user" to req. It can be used as "req.user" on the next route
    done(null, user);
  });
});

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: CALLBACK_URL
},
function(accessToken, refreshToken, profile, done) {

  process.nextTick(function() {
    var uid = profile.id;
    var displayName = profile.displayName;
    User.findOneAndUpdate({
      uid: uid
    }, {
      $set: {
        uid: uid,
        displayName: displayName
      }
    }, {
      upsert: true
    }, function(err, user) {
      console.log("findOneAndUpdate err:", err, "user: ", user);
      return done(null, uid);
    });
  }); // process.nextTick

  app.locals.name = profile.displayName;

}));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
