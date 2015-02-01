var express = require('express');
var router = express.Router();
var Promise = require('promise');
var docker = require('../private/docker');
var orchestra = require('../private/orchestra');


router.get('/new', function(req, res, next) {    
  res.render('newApp', {
    title: 'newApp'
  });
});

router.get('/:name', function(req, res, next) {    
  res.render('appInfo', {
    title: req.params.name + ' appInfo'
  });
});

module.exports = router;
