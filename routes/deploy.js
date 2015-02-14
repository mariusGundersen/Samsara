var express = require('express');
var router = express.Router();
var Promise = require('promise');
var deploy = require('../private/deploy');
var validateDeploy = require('../private/validateDeploy');
var request = require('request');

router.post('/:name/:secret', function(req, res, next){
  
  console.log('deploying', req.params.name, req.body);
  
  validateDeploy(
    req.params.name, 
    req.params.secret, 
    req.body.repository && req.body.repository.repo_name, 
    req.headers['x-real-ip'] || req.connection.remoteAddress, 
    req.body.callback_url
  ).then(function(config){
    
    console.log('validated', config);
    
    deploy(config)
    .then(function(state){
      request.post({
        url: req.body.callback_url,
        body: JSON.stringify({
          state: 'success',
          context: config.description,
          descrption: 'deployed',
          target_url: config.url
        })
      }, function(err, resp, body){
        console.log('response', body);
      });
    }).catch(function(error){
      console.error(error);
      request.post({
        url: req.body.callback_url,
        body: JSON.stringify({
          state: 'error',
          context: config.description,
          descrption: error,
          target_url: config.url
        })
      }, function(err, resp, body){
        console.log('response', body);
      });
    });

    res.write('success');
    res.end();
  }).catch(function(error){
    console.log('validation failed for', req.params.name, error);
    res.status('403');
    res.write(JSON.stringify(error, null, ' '));
    res.end();
  });
});

module.exports = router;