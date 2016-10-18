var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sanitizeHtml = require('sanitize-html');
var routes = require('./routes/index');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var db; // storage var for database connection

// Utilise connection pooling, initialise app after db connection
// is established
MongoClient.connect('mongodb://localhost:27017/shourl', function(err, database) {
  if(err) throw err;

  db = database;
  app.listen(3000);
  console.log('Listening on port 3000');
});

// make database connection available to routing middleware
app.use(function(req, res, next) {
  req.db = db;
  next();
});

// sanitize param and query objects
app.use(function(req, res, next) {
  var paramKeys = Object.keys(req.params);
  var queryKeys = Object.keys(req.query);
  var escapedContent; // loop variable for storing escaped strings

  paramKeys.forEach(function(key) {
    escapedContent = sanitizeHtml(req.params[key], {
      allowedTags: [],
      allowedAttributes: []
    });
    req.params[key] = escapedContent.replace(/&quot;/g, '"');
  });

  queryKeys.forEach(function(key) {
    escapedContent = sanitizeHtml(req.query[key], {
      allowedTags: [],
      allowedAttributes: []
    });
    req.query[key] = escapedContent.replace(/&quot;/g, '"');
  });

  next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//       message: err.message,
//       error: err
//     });
//   });
// }

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
