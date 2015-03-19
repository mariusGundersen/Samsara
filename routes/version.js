var express = require('express');
var router = express.Router();
var spiritContainers = require('../providers/spiritContainers');
var makePageModel = require('../pageModels/version');
var docker = require('../private/docker');
var prettifyLogs = require('../private/prettifyLogs');

router.get('/:name/version/:version', function(req, res, next){
  spiritContainers(req.params.name)
  .then(function(containers){    
    var found = containers.filter(function(c){
      return c.version == req.params.version;
    })[0];
    
    if(!found) throw new Error('404');
    
    var container = docker.getContainer(found.id);
    
    return container.inspect().then(function(config){
    
      return container.logs({stdout:true, stderr:true}).then(prettifyLogs).then(function(logs){
        return makePageModel(req.params.name + ' - ' + req.params.version, {
          name: req.params.name,
          version: req.params.version,
          json: JSON.stringify(config, null, '  '),
          log: logs
        }, req.params.name, req.params.version);
      });
    });
  })
  .then(function(pageModel){
    res.render('spirits/spirit/version/index', pageModel);
  }).catch(function(error){
    res.render('error', {content:{message: error.message, error: error}});
  });
});

module.exports = router;