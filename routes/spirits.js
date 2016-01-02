const router = require('express-promise-router')();
const makePageModel = require('../pageModels/spirits');
const co = require('co');

router.get('/', co.wrap(function*(req, res, next) {
  const pageModel = yield makePageModel('Spirits', null);
  res.render('spirits/index', pageModel);
}));

router.get('/new', co.wrap(function*(req, res, next) {
  const pageModel = yield makePageModel('New spirit', {}, 'new');
  res.render('spirits/new', pageModel);
}));

module.exports = router;
