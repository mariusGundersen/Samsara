import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import session from 'express-session';
import flash from 'connect-flash';
import favicon from 'serve-favicon';

import {initialize as initializeAuthentication, restrict, session as authSession} from './private/authentication';
import routeAnonymous from './routeAnonymous';
import routeAuthenticated from './routeAuthenticated';
import {notFound as handleNotFound, errorProd as handleErrorProd, errorDev as handleErrorDev} from './pages/error';

const app = express();
app.enable('trust proxy');

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
app.use(handleNotFound);

// error handler
app.use(app.get('env') === 'development'
  ? handleErrorDev
  : handleErrorProd);

export default app;
