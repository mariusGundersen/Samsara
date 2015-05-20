const router = require('express-promise-router')();
const spiritContainers = require('../providers/spiritContainers');
const makePageModel = require('../pageModels/version');
const docker = require('../private/docker');
const prettifyLogs = require('../private/prettifyLogs');
const co = require('co');
const fs = require('fs-promise');

router.get('/:name/version/latest', co.wrap(function*(req, res, next){
  const containers = yield spiritContainers(req.params.name)
  
  if(containers.length == 0) throw new Error('404');
  
  res.redirect(containers[0].version);
}));

router.get('/:name/version/:version', co.wrap(function*(req, res, next){
  const container = yield getContainer(req.params.name, req.params.version);

  const inspect = yield container.inspect();
  const config = yield readFile(req.params.name, req.params.version, 'config.json');
  
  const logs = yield container.logs({stdout:true, stderr:true, tail: 50});
  const prettyLogs = yield prettifyLogs(logs);
  
  const deployLogs = yield readFile(req.params.name, req.params.version, 'deploy.log');

  const pageModel = yield makePageModel(req.params.name + ' - ' + req.params.version, {
    name: req.params.name,
    version: req.params.version,
    json: JSON.stringify(inspect, null, '  '),
    config: config,
    log: prettyLogs,
    deploy: deployLogs,
    stopped: !inspect.State.Running,
    model: {
      name: req.params.name,
      version: req.params.version
    }
  }, req.params.name, req.params.version);
  res.render('spirits/spirit/version/index', pageModel);
}));

router.get('/:name/version/:version/logs/download', co.wrap(function*(req, res, next){
  const container = yield getContainer(req.params.name, req.params.version);
  const config = yield container.inspect();
  
  res.setHeader('Content-disposition', 'attachment;filename='+config.Name.substr(1)+'.log');
  const logs = yield container.logs({stdout:true, stderr:true});
  logs.pipe(res);
}));

function* getContainer(name, version){
  const containers = yield spiritContainers(name);
  const found = containers.filter(function(c){
    return c.version == version;
  })[0];

  if(!found) throw new Error('404');

  return docker.getContainer(found.id);
}

function *readFile(name, life, file){
  try{
    return yield fs.readFile('config/spirits/'+name+'/lives/'+life+'/'+file, 'utf8');
  }catch(e){
    return '';
  }
}

module.exports = router;