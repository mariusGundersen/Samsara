const router = require('express-promise-router')();
const co = require('co');
const authentication = require('../routeAuthentication');

router.get('/', co.wrap(function*(req, res, next) {
  return res.render('login/index', {
    title:'Login',
    menus: [],
    content:{message:req.flash('error')}
  });
}));

router.post('/',
  authentication.login(),
  authentication.redirectAfterLogin('/'));

module.exports = router;
