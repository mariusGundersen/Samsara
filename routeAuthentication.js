'use strict';

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const co = require('co');
const md5 = require('apache-md5');
const auth = require('./private/authentication');

passport.use(new LocalStrategy(co.wrap(function*(username, password, done) {
  try{
    const users = yield auth.users();
    console.log(users);
    const found = users.filter(x => x.username === username)[0];

    if (!found) {
      return done(null, false, { message: 'Incorrect username.' });
    }
    console.log(found.secret);
    console.log(md5(password));
    console.log(md5(password, found.secret));
    if (found.secret !== md5(password, found.secret)) {
      return done(null, false, { message: 'Incorrect password.' });
    }

    return done(null, found.username);
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

module.exports = {
  initialize(){
    return passport.initialize();
  },
  session(){
    return passport.session();
  },
  login(){
    return passport.authenticate('local', {
      failureRedirect: '/login',
      failureFlash: true
    });
  },
  redirectAfterLogin(defaultPath){
    return (req, res) => res.redirect(req.session.returnTo || defaultPath || '/')
  },
  restrict(req, res, next){
    if (req.isAuthenticated())
      return next();
    req.session.returnTo = req.path;
    res.redirect('/login');
  }
};