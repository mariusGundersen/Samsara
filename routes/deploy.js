var express = require('express');
var router = express.Router();
var Promise = require('promise');
var deploy = require('../private/deploy');
var fs = require('fs');
var Netmask = require('netmask').Netmask;

router.post('/:name/:secret', function(req, res, next){
  
  validateDeploy(
    req.params.name, 
    req.params.secret, 
    req.body.repository.repo_name, 
    req.headers['x-real-ip'], 
    req.body.callback_url
  ).then(function(params){

    deploy(params.image, params.name, params.callbackUrl);

    res.write('success');
    res.end();
  }).catch(function(error){
    res.status('403');
    res.write(error);
    res.end();
  });
});

function validateDeploy(name, secret, image, ip, callback_url){
  return new Promise(function(resolve, reject){
    fs.readFile(__dirname+'../config/apps/'+name, 'utf8', function(err, content){
      if(err){
        return reject(err);
      }
      
      var config = JSON.parse(content);
      
      if(config.deploy.secret !== secret){
        return reject('wrong secret');
      }
      
      if(config.image !== image){
        return reject('wrong image');
      }
      
      if(new Netmask(config['from-ip']).contains(ip) == false){
        return reject('wrong ip');
      }
      
      if(callback_url == null){
        return reject('missing callback_url');
      }
      
      resolve({
        image: config.image,
        name: name,
        callbackUrl: callback_url
      });
    });
  });
}

module.exports = router;