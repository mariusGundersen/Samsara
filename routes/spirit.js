const router = require('express-promise-router')();
const samsara = require('samsara-lib');
const co = require('co');
const makePageModel = require('../pageModels/spirit');

router.get('/:name', co.wrap(function*(req, res, next) {
  const name = req.params.name;
  const spirit = samsara().spirit(name);
  const state = yield spirit.status;
  const settings = yield spirit.settings;
  const config = yield spirit.containerConfig;
  const isDeploying = yield spirit.isDeploying;
  const currentLife = yield spirit.currentLife;
  const latestLife = yield spirit.latestLife;
  const life = (currentLife || latestLife || {life: '?'}).life;

  const pageModel = yield makePageModel(name, {
    name: name,
    url: settings.url,
    description: settings.description,
    life: life,
    deploy: {
      name: name,
      image: config.image,
      stopBeforeStart: settings.deploymentMethod == 'stop-before-start',
      isDeploying: isDeploying
    },
    controls: {
      name: name,
      canStop: state === 'running',
      canStart: state == 'stopped' && latestLife && (yield latestLife.container),
      canRestart: state == 'running'
    }
  }, name, 'status');
  res.render('spirits/spirit/status', pageModel);
}));

router.get('/:name/settings', co.wrap(function*(req, res, next) {
  const name = req.params.name
  const spirit = samsara().spirit(name);
  const settings = yield spirit.settings;
  const pageModel = yield makePageModel(name, {
    name: name,
    settings: settings
  }, name, 'settings');
  res.render('spirits/spirit/settings', pageModel);
}));

router.get('/:name/configure', co.wrap(function*(req, res, next) {
  const name = req.params.name
  const spirit = samsara().spirit(name);
  const config = yield spirit.containerConfig;
  const pageModel = yield makePageModel(name, {
    name: name,
    repository: repositoryModel(config, name),
    environment: environmentModel(config, name),
    volumes: volumesModel(config, name),
    ports: portsModel(config, name),
    links: linksModel(config, name),
    volumesFrom: volumesFromModel(config, name)
  }, name, 'config');
  res.render('spirits/spirit/configure', pageModel);
}));

router.get('/:name/lives', co.wrap(function*(req, res, next) {
  const spirit = samsara().spirit(req.params.name);
  const lives = yield spirit.lives;
  const list = yield lives.reverse().map(co.wrap(function *(life){
    return {
      name: life.name,
      life: life.life,
      status: yield life.status,
      uptime: yield life.uptime
    };
  }));
  const pageModel = yield makePageModel(req.params.name, {
    name: req.params.name,
    lives: list
  }, req.params.name, 'lives');
  res.render('spirits/spirit/lives', pageModel);
}));

module.exports = router;

function repositoryModel(config, name){
  return {
    name: name,
    image: config.image,
    tag: config.tag
  };
}

function environmentModel(config, name){
  return {
    name: name,
    environment: config.environment
  };
}

function volumesModel(config, name){
  return {
    name: name,
    volumes: config.volumes
  };
}

function portsModel(config, name){
  return {
    name: name,
    ports: config.ports
  };
}

function linksModel(config, name){
  return {
    name: name,
    links: config.links
  };
}

function volumesFromModel(config, name){
  return {
    name: name,
    volumesFrom: config.volumesFrom
  };
}