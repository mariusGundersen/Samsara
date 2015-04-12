const express = require('express');
const router = express.Router();
const spirit = require('../providers/spirit');
const spiritContainers = require('../providers/spiritContainers');
const makePageModel = require('../pageModels/spirit');
const co = require('co');

router.get('/:name', function(req, res, next) {
  co(function*(){
    const config = yield spirit(req.params.name).config();
    const containers = yield spiritContainers(req.params.name);
    return makePageModel(req.params.name, {
      name: req.params.name,
      config: config,
      containers: containers,
      controls: {
        name: req.params.name,
        state: containers.some(function(c){ return c.state == 'running'}) ? 'running' : 'stopped',
        running: containers.some(function(c){ return c.state == 'running'})
      }
    }, req.params.name, 'status');
  })
  .then(function(pageModel){
    res.render('spirits/spirit/status', pageModel);
  }).catch(function(error){
    res.render('error', {content:{message: error.message, error: error}});
  });
});

router.get('/:name/configure', function(req, res, next) {
  co(function*(){
    const config = yield spirit(req.params.name).config();
    return makePageModel(req.params.name, {
      name: req.params.name,
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
  co(function*(){
    const containers = yield spiritContainers(req.params.name);
    return makePageModel(req.params.name, {
      name: req.params.name,
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
