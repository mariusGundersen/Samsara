const router = require('express-promise-router')();
const makePageModel = require('../pageModels/root');
const co = require('co');

router.get('/', co.wrap(function*(req, res, next) {
  const pageModel = makePageModel('Samsara', {}, null);
  res.render('index', pageModel);
}));

module.exports = router;
