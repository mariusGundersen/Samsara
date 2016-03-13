import React from 'react';
import Router from 'express-promise-router';
import samsara from 'samsara-lib';
import streamToString from '../../private/streamToString';

import ErrorView from '../errorView';
import IndexView from './index';
import DetailsView from './details';
import IndexMenu from '../index/menu';
import ContainersMenu from './menu';
import layout from '../layout';

const router = Router();
export default router;

router.get('/', async function(req, res, next) {
  const list = await samsara().containers();
  res.send(layout('Containers',
    <IndexMenu selected="containers" />,
    <ContainersMenu containers={list} />,
    <IndexView containers={list} />
  ));
});

router.get('/:id', async function(req, res, next) {
  const selectedId = req.params.id;
  const list = await samsara().containers();
  const container = samsara().container(selectedId);
  const found = list.filter(x => x.id == selectedId)[0];
  if(found == undefined){
    return res.send(layout('Not Found - Containers',
      <IndexMenu selected="containers" />,
      <ContainersMenu containers={list} />,
      <ErrorView message={`404 Not Found`} />
    ));
  }
  found.selected = true;
  const config = await container.inspect();
  const name = config.Name.substr(1);
  const json = JSON.stringify(config, null, '  ');
  const logs = await streamToString(container.prettyLogs(true, {stdout:true, stderr:true, tail:50}));

  return res.send(layout(name + ' - Containers',
    <IndexMenu selected="containers" />,
    <ContainersMenu containers={list} />,
    <DetailsView
      info={config}
      name={name}
      json={json}
      log={logs}
      controls={{
        id: config.Id,
        name: name,
        image: config.Config.Image,
        running: config.State.Running
      }}
    />
  ));
});

router.get('/:id/logs/download', async function(req, res, next){
  const container = samsara().container(req.params.id);
  const config = await container.inspect();

  res.setHeader('Content-disposition', 'attachment;filename='+config.Name.substr(1)+'.log');
  const logs = await container.prettyLogs(false, {stdout:true, stderr:true});
  logs.pipe(res);
});
