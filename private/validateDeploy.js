var Promise = require('promise');
var fs = require('fs');
var Netmask = require('netmask').Netmask;

function validateDeploy(name, secret, image, ip, callback_url){
  return new Promise(function(resolve, reject){
    console.log('reading file', name);
    fs.readFile(__dirname+'/../config/apps/'+name+'/config.json', 'utf8', function(err, content){
      if(err){
        console.log('could not read file', err);
        return reject(err);
      }
      
      var config = JSON.parse(content);
      console.log('config', config);
      if(config.name !== name){
        return reject('config folder name does not match config.json name');
      }
      
      console.log('secret', config.webhook.secret, secret);
      if(config.webhook.secret !== secret){
        return reject('wrong secret');
      }
      
      console.log('image', config.image, image);
      if(config.image !== image){
        return reject('wrong image');
      }
      
      console.log('ip', config.webhook['from-ip'], ip);
      if(ip !== '127.0.0.1' && new Netmask(config.webhook['from-ip']).contains(ip) == false){
        return reject('wrong ip');
      }
      
      console.log('callback_url', callback_url);
      if(callback_url == null){
        return reject('missing callback_url');
      }
      
      resolve(config);
    });
  });
}

module.exports = validateDeploy;