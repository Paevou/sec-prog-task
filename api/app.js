var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var userRouter = require('./routes/user')
// Test routes
var testAPIRouter = require("./routes/testAPI");

var userDB = require("./database/userDB");
userDB.userDBInit();

var app = express();

/**
 * Redirect http traffic to https
 */
app.enable('trust proxy');
app.use((req, res, next) => {
  if(req.secure) {
    next();
  } else {
    res.writeHead(301, {"Location": "https://" + req.headers['host'] + ":" + port + req.url});
    res.end();
  }
});

app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// React Build Folder
app.use(express.static(path.join(__dirname, '../client/build')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});
app.use('/users', usersRouter);
app.use('/user', userRouter);

// Test routes
app.use("/testAPI", testAPIRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.post('*', (req, res) => {
  console.log("404: ", req.body);
  res.send('404: Not Found');
})

module.exports = app;
