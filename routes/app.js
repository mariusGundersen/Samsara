var express = require('express');
var router = express.Router();
var Promise = require('promise');
var app = require('../providers/app');
var appContainers = require('../providers/appContainers');
var makePageModel = require('../private/makeAppPageModel');
var docker = require('../private/docker');
var moment = require('moment');
var prettifyLogs = require('../private/prettifyLogs');

router.get('/', function(req, res, next) {
  app
  .list()
  .then(function(apps){
    return Promise.all(apps.map(function(name){
      return app(name).config();
    }));
  })
  .then(function(result){
    return makePageModel('Apps', {apps:result});
  })
  .then(function(pageModel){
    res.render('app/index', pageModel);
  }).catch(function(error){
    res.render('error', {content: {message: error.message, error: error}});
  });
});


router.get('/new', function(req, res, next) {
  makePageModel('New app', {})
  .then(function(pageModel){
    res.render('app/new', pageModel);
  });
});

router.get('/:name', function(req, res, next) {
  app(req.params.name)
  .config()
  .then(function(config){
    return appContainers(req.params.name)
    .then(function(containers){
      return makePageModel(req.params.name, {
        config: config,
        containers: containers
      }, req.params.name);
    });
  })
  .then(function(pageModel){
    res.render('app/info', pageModel);
  }).catch(function(error){
    res.render('error', {content:{message: error.message, error: error}});
  });
});

router.get('/:name/edit', function(req, res, next) {
  makePageModel('Edit '+req.params.name)
  .then(function(pageModel){
    res.render('app/edit', pageModel);
  });
});

router.get('/:name/version/:version', function(req, res, next){
  appContainers(req.params.name)
  .then(function(containers){
    
    containers.forEach(function(c){
      c.name = req.params.name;
      c.description = moment(c.state == 'running' ? c.info.State.StartedAt : c.info.State.FinishedAt).fromNow(c.state == 'running');
    });
    
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
    res.render('app/version/index', pageModel);
  }).catch(function(error){
    res.render('error', {content:{message: error.message, error: error}});
  });
});

module.exports = router;
