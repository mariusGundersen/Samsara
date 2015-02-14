var express = require('express');
var router = express.Router();
var Promise = require('promise');
var app = require('../providers/app');


router.get('/', function(req, res, next) {
  app
  .list()
  .then(function(list){
    res.render('app/index', {
      title: 'Apps',
      apps: list
    });
  }).catch(function(error){
    res.render('error', {message: error.message, error: error});
  });
});


router.get('/new', function(req, res, next) {    
  res.render('app/new', {
    title: 'New app'
  });
});

router.get('/:name', function(req, res, next) {
  app(req.params.name)
  .config()
  .then(function(config){
    res.render('app/info', {
      title: req.params.name,
      config: config
    });
  }).catch(function(error){
    res.render('error', {message: error.message, error: error});
  });
});

router.get('/:name/edit', function(req, res, next) {    
  res.render('app/edit', {
    title: req.params.name
  });
});

module.exports = router;
