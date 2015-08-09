const router = require('express-promise-router')();
const samsara = require('samsara-lib');
const makePageModel = require('../pageModels/spirits');
const co = require('co');

router.get('/', co.wrap(function*(req, res, next) {
  const spirits = yield samsara().spirits();
  const configs = yield spirits.map(function(spirit){
    return spirit.config;
  });
  const pageModel = yield makePageModel('Spirits', {spirits: configs});
  res.render('spirits/index', pageModel);
}));

router.get('/new', co.wrap(function*(req, res, next) {
  const pageModel = yield makePageModel('New spirit', {}, 'new');
  res.render('spirits/new', pageModel);
}));

module.exports = router;
