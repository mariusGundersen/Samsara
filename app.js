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

var spirit = express();
spirit.enable('trust proxy');

// view engine setup
spirit.engine('dust', cons.dust);
spirit.set('views', path.join(__dirname, 'views'));
spirit.set('view engine', 'dust');
spirit.set('template_engine', 'dust');

// uncomment after placing your favicon in /public
//spirit.use(favicon(__dirname + '/public/favicon.ico'));
spirit.use(logger('dev'));
spirit.use(bodyParser.json());
spirit.use(bodyParser.urlencoded({ extended: false }));
spirit.use(cookieParser());

spirit.use('/deploy', require('./routes/deploy'));

spirit.use(auth.connect(basic));
spirit.use(express.static(path.join(__dirname, 'public')));

spirit.use('/qvc', qvc(
  require('./handlers/container'),
  require('./handlers/spirit'),
  require('./handlers/spiritConfig')
));

spirit.use('/container(s?)/', require('./routes/container'));
spirit.use('/spirit(s?)/', require('./routes/spirit'));
spirit.use('/', require('./routes/index'));

// catch 404 and forward to error handler
spirit.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (spirit.get('env') === 'development') {
    spirit.use(function(err, req, res, next) {
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
spirit.use(function(err, req, res, next) {
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


module.exports = spirit;
