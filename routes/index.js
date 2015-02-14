var express = require('express');
var router = express.Router();
var orchestra = require('../private/orchestra');
var docker = require('../private/docker');
var Promise = require('promise');

router.get('/', function(req, res, next) {
  Promise.all([
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
    }),
    orchestra.containers()
  ])
  .then(function (content) {
    res.render('index', { title: 'Containers', containers: content[0], menu: content[1] });
  }).catch(function(err){
    console.log(err);
    res.render('error', {message: err.message, error: err});
  });
});

module.exports = router;
