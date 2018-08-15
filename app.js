var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var favicon = require("serve-favicon");
var bodyParser = require("body-parser");
var flash = require("express-flash");
var session = require("express-session");
var expressValidator = require("express-validator");
var methodOverride = require("method-override");
require('dotenv').config();

// will use the PORT environment variable if present,
// else default to a hard coded value of 4000
var port = process.env.PORT || 4000;
// I will be using passport, and the local strategy
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var secret = process.env.SECRET;
// the single user record that is hard
// coded in for the sake of this simplicity
var user = {
  username: process.env.USERNAME,
  id: process.env.ID,
  password: process.env.PASSWORD
};
var connection = require("express-myconnection");
var mysql = require("mysql");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var blankRouter = require("./routes/blankpage");
var playersRouter = require("./routes/players");

var app = express();
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(session({
  secret: secret,
  resave: true,
  saveUninitialized: true,
  cookie:{
    maxAge:7*24*60*1000,
  }
}));
app.use(flash());
app.use(expressValidator());
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body == "object" && "_method" in req.body) {
      var method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

/*------------------------------------------
    connection peer, register as middleware
    type koneksi : single,pool and request 
-------------------------------------------*/
app.use(
  connection(
    mysql, {
      host: process.env.DB_HOST,
      user: process.env.DB_USER, // your mysql user
      password: process.env.DB_PASSWORD, // your mysql password
      port: 3306, //port mysql
      database: process.env.DB_NAME // your database name
    },
    "pool"
  ) //or single
);
// using the local strategy with passport
passport.use( 
  // calling the constructor given by passport-local
  new Strategy(
      // options for passport local
      {
          // using custom field names
          usernameField: 'user',
          passwordField: 'pass'
      },
      // login method
      function (username, password, cb) {
          if (username === user.username && password.toString() === user.password) {
              return cb(null, user);
          }
          // null and false for all other cases
          return cb(null, false);
      }
  )
);

passport.serializeUser(function (user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
  cb(null, user);
});

app.use(passport.initialize());
app.use(passport.session());
function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/login');
}
app.use("/", indexRouter);
// app.use("/users", usersRouter);
// app.use("/blankpage", blankRouter);
app.use("/players",isLoggedIn, playersRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
