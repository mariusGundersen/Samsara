'use strict';

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const co = require('co');
const samsara = require('samsara-lib');

passport.use(new LocalStrategy(co.wrap(function*(username, password, done) {
  try{
    const users = yield samsara().users();
    const found = users.filter(x => x.username === username)[0];

    if (!found) {
      return done(null, false, { message: 'Unknown user' });
    }

    if (!(yield found.validate(password))) {
      return done(null, false, { message: 'Incorrect password' });
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
