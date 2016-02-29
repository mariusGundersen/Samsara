import Router from 'express-promise-router';
import co from 'co';
import samsara from 'samsara-lib';
import root from '../../private/menu/root';
import containers from '../../private/menu/containers';

import view from './index';
import detailView from './details';
import rootMenu from '../index/indexMenu';
import menu from './menu';
import layout from '../layout';

const router = Router();
export default router;

router.get('/', async function(req, res, next) {
  const list = await samsara().containers();
  res.send(layout(view({
    containers: list
  }), {
    title: 'Containers',
    menus: [rootMenu({selected: 'containers'}), menu({containers: list})]
  }));
});

router.get('/:id', async function(req, res, next) {
  const selectedId = req.params.id;
  const list = await samsara().containers();
  const container = samsara().container(selectedId);
  list.filter(x => x.id == selectedId)[0].selected = true;
  const config = await container.inspect();
  const name = config.Name.substr(1);
  const logs = await container.prettyLogs(true, {stdout:true, stderr:true, tail:50});

  res.send(layout(detailView({
    info: config,
    name: name,
    json: JSON.stringify(config, null, '  '),
    log: await streamToString(logs),
    controls: {
      id: config.Id,
      name: name,
      image: config.Config.Image,
      running: config.State.Running
    }
  }), {
    title: name + ' - Containers',
    menus: [rootMenu({selected: 'containers'}), menu({containers: list})]
  }));
});

router.get('/:id/logs/download', async function(req, res, next){
  const container = samsara().container(req.params.id);
  const config = await container.inspect();

  res.setHeader('Content-disposition', 'attachment;filename='+config.Name.substr(1)+'.log');
  const logs = await container.prettyLogs(false, {stdout:true, stderr:true});
  logs.pipe(res);
});

function streamToString(stream){
  return new Promise(function(resolve, reject){
    var result = ''
    stream.on('data', function(chunk){
      result += chunk.toString('utf8');
    });

    stream.on('end', function(){
      resolve({__html: result, toString: () => result, valueOf: () => result});
    });

    stream.on('error', reject);
  });
}
