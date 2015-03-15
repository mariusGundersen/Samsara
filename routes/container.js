var express = require('express');
var router = express.Router();
var Promise = require('promise');
var docker = require('../private/docker');
var container = require('../providers/container');
var makePageModel = require('../private/makeContainerPageModel');
var prettifyLogs = require('../private/prettifyLogs');

router.get('/', function(req, res, next) {
  
  container.list()
  .then(function(list){
    return makePageModel('Containers', {containers: list}, null);
  })
  .then(function (pageModel) {
    res.render('container/index', pageModel);
  }).catch(function(error){
    res.render('error', {content:{message: error.message, error: error}});
  });
});

router.get('/:id', function(req, res, next) {
  
  var container = docker.getContainer(req.params.id);
  container.inspect()
  .then(function(config){
    return container.logs({stdout:true, stderr:true})
    .then(prettifyLogs)
    .then(function(logs){
      return makePageModel(config.Name.substr(1) + ' - Container', {
        info: config, 
        name: config.Name.substr(1), 
        json: JSON.stringify(config, null, '  '),
        log: logs
      }, req.params.id);
    });
  })
  .then(function(pageModel){
    res.render('container/info', pageModel);
  }).catch(function(error){
    res.render('error', {content:{message: error.message, error: error}});
  });
});

module.exports = router;
