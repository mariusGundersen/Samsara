const express = require('express');
const router = express.Router();
const co = require('co');
const docker = require('../private/docker');
const container = require('../providers/container');
const makePageModel = require('../pageModels/containers');
const prettifyLogs = require('../private/prettifyLogs');

router.get('/', function(req, res, next) {
  co(function*(){
    const list = yield container.list();
    return makePageModel('Containers', {containers: list}, null);
  })
  .then(function (pageModel) {
    res.render('container/index', pageModel);
  }).catch(function(error){
    res.render('error', {content:{message: error.message, error: error}});
  });
});

router.get('/:id', function(req, res, next) {
  co(function*(){
    const container = docker.getContainer(req.params.id);
    const config = yield container.inspect();
    const logs = yield prettifyLogs(yield container.logs({stdout:true, stderr:true}));

    return makePageModel(config.Name.substr(1) + ' - Container', {
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
  }).then(function(pageModel){
    res.render('container/info', pageModel);
  }).catch(function(error){
    res.render('error', {content:{message: error.message, error: error}});
  });
});

module.exports = router;
