var express = require('express');
var router = express.Router();
var spirit = require('../providers/spirit');
var makePageModel = require('../pageModels/spirits');

router.get('/', function(req, res, next) {
  spirit
  .list()
  .then(function(spirits){
    return Promise.all(spirits.map(function(name){
      return spirit(name).config();
    }));
  })
  .then(function(result){
    return makePageModel('Spirits', {spirits:result});
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
