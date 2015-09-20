'use strict';
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const htpasswd = require('htpasswd');
const fs = require('fs-promise');
const co = require('co');

passport.use(new LocalStrategy(co.wrap(function*(username, password, done) {
  try{
    const contents = yield fs.readFile(__dirname +'/config/authentication', 'UTF-8');
    const found = contents
    .replace(/\r\n/g, "\n")
    .split("\n")
    .filter(line => line)
    .map(line => line.split(':'))
    .map(parts => ({
      user: parts.shift(),
      hash: parts.join(':')
    }))
    .filter(account => account.user === username)[0];
    console.log(found);

    if (!found) {
      return done(null, false, { message: 'Incorrect username.' });
    }
    if (!htpasswd.verify(found.hash, password)) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    console.log("done");
    return done(null, found.user);
  }catch(e){
    done(e);
  }
})));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

module.exports = passport;