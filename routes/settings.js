const router = require('express-promise-router')();
const root = require('../private/menu/root');
const authentication = require('../private/authentication');
const co = require('co');

router.get('/', co.wrap(function*(req, res, next) {
  const users = yield authentication.users();
  res.render('settings/index', {
    title: 'Settings',
    menus: [root('settings')],
    content: {
      users: users
    }
  });
}));

module.exports = router;
