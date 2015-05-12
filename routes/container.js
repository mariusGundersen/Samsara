const router = require('express-promise-router')();
const co = require('co');
const docker = require('../private/docker');
const container = require('../providers/container');
const makePageModel = require('../pageModels/containers');
const prettifyLogs = require('../private/prettifyLogs');

router.get('/', co.wrap(function*(req, res, next) {
  const list = yield container.list();
  const pageModel = yield makePageModel('Containers', {containers: list}, null);
  return res.render('container/index', pageModel);
}));

router.get('/:id', co.wrap(function*(req, res, next) {
  const container = docker.getContainer(req.params.id);
  const config = yield container.inspect();
  const logs = yield prettifyLogs(yield container.logs({stdout:true, stderr:true, tail:50}));

  const pageModel = yield makePageModel(config.Name.substr(1) + ' - Container', {
    info: config, 
    name: config.Name.substr(1), 
    json: JSON.stringify(config, null, '  '),
    log: logs,
    controls: {
      id: config.Id,
      name: config.Name.substr(1),
      image: config.Config.Image,
      running: config.State.Running
    }
  }, req.params.id);
  return res.render('container/info', pageModel);
}));

router.get('/:id/logs/download', co.wrap(function*(req, res, next){
  const container = docker.getContainer(req.params.id);
  const config = yield container.inspect();
  
  res.setHeader('Content-disposition', 'attachment;filename='+config.Name.substr(1)+'.log');
  const logs = yield container.logs({stdout:true, stderr:true});
  logs.pipe(res);
}));

module.exports = router;
