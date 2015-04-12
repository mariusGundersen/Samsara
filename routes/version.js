const express = require('express');
const router = express.Router();
const spiritContainers = require('../providers/spiritContainers');
const makePageModel = require('../pageModels/version');
const docker = require('../private/docker');
const prettifyLogs = require('../private/prettifyLogs');
const co = require('co');

router.get('/:name/version/latest', function(req, res, next){
  spiritContainers(req.params.name)
  .then(function(containers){
    res.redirect(containers[0].version);
  });
});

router.get('/:name/version/:version', function(req, res, next){
  co(function*(){
    const containers = yield spiritContainers(req.params.name);
    const found = containers.filter(function(c){
      return c.version == req.params.version;
    })[0];
    
    if(!found) throw new Error('404');
    
    const container = docker.getContainer(found.id);
    
    const config = yield container.inspect();
    
    const logs = yield container.logs({stdout:true, stderr:true});
    const prettyLogs = yield prettifyLogs(logs);

    return makePageModel(req.params.name + ' - ' + req.params.version, {
      name: req.params.name,
      version: req.params.version,
      json: JSON.stringify(config, null, '  '),
      log: prettyLogs
    }, req.params.name, req.params.version);
  })
  .then(function(pageModel){
    res.render('spirits/spirit/version/index', pageModel);
  }).catch(function(error){
    res.render('error', {content:{message: error.message, error: error}});
  });
});

module.exports = router;