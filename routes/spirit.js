const router = require('express-promise-router')();
const samsara = require('samsara-lib');
const co = require('co');
const rootMenu = require('../private/menu/root');
const spiritsMenu = require('../private/menu/spirits');
const spiritMenu = require('../private/menu/spirit');

router.get('/:name', co.wrap(function*(req, res, next) {
  const name = req.params.name;
  const spirits = yield samsara().spirits();
  const spirit = samsara().spirit(name);
  const state = yield spirit.status;
  const settings = yield spirit.settings;
  const config = yield spirit.containerConfig;
  const isDeploying = yield spirit.isDeploying;
  const currentLife = yield spirit.currentLife;
  const latestLife = yield spirit.latestLife;
  const life = (currentLife || latestLife || {life: '?'}).life;

  res.render('spirit/index', {
    title: name + ' - Spirit',
    menus: [rootMenu('spirits'), spiritsMenu(spirits, name), spiritMenu(name, 'status')],
    content: {
      name: name,
      url: settings.url,
      description: settings.description,
      life: life,
      deploy: {
        name: name,
        image: config.image+':'+config.tag,
        stopBeforeStart: settings.deploymentMethod == 'stop-before-start',
        isDeploying: isDeploying
      },
      controls: {
        name: name,
        canStop: state === 'running',
        canStart: state == 'stopped' && latestLife && !!(yield latestLife.container),
        canRestart: state == 'running'
      }
    }
  });
}));

router.get('/:name/settings', co.wrap(function*(req, res, next) {
  const name = req.params.name
  const spirits = yield samsara().spirits();
  const spirit = samsara().spirit(name);
  const settings = yield spirit.settings;
  res.render('spirit/settings', {
    title: 'Settings - ' + name + ' - Spirit',
    menus: [rootMenu('spirits'), spiritsMenu(spirits, name), spiritMenu(name, 'settings')],
    content: {
      name: name,
      settings: settings
    }
  });
}));

router.get('/:name/configure', co.wrap(function*(req, res, next) {
  const name = req.params.name
  const spirits = yield samsara().spirits();
  const spirit = samsara().spirit(name);
  const config = yield spirit.containerConfig;
  res.render('spirit/configure', {
    title: 'Configure - ' + name + ' - Spirit',
    menus: [rootMenu('spirits'), spiritsMenu(spirits, name), spiritMenu(name, 'config')],
    content: {
      name: name,
      repository: repositoryModel(config, name),
      environment: environmentModel(config, name),
      volumes: volumesModel(config, name),
      ports: portsModel(config, name),
      links: linksModel(config, name),
      volumesFrom: volumesFromModel(config, name)
    }
  });
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
