var express = require('express');
var router = express.Router();
var Promise = require('promise');
var deploy = require('../private/deploy');
var fs = require('fs');
var Netmask = require('netmask').Netmask;

router.post('/:name/:secret', function(req, res, next){
  console.log('deploying', req.params.name);
  validateDeploy(
    req.params.name, 
    req.params.secret, 
    req.body.repository.repo_name, 
    req.headers['x-real-ip'], 
    req.body.callback_url
  ).then(function(params){
    console.log('validated', params);
    deploy(params.image, params.name, params.callbackUrl);

    res.write('success');
    res.end();
  }).catch(function(error){
    console.log('validation failed for', req.params.name, error);
    res.status('403');
    res.write(JSON.stringify(error, null, ' '));
    res.end();
  });
});

function validateDeploy(name, secret, image, ip, callback_url){
  return new Promise(function(resolve, reject){
    console.log('reading file', name);
    fs.readFile(__dirname+'/../config/apps/'+name, 'utf8', function(err, content){
      if(err){
        console.log('could not read file', err);
        return reject(err);
      }
      
      var config = JSON.parse(content);
      console.log('config', config);
      
      console.log('secret', config.deploy.secret, secret);
      if(config.deploy.secret !== secret){
        return reject('wrong secret');
      }
      
      console.log('image', config.image, image);
      if(config.image !== image){
        return reject('wrong image');
      }
      
      console.log('ip', config['from-ip'], ip);
      if(new Netmask(config['from-ip']).contains(ip) == false){
        return reject('wrong ip');
      }
      
      console.log('callback_url', callback_url);
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