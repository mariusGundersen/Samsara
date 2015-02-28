var express = require('express');
var router = express.Router();
var Promise = require('promise');
var app = require('../providers/app');
var docker = require('../private/docker');
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
    res.render('error', {message: error.message, error: error});
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
    return docker.listContainers({all: true}).then(function(containers){
      return containers.filter(function(container){
        return container.Names.some(function(name){
          var match = /^\/(.*)_v(\d+)$/.exec(name);
          return (match && match[1] == config.name);
        });
      }).map(function(container){
        return {
          Id: container.Id,
          Name: container.Names[0].substr(1),
          Status: container.Status,
          Image: container.Image
        };
      });
    })
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
    res.render('error', {message: error.message, error: error});
  });
});

router.get('/:name/edit', function(req, res, next) {
  makePageModel('Edit '+req.params.name)
  .then(function(pageModel){
    res.render('app/edit', pageModel);
  });
});

module.exports = router;
