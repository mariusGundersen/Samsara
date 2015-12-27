const router = require('express-promise-router')();
const makePageModel = require('../pageModels/root');
const authentication = require('../private/authentication');
const co = require('co');

router.get('/', co.wrap(function*(req, res, next) {
  const users = yield authentication.users();
  const pageModel = yield makePageModel('Settings', {
    users: users
  }, 'settings')
  res.render('settings', pageModel);
}));

module.exports = router;
