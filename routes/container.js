var express = require('express');
var router = express.Router();
var docker = require('../private/docker');

router.get('/:id', function(req, res, next) {
  docker.getContainer(req.params.id)
  .inspect()
  .then(function(info){
    res.render('info', {info: JSON.stringify(info, null, 2)});
  }).catch(function(err){
    console.log(err);
    res.render('error', {message: err.message, error: err});
  });
});

module.exports = router;
