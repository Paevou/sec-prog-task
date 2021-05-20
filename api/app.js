var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');

var cors = require('cors');

var session = require('express-session')
// Passport
var passport = require('passport');
require('./controllers/local-strategy')(passport);

// Routers
var userRouter = require('./routes/user')

var userDB = require("./database/userDB");
userDB.userDBInit();



var app = express();
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))
app.use(passport.initialize());
app.use(passport.session());


app.use(bodyParser.json());
app.use(cors());
//Enable CORS for our domain
app.use(function(req, res, next) {
  // res.header("Access-Control-Allow-Origin", "*");
  // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Supertest changes the port always so don't redirect them.
if(process.env.TEST !== "yes") {
  app.enable('trust proxy')
  app.use((req, res, next) => {
    req.secure ? next() : res.redirect('https://' + req.headers.host + ":9000/"  + req.url)
  })
}

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
//app.use('/users', usersRouter);
app.use('/user', userRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log("ERROR", err.message);
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.post('*', (req, res) => {
  console.log("404: ", req.body);
  res.send('404: Not Found');
})

// app.emit("appStarted");
module.exports = app;
