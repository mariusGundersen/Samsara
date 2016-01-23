import Router from 'express-promise-router';
import co from 'co';
import samsara from 'samsara-lib';
import root from '../private/menu/root';
import containers from '../private/menu/containers';

const router = Router();
export default router;

router.get('/', async function(req, res, next) {
  const list = await samsara().containers();
  return res.render('container/index', {
    title: 'Containers',
    menus: [root('containers'), containers(list)],
    content: {
      containers: list
    }
  });
});

router.get('/:id', async function(req, res, next) {
  const list = await samsara().containers();
  const container = samsara().container(req.params.id);
  const config = await container.inspect();
  const name = config.Name.substr(1);
  const logs = await container.prettyLogs(true, {stdout:true, stderr:true, tail:50});

  return res.render('container/info', {
    title: name + ' - Containers',
    menus: [root('containers'), containers(list, req.params.id)],
    content: {
      info: config,
      name: name,
      json: JSON.stringify(config, null, '  '),
      log: logs,
      controls: {
        id: config.Id,
        name: name,
        image: config.Config.Image,
        running: config.State.Running
      }
    }
  });
});

router.get('/:id/logs/download', async function(req, res, next){
  const container = samsara().container(req.params.id);
  const config = await container.inspect();

  res.setHeader('Content-disposition', 'attachment;filename='+config.Name.substr(1)+'.log');
  const logs = await container.prettyLogs(false, {stdout:true, stderr:true});
  logs.pipe(res);
});
