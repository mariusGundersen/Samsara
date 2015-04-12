const router = require('express-promise-router')();
const spiritContainers = require('../providers/spiritContainers');
const makePageModel = require('../pageModels/version');
const docker = require('../private/docker');
const prettifyLogs = require('../private/prettifyLogs');
const co = require('co');

router.get('/:name/version/latest', co.wrap(function*(req, res, next){
  const containers = yield spiritContainers(req.params.name)
  
  if(containers.length == 0) throw new Error('404');
  
  res.redirect(containers[0].version);
}));

router.get('/:name/version/:version', co.wrap(function*(req, res, next){
  const containers = yield spiritContainers(req.params.name);
  const found = containers.filter(function(c){
    return c.version == req.params.version;
  })[0];

  if(!found) throw new Error('404');

  const container = docker.getContainer(found.id);

  const config = yield container.inspect();

  const logs = yield container.logs({stdout:true, stderr:true});
  const prettyLogs = yield prettifyLogs(logs);

  const pageModel = yield makePageModel(req.params.name + ' - ' + req.params.version, {
    name: req.params.name,
    version: req.params.version,
    json: JSON.stringify(config, null, '  '),
    log: prettyLogs,
    stopped: found.state === 'stopped',
    model: {
      name: req.params.name,
      version: req.params.version
    }
  }, req.params.name, req.params.version);
  res.render('spirits/spirit/version/index', pageModel);
}));

module.exports = router;