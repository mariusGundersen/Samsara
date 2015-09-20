const router = require('express-promise-router')();
const samsara = require('samsara-lib');
const makePageModel = require('../pageModels/version');
const prettifyLogs = require('../private/prettifyLogs');
const co = require('co');
const fs = require('fs-promise');

router.get('/:name/version/latest', co.wrap(function*(req, res, next){
  const latestLife = yield samsara().spirit(req.params.name).latestLife;
  
  if(!latestLife) throw new Error('404');
  
  res.redirect(latestLife.life);
}));

router.get('/:name/version/:version', co.wrap(function*(req, res, next){
  const life = samsara().spirit(req.params.name).life(req.params.version);
  
  const status = yield life.status;
  const config = yield life.config;
  const container = yield tryGetContainer(life);
  
  const deployLogs = yield readFile(req.params.name, req.params.version, 'deploy.log');

  const pageModel = yield makePageModel(req.params.name + ' - ' + req.params.version, {
    name: req.params.name,
    version: req.params.version,
    json: container.inspect,
    config: JSON.stringify(config, null, '  '),
    log: container.logs,
    deploy: deployLogs,
    canReincarnate: status == 'stopped' && container.exists,
    model: {
      name: req.params.name,
      version: req.params.version
    }
  }, req.params.name, req.params.version);
  res.render('spirits/spirit/version/index', pageModel);
}));

router.get('/:name/version/:version/logs/download', co.wrap(function*(req, res, next){
  const container = yield samsara().spirit(req.params.name).life(req.params.version).container;
  const config = yield container.inspect();
  
  res.setHeader('Content-disposition', 'attachment;filename='+config.Name.substr(1)+'.log');
  const logs = yield container.logs({stdout:true, stderr:true});
  logs.pipe(res);
}));

function *tryGetContainer(life){
  try{
    const container = yield life.container;
    
    const inspect = yield container.inspect();
    const logs = yield container.logs({stdout:true, stderr:true, tail: 50});
    const prettyLogs = yield prettifyLogs(logs);
    
    return {
      inspect: JSON.stringify(inspect, null, '  '),
      logs: prettyLogs,
      exists: true
    };
  }catch(e){
    return {
      inspect: '',
      logs: '',
      exists: false
    };
  }
}

function *readFile(name, life, file){
  try{
    return yield fs.readFile('config/spirits/'+name+'/lives/'+life+'/'+file, 'utf8');
  }catch(e){
    return '';
  }
}

module.exports = router;