const router = require('express-promise-router')();
const rootMenu = require('../private/menu/root');
const spiritsMenu = require('../private/menu/spirits');
const samsara = require('samsara-lib');
const co = require('co');

router.get('/', co.wrap(function*(req, res, next) {
  const spirits = yield samsara().spirits();
  res.render('spirits/index', {
    title: 'Spirits',
    menus: [rootMenu('spirits'), spiritsMenu(spirits)],
    content: {
      spirits: spirits
    }
  });
}));

router.get('/new', co.wrap(function*(req, res, next) {
  const spirits = yield samsara().spirits();
  res.render('spirits/new', {
    title: 'New Spirit',
    menus: [rootMenu('spirits'), spiritsMenu(spirits, null, true)],
    content: {}
  });
}));

module.exports = router;
