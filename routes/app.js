var express = require('express');
var router = express.Router();
var Promise = require('promise');
var app = require('../providers/app');
var appContainers = require('../providers/appContainers');
var makePageModel = require('../private/makeAppsPageModel');


router.get('/', function(req, res, next) {
  app
  .list()
  .then(function(list){
    return makePageModel('Apps', {apps:list});
  })
  .then(function(pageModel){
    res.render('app/index', pageModel);
  }).catch(function(error){
    res.render('error', {content: {message: error.message, error: error}});
  });
});


router.get('/new', function(req, res, next) {
  makePageModel('New app', {})
  .then(function(pageModel){
    res.render('app/new', pageModel);
  });
});

router.get('/:name', function(req, res, next) {
  app(req.params.name)
  .config()
  .then(function(config){
    return appContainers(req.params.name)
    .then(function(containers){
      return makePageModel(req.params.name, {
        config: config,
        containers: containers
      }, req.params.name);
    });
  })
  .then(function(pageModel){
    res.render('app/info', pageModel);
  }).catch(function(error){
    res.render('error', {content:{message: error.message, error: error}});
  });
});

router.get('/:name/edit', function(req, res, next) {
  makePageModel('Edit '+req.params.name)
  .then(function(pageModel){
    res.render('app/edit', pageModel);
  });
});

module.exports = router;
