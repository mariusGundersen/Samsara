import Router from 'express-promise-router';
import samsara from 'samsara-lib';

import view from './index';
import rootMenu from '../index/indexMenu';
import spiritsMenu from '../spirits/menu';
import menu from './menu';
import layout from '../layout';

const router = Router();
export default router;

router.get('/:name', async function(req, res, next) {
  const name = req.params.name;
  const spirits = await samsara().spirits();
  const spirit = samsara().spirit(name);
  const state = await spirit.status;
  const settings = await spirit.settings;
  const config = await spirit.containerConfig;
  const isDeploying = await spirit.isDeploying;
  const currentLife = await spirit.currentLife;
  const latestLife = await spirit.latestLife;
  const life = (currentLife || latestLife || {life: '?'}).life;

  res.send(layout(view({
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
      canStart: state == 'stopped' && latestLife && !!(await latestLife.container),
      canRestart: state == 'running'
    }
  }), {
    title: `${name} - Spirit`,
    menus: [rootMenu({selected: 'spirits'}), spiritsMenu({spirits: spirits, newSelected: false, selectedSpiritName: name}), menu({name:name, selected:'status'})]
  }));
});

router.get('/:name/settings', async function(req, res, next) {
  const name = req.params.name
  const spirits = await samsara().spirits();
  const spirit = samsara().spirit(name);
  const settings = await spirit.settings;
  res.render('spirit/settings', {
    title: 'Settings - ' + name + ' - Spirit',
    menus: [rootMenu('spirits'), spiritsMenu(spirits, name), spiritMenu(name, 'settings')],
    content: {
      name: name,
      settings: settings
    }
  });
});

router.get('/:name/configure', async function(req, res, next) {
  const name = req.params.name
  const spirits = await samsara().spirits();
  const spirit = samsara().spirit(name);
  const config = await spirit.containerConfig;
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
});

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
