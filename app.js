var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var qvc = require('qvc');

var dust = require('dustjs-linkedin');
var cons = require('consolidate');

var auth = require('http-auth');

var basic = auth.basic({
    realm: "Docker SpacePort",
    file: __dirname+"/config/authentication"
});

var app = express();
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

app.use('/deploy', require('./routes/deploy'));

app.use(auth.connect(basic));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/qvc', qvc(
  require('./handlers/container'),
  require('./handlers/app')
));

app.use('/', require('./routes/index'));
app.use('/container', require('./routes/container'));
app.use('/app', require('./routes/app'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
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
      content: {
        message: err.message,
        error: {}
      }
    });
});


module.exports = app;
