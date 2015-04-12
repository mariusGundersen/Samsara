const router = require('express-promise-router')();
const makePageModel = require('../pageModels/root');
const getUsers = require('../providers/authentication');
const co = require('co');

router.get('/', co.wrap(function*(req, res, next) {
  const users = yield getUsers();
  const pageModel = yield makePageModel('Settings', {
    users: users
  }, 'settings')
  res.render('settings', pageModel);
}));

module.exports = router;
