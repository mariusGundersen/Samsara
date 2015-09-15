const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

const dust = require('dustjs-linkedin');
const cons = require('consolidate');

const auth = require('http-auth');
const mkdirp = require('mkdirp');

mkdirp.sync(__dirname+'/config/spirits');

const basic = auth.basic({
    realm: "Samsara",
    file: __dirname+"/config/authentication"
});

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const htpasswd = require('htpasswd');
const fs = require('fs');

passport.use(new LocalStrategy(
  function(username, password, done) {
    const lines = fs.readFileSync(__dirname +'/config/authentication', 'UTF-8').replace(/\r\n/g, "\n").split("\n");
    const accounts = lines.filter(line => line).map(line => {
      const split = line.split(':');
      return {
        user: split.shift(),
        hash: split.join(':')
      };
    });
    
    const found = accounts.filter(account => account.user === username)[0];
    console.log(found);
    
    if (!found) {
      return done(null, false, { message: 'Incorrect username.' });
    }
    if (!htpasswd.verify(found.hash, password)) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    console.log("done");
    return done(null, found.user);
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

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
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());


app.use(require('./routeAnonymous'));
//app.use(auth.connect(basic));
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
