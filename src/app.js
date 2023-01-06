import bodyParser from "body-parser";
import flash from "connect-flash";
import express from "express";
import session from "express-session";
import logger from "morgan";
import favicon from "serve-favicon";

import {
  errorDev as handleErrorDev,
  errorProd as handleErrorProd,
  notFound as handleNotFound,
} from "./pages/error.js";
import {
  initialize as initializeAuthentication,
  restrict,
  session as authSession,
} from "./private/authentication.js";
import routeAnonymous from "./routeAnonymous.js";
import routeAuthenticated from "./routeAuthenticated.js";

const app = express();
app.enable("trust proxy");

app.use(favicon("./public/favicon.ico"));
app.use(flash());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env["SESSION_SECRET"] || "keyboard cat",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(initializeAuthentication());
app.use(authSession());

app.use(routeAnonymous);
app.use(restrict, routeAuthenticated);

// catch 404 and forward to error handler
app.use(handleNotFound);

// error handler
app.use(app.get("env") === "development" ? handleErrorDev : handleErrorProd);

export default app;
