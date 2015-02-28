var express = require('express');
var router = express.Router();
var Promise = require('promise');
var docker = require('../private/docker');
var makePageModel = require('../private/makePageModel');

router.get('/', function(req, res, next) {
  
  docker.listContainers({all: true})
  .then(function(containers){
    return containers.map(function(container){
      return {
        Id: container.Id,
        Name: container.Names[0].substr(1),
        Status: container.Status,
        Image: container.Image
      }
    });
  })
  .then(function(list){
    return makePageModel('Containers', {containers: list}, null);
  })
  .then(function (pageModel) {
    res.render('container/index', pageModel);
  }).catch(function(err){
    res.render('error', {content:{message: error.message, error: error}});
  });
});

router.get('/:id', function(req, res, next) {
  
  docker.getContainer(req.params.id).inspect()
  .then(function(result){
    return makePageModel(result.Name.substr(1) + ' - Container', {info: result, name:result.Name.substr(1), json: JSON.stringify(result, null, '  ')}, req.params.id)
  })
  .then(function(pageModel){
    res.render('container/info', pageModel);
  }).catch(function(err){
    res.render('error', {content:{message: error.message, error: error}});
  });
});

module.exports = router;
