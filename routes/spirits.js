const express = require('express');
const router = express.Router();
const spirit = require('../providers/spirit');
const makePageModel = require('../pageModels/spirits');
const co = require('co');

router.get('/', function(req, res, next) {
  co(function*(){
    const spirits = yield spirit.list();
    const configs = yield spirits.map(function(name){
      return spirit(name).config();
    });
    return makePageModel('Spirits', {spirits: configs});
  })
  .then(function(pageModel){
    res.render('spirits/index', pageModel);
  }).catch(function(error){
    res.render('error', {content: {message: error.message, error: error}});
  });
});

router.get('/new', function(req, res, next) {
  makePageModel('New spirit', {}, 'new')
  .then(function(pageModel){
    res.render('spirits/new', pageModel);
  });
});

module.exports = router;
