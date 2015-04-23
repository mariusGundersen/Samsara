const router = require('express-promise-router')();
const spirit = require('../providers/spirit');
const spiritContainers = require('../providers/spiritContainers');
const makePageModel = require('../pageModels/spirit');
const co = require('co');

router.get('/:name', co.wrap(function*(req, res, next) {
  const containers = yield spiritContainers(req.params.name);
  const runningContainers = containers.filter(function(c){ return c.state == 'running'});
  const state = containers.length == 0 ? 'fresh' : runningContainers.length > 0 ? 'running' : 'stopped';
  const config = yield spirit(req.params.name).config();
  const pageModel = yield makePageModel(req.params.name, {
    name: req.params.name,
    url: config.url,
    description: config.description,
    version: (runningContainers[0] || containers[0] || {version: 0}).version,
    deploy: {
      name: config.name,
      image: config.image,
      tag: config.tag,
      stopBeforeStart: config.deploymentMethod == 'stop-before-start'
    },
    controls: {
      name: req.params.name,
      state: state,
      running: state === 'running',
      stopped: state == 'stopped'
    }
  }, req.params.name, 'status');
  res.render('spirits/spirit/status', pageModel);
}));

router.get('/:name/configure', co.wrap(function*(req, res, next) {
  const config = yield spirit(req.params.name).config();
  const pageModel = yield makePageModel(req.params.name, {
    name: req.params.name,
    config: config
  }, req.params.name, 'config');
  res.render('spirits/spirit/configure', pageModel);
}));

router.get('/:name/versions', co.wrap(function*(req, res, next) {
  const containers = yield spiritContainers(req.params.name);
  const pageModel = yield makePageModel(req.params.name, {
    name: req.params.name,
    containers: containers
  }, req.params.name, 'versions');
  res.render('spirits/spirit/versions', pageModel);
}));

module.exports = router;
