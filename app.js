var createError = require('http-errors');
var express = require('express');
var path = require('path'); //path module is imported and stored in 'path' variable
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressLayouts=require('express-ejs-layouts');

var indexRouter = require('./routes/index'); //imports ./routes/index module here, in app.js
var usersRouter = require('./routes/users'); //imports ./routes/users module here, in app.js

var app = express(); //an object of express is created 'app'

// view engine setup
app.set('views', path.join(__dirname, 'views'));  //
app.set('view engine', 'ejs'); 

app.use(expressLayouts);//sets files in ./views to ejs files

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);      //means whenever we write localhost:3000/ in browser, indexRouter is run
app.use('/users', usersRouter); //means whenever we write localhost:3000/users in browser, usersRouter is run

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

module.exports = app; //make 'app' object available for imports in other files
