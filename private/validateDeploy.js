var Promise = require('promise');
var app = require('../providers/app');
var Netmask = require('netmask').Netmask;

function validateDeploy(name, secret, image, ip, callback_url){
  console.log('reading file', name);
  return app(name).config().then(function(config){
    
    console.log('config', config);
    if(config.name !== name){
      throw 'config folder name does not match config.json name';
    }

    console.log('secret', config.webhook.secret, secret);
    if(config.webhook.secret !== secret){
      throw 'wrong secret';
    }

    console.log('image', config.image, image);
    if(config.image !== image){
      throw 'wrong image';
    }

    console.log('ip', config.webhook['from-ip'], ip);
    if(ip !== '127.0.0.1' && new Netmask(config.webhook['from-ip']).contains(ip) == false){
      throw 'wrong ip';
    }

    console.log('callback_url', callback_url);
    if(callback_url == null){
      throw 'missing callback_url';
    }

    return config;
  });
}

module.exports = validateDeploy;