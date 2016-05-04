var express = require('express');
var passport = require('passport');
var router = express.Router();
var conf = require('config');

var HOST = conf.host;

/* GET index */

/* for the route directory */
router.get('/', function(req, res, next) {
  console.log("GET / req.user:", req.user);
  var displayName = "";
  if (req.user) {                                                               // resistered user
    displayName = req.user.displayName;
    res.render('index', {                                                       // jump to index.ejs
      title: "TeXChat",
      displayName: displayName,
      host: HOST
    });
  } else {                                                                      // unresistered user
    res.redirect('login');                                                      // jump to login.ejs
  }
});

/* for login with google */
router.get('/login', function(req, res) {
  res.render('login', {title: "TeXChat Login", displayName: "Anonymous"});
})

/* for Google OAuth link. */
router.get('/oauth2google', passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/plus.login']
  }),
  function(req, res) {}                                                         // this never gets called
);

/* for the callback of Google OAuth */
router.get('/oauth2callback', passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

/* You can GET this page after authenticated. */
// router.get('/api',
//   ensureAuthenticated,
//   function(req, res) {
//     res.json({
//       message: "You are authenticated!"
//     });
//   }
// );

/* logout */
// router.get('/logout', function(req, res) {
//   req.logout();
//   res.redirect('/');
// });

// check whether authenticated or not
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.sendStatus(401);
}

module.exports = router;
