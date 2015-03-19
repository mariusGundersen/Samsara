var express = require('express');
var router = express.Router();
var spirit = require('../providers/spirit');
var spiritContainers = require('../providers/spiritContainers');
var makePageModel = require('../pageModels/spirit');

router.get('/:name', function(req, res, next) {
  spirit(req.params.name)
  .config()
  .then(function(config){
    return spiritContainers(req.params.name)
    .then(function(containers){
      return makePageModel(req.params.name, {
        config: config,
        containers: containers,
        controls: {
          name: req.params.name,
          state: containers.some(function(c){ return c.state == 'running'}) ? 'running' : 'stopped',
          running: containers.some(function(c){ return c.state == 'running'})
        }
      }, req.params.name, 'status');
    });
  })
  .then(function(pageModel){
    res.render('spirits/spirit/status', pageModel);
  }).catch(function(error){
    res.render('error', {content:{message: error.message, error: error}});
  });
});

router.get('/:name/configure', function(req, res, next) {
  spirit(req.params.name)
  .config()
  .then(function(config){
    return makePageModel(req.params.name, {
      config: config
    }, req.params.name, 'config');
  })
  .then(function(pageModel){
    res.render('spirits/spirit/configure', pageModel);
  }).catch(function(error){
    res.render('error', {content:{message: error.message, error: error}});
  });
});

router.get('/:name/versions', function(req, res, next) {
  return spiritContainers(req.params.name)
  .then(function(containers){
    return makePageModel(req.params.name, {
      containers: containers
    }, req.params.name, 'versions');
  })
  .then(function(pageModel){
    res.render('spirits/spirit/versions', pageModel);
  }).catch(function(error){
    res.render('error', {content:{message: error.message, error: error}});
  });
});

module.exports = router;
