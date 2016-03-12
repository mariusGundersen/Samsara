import React from 'react';
import Router from 'express-promise-router';
import samsara from 'samsara-lib';

import StatusView from './index';
import ConfigureView from './configure';
import SettingsView from './settings';
import IndexMenu from '../index/menu';
import SpiritsMenu from '../spirits/menu';
import SpiritMenu from './menu';
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

  res.send(layout(`${name} - Spirit`,
    <IndexMenu selected="spirits" />,
    <SpiritsMenu spirits={spirits} newSelected={false} selectedSpiritName={name} />,
    <SpiritMenu name={name} selected="status" />,
    <StatusView
      name={name}
      url={settings.url}
      description={settings.description}
      life={life}
      deploy={{
        name: name,
        image: config.image+':'+config.tag,
        stopBeforeStart: settings.deploymentMethod == 'stop-before-start',
        isDeploying: isDeploying
      }}
      controls={{
        name: name,
        canStop: state === 'running',
        canStart: state == 'stopped' && latestLife && !!(await latestLife.container),
        canRestart: state == 'running'
      }}
    />
  ));
});

router.get('/:name/settings', async function(req, res, next) {
  const name = req.params.name
  const spirits = await samsara().spirits();
  const spirit = samsara().spirit(name);
  const settings = await spirit.settings;
  res.send(layout(`Settings - ${name} - Spirit`,
    <IndexMenu selected="spirits" />,
    <SpiritsMenu spirits={spirits} newSelected={false} selectedSpiritName={name} />,
    <SpiritMenu name={name} selected="settings" />,
    <SettingsView
      name={name}
      mainInfo={settings}
      webhook={settings}
    />
  ));
});

router.get('/:name/configure', async function(req, res, next) {
  const name = req.params.name
  const spirits = await samsara().spirits();
  const spirit = samsara().spirit(name);
  const config = await spirit.containerConfig;
  res.send(layout(`Configure - ${name} - Spirit`,
    <IndexMenu selected="spirits" />,
    <SpiritsMenu spirits={spirits} newSelected={false} selectedSpiritName={name} />,
    <SpiritMenu name={name} selected="configure" />,
    <ConfigureView
      name={name}
      repository={repositoryModel(config, name)}
      environment={environmentModel(config, name)}
      volumes={volumesModel(config, name)}
      ports={portsModel(config, name)}
      links={linksModel(config, name)}
      volumesFrom={volumesFromModel(config, name)}
  />
  ));
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
