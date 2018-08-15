var express = require('express');
var passport = require('passport');
var router = express.Router();

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/login');
}
router.use(passport.initialize());
router.use(passport.session());
//---------------------------Test route-----------------------------------------
router.get('/test', function (req, res) {
  return res.send('<marquee><h1>Welcome to the test page</h1></marquee>');
});
/* GET home page. */
router.get('/', isLoggedIn, function(req, res, next) {
  res.render('index', { title: 'Fantasy',user:req.user});
});
router.get('/login', function (req, res) {
    res.render('login', {
        title:'Login',
        user:req.user
    });
});
 
router.post('/login', function (req, res, next){
  passport.authenticate('local',function(err, user, info) {
      if (err){
        next(err);
      }
      if (!user){
        res.status(409).render('login', {msg_error: info});
      }
      req.login(user, function(err){
        if(err){
          console.error(err);
          next(err);
        }
        res.redirect('/');
      });
        // redirect back to /login
        // if login fails
        // failureRedirect: '/login'
      })(req, res, next);
    });
 
//     // end up at / if login works
//     function (req, res) {
//         res.redirect('/');
//     }
// );
 
router.get('/logout',
    function (req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;
