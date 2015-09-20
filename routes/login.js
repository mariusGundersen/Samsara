const router = require('express-promise-router')();
const co = require('co');
const authentication = require('../routeAuthentication');

router.get('/', co.wrap(function*(req, res, next) {
  return res.render('login/index', {title:'Login', content:{message:req.flash('error')}, menu:null});
}));

router.post('/', authentication.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

module.exports = router;
