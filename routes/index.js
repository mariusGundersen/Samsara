var express = require('express');
var router = express.Router();
var makePageModel = require('../private/makePageModel');
var docker = require('../private/docker');
var Promise = require('promise');

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
    res.render('index', pageModel);
  }).catch(function(err){
    res.render('error', {content:{message: error.message, error: error}});
  });
});

module.exports = router;
