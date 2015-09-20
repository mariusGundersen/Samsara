const router = require('express-promise-router')();
const samsara = require('samsara-lib');
const makePageModel = require('../pageModels/spirit');
const co = require('co');

router.get('/:name', co.wrap(function*(req, res, next) {
  const spirit = samsara().spirit(req.params.name);
  const state = yield spirit.status;
  const config = yield spirit.config;
  const isDeploying = yield spirit.isDeploying;
  const currentLife = yield spirit.currentLife;
  const life = (currentLife || (yield spirit.latestLife) || {life: '?'}).life;
  
  const pageModel = yield makePageModel(req.params.name, {
    name: req.params.name,
    url: config.url,
    description: config.description,
    version: life,
    deploy: {
      name: config.name,
      image: config.image,
      tag: config.tag,
      stopBeforeStart: config.deploymentMethod == 'stop-before-start',
      isDeploying: isDeploying
    },
    controls: {
      name: req.params.name,
      canStop: state === 'running',
      canStart: state == 'stopped' && currentLife && (yield currentLife.container),
      canRestart: state == 'running'
    }
  }, req.params.name, 'status');
  res.render('spirits/spirit/status', pageModel);
}));

router.get('/:name/configure', co.wrap(function*(req, res, next) {
  const spirit = samsara().spirit(req.params.name);
  const config = yield spirit.config;
  const pageModel = yield makePageModel(req.params.name, {
    name: req.params.name,
    config: config
  }, req.params.name, 'config');
  res.render('spirits/spirit/configure', pageModel);
}));

router.get('/:name/versions', co.wrap(function*(req, res, next) {
  const spirit = samsara().spirit(req.params.name);
  const lives = yield spirit.lives;
  const list = yield lives.reverse().map(co.wrap(function *(life){
    return {
      name: life.name,
      life: life.life,
      status: yield life.status,
      uptime: ''
    };
  }));
  const pageModel = yield makePageModel(req.params.name, {
    name: req.params.name,
    lives: list
  }, req.params.name, 'versions');
  res.render('spirits/spirit/versions', pageModel);
}));

module.exports = router;
