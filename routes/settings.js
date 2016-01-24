const router = require('express-promise-router')();
const root = require('../private/menu/root');
const samsara = require('samsara-lib');
const co = require('co');

router.get('/', co.wrap(function*(req, res, next) {
  const users = yield samsara().users();
  res.render('settings/index', {
    title: 'Settings',
    menus: [root('settings')],
    content: {
      users: users.map(user => ({username: user.username}))
    }
  });
}));

module.exports = router;
