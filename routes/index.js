const router = require('express-promise-router')();
const root = require('../private/menu/root');
const co = require('co');

router.get('/', co.wrap(function*(req, res, next) {
  res.render('index', {
    title: null,
    menus: [root()],
    content: {}
  });
}));

module.exports = router;
