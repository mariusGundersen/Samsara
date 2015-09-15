const router = require('express-promise-router')();
const co = require('co');
const passport = require('passport');

router.get('/', co.wrap(function*(req, res, next) {
  return res.render('login/index', {title:'Login', content:{}, menu:null});
}));

router.post('/', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

module.exports = router;
