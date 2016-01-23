import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';
import samsara from 'samsara-lib';

passport.use(new LocalStrategy(async function(username, password, done) {
  try{
    const users = await samsara().users();
    const found = users.filter(x => x.username === username)[0];

    if (!found) {
      return done(null, false, { message: 'Unknown user' });
    }

    if (!(await found.validate(password))) {
      return done(null, false, { message: 'Incorrect password' });
    }

    return done(null, found.username);
  }catch(e){
    done(e);
  }
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

export function initialize(){
  return passport.initialize();
};
export function session(){
  return passport.session();
};
export function login(){
  return passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
  });
};
export function redirectAfterLogin(defaultPath){
  return (req, res) => res.redirect(req.session.returnTo || defaultPath || '/')
};
export function restrict(req, res, next){
  if (req.isAuthenticated())
    return next();
  req.session.returnTo = req.path;
  res.redirect('/login');
};
