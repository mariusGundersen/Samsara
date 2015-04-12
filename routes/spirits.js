const router = require('express-promise-router')();
const spirit = require('../providers/spirit');
const makePageModel = require('../pageModels/spirits');
const co = require('co');

router.get('/', co.wrap(function*(req, res, next) {
  const spirits = yield spirit.list();
  const configs = yield spirits.map(function(name){
    return spirit(name).config();
  });
  const pageModel = yield makePageModel('Spirits', {spirits: configs});
  res.render('spirits/index', pageModel);
}));

router.get('/new', co.wrap(function*(req, res, next) {
  const pageModel = yield makePageModel('New spirit', {}, 'new');
  res.render('spirits/new', pageModel);
}));

module.exports = router;
