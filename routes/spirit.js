var express = require('express');
var router = express.Router();
var Promise = require('promise');
var spirit = require('../providers/spirit');
var spiritContainers = require('../providers/spiritContainers');
var makePageModel = require('../private/makeSpiritPageModel');
var docker = require('../private/docker');
var moment = require('moment');
var prettifyLogs = require('../private/prettifyLogs');

router.get('/', function(req, res, next) {
  spirit
  .list()
  .then(function(spirits){
    return Promise.all(spirits.map(function(name){
      return spirit(name).config();
    }));
  })
  .then(function(result){
    return makePageModel('Spirits', {spirits:result});
  })
  .then(function(pageModel){
    res.render('spirit/index', pageModel);
  }).catch(function(error){
    res.render('error', {content: {message: error.message, error: error}});
  });
});


router.get('/new', function(req, res, next) {
  makePageModel('New spirit', {}, 'new')
  .then(function(pageModel){
    res.render('spirit/new', pageModel);
  });
});

router.get('/:name', function(req, res, next) {
  spirit(req.params.name)
  .config()
  .then(function(config){
    return spiritContainers(req.params.name)
    .then(function(containers){
      return makePageModel(req.params.name, {
        config: config,
        containers: containers,
        controls: {
          name: req.params.name,
          state: containers.some(function(c){ return c.state == 'running'}) ? 'running' : 'stopped',
          running: containers.some(function(c){ return c.state == 'running'})
        }
      }, req.params.name);
    });
  })
  .then(function(pageModel){
    res.render('spirit/info', pageModel);
  }).catch(function(error){
    res.render('error', {content:{message: error.message, error: error}});
  });
});

router.get('/:name/edit', function(req, res, next) {
  makePageModel('Edit '+req.params.name)
  .then(function(pageModel){
    res.render('spirit/edit', pageModel);
  });
});

router.get('/:name/version/:version', function(req, res, next){
  spiritContainers(req.params.name)
  .then(function(containers){    
    var found = containers.filter(function(c){
      return c.version == req.params.version;
    })[0];
    
    if(!found) throw new Error('404');
    
    found.selected = true;
        
    var container = docker.getContainer(found.id);
    
    return container.inspect().then(function(config){
    
      return container.logs({stdout:true, stderr:true}).then(prettifyLogs).then(function(logs){
        return makePageModel(req.params.name + ' - ' + req.params.version, {
          menu: containers,
          name: req.params.name,
          content:{
            name: req.params.name,
            version: req.params.version,
            json: JSON.stringify(config, null, '  '),
            log: logs
          }
        }, req.params.name);
      });
    });
  })
  .then(function(pageModel){
    res.render('spirit/version/index', pageModel);
  }).catch(function(error){
    res.render('error', {content:{message: error.message, error: error}});
  });
});

module.exports = router;
