var express = require('express');
var router = express.Router();
var Promise = require('promise');
var docker = require('../private/docker');
var orchestra = require('../private/orchestra');

router.get('/:id', function(req, res, next) {
  Promise.all([
    docker.getContainer(req.params.id).inspect(),
    orchestra.containers()
  ])
  .then(function(result){
    
    result[1].filter(function(container){
      return container.id == req.params.id;
    }).forEach(function(container){
      container.selected = true;
    });
    
    res.render('info', {
      info: result[0], 
      title: result[0].Name.substr(1) + ' - Container',
      menu: result[1]
    });
  }).catch(function(err){
    console.log(err);
    res.render('error', {message: err.message, error: err});
  });
});

module.exports = router;
