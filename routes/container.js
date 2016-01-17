const router = require('express-promise-router')();
const co = require('co');
const samsara = require('samsara-lib');
const root = require('../private/menu/root');
const containers = require('../private/menu/containers');

router.get('/', co.wrap(function*(req, res, next) {
  const list = yield samsara().containers();
  return res.render('container/index', {
    title: 'Containers',
    menus: [root('containers'), containers(list)],
    content: {
      containers: list
    }
  });
}));

router.get('/:id', co.wrap(function*(req, res, next) {
  const list = yield samsara().containers();
  const container = samsara().container(req.params.id);
  const config = yield container.inspect();
  const name = config.Name.substr(1);
  const logs = yield container.prettyLogs(true, {stdout:true, stderr:true, tail:50});

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
}));

router.get('/:id/logs/download', co.wrap(function*(req, res, next){
  const container = samsara().container(req.params.id);
  const config = yield container.inspect();

  res.setHeader('Content-disposition', 'attachment;filename='+config.Name.substr(1)+'.log');
  const logs = yield container.prettyLogs(false, {stdout:true, stderr:true});
  logs.pipe(res);
}));

module.exports = router;
