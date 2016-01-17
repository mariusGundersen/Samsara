const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const favicon = require('serve-favicon');

const nth = require('nth');
const dust = require('dustjs-linkedin');
const cons = require('consolidate');
const authentication = require('./routeAuthentication');

const app = express();
app.enable('trust proxy');

// view engine setup
dust.filters.nth = function(value){
  try{
    return nth.appendSuffix(value);
  }catch(e){
    return 'no';
  }
}
const startTime = new Date().toISOString().replace(/\D/g, '');
dust.helpers.cachebust = function(chunk){
  chunk.write(startTime);
  return chunk;
}

app.engine('dust', cons.dust);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'dust');

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(flash());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: process.env['SESSION_SECRET'] || 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));
app.use(authentication.initialize());
app.use(authentication.session());

app.use(require('./routeAnonymous'));
app.use(authentication.restrict, require('./routeAuthenticated'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      title: 'Error',
      content: {
        message: err.message,
        error: app.get('env') === 'development' ? err : {}
      }
    });
});

module.exports = app;
