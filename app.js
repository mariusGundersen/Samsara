const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

const dust = require('dustjs-linkedin');
const cons = require('consolidate');
const passport = require('./routeAuthentication');

const mkdirp = require('mkdirp');

mkdirp.sync(__dirname+'/config/spirits');

const app = express();
app.enable('trust proxy');

// view engine setup
app.engine('dust', cons.dust);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'dust');
app.set('template_engine', 'dust');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: process.env['SESSION_SECRET'] || 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());


app.use(require('./routeAnonymous'));
app.use((req, res, next) => {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
}, require('./routeAuthenticated'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    const err = new Error('Not Found');
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
          title: 'Error',
          menu:{settings:false},
          content: {
            message: err.message,
            error: err
          }
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      title: 'Error',
      mentu:{settings:false},
      content: {
        message: err.message,
        error: {}
      }
    });
});


module.exports = app;
