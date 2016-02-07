import express from 'express';
import path from 'path';
import logger from 'morgan';
import bodyParser from 'body-parser';
import session from 'express-session';
import flash from 'connect-flash';
import favicon from 'serve-favicon';

import nth from 'nth';
import dust from 'dustjs-linkedin';
import cons from 'consolidate';

import {initialize as initializeAuthentication, restrict, session as authSession} from './private/authentication';
import routeAnonymous from './routeAnonymous';
import routeAuthenticated from './routeAuthenticated';

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
app.set('views', path.join(__dirname, 'pages'));
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
app.use(initializeAuthentication());
app.use(authSession());

app.use(routeAnonymous);
app.use(restrict, routeAuthenticated);

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

export default app;
