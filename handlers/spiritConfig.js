var qvc = require('qvc');
var spirit = require('../providers/spirit');
var mutateSpiritConfig = require('../mutators/spiritConfig');

module.exports = [
  qvc.command('setSpiritImage', function(command, done){
    mutateSpiritConfig(command.name, function(config){
      config.image = command.value;
    })
    .then(function(){
      done(null, true);
    }, done);
  }),
  qvc.command('setSpiritDescription', function(command, done){
    mutateSpiritConfig(command.name, function(config){
      config.description = command.value;
    })
    .then(function(){
      done(null, true);
    }, done);
  }),
  qvc.command('setSpiritUrl', function(command, done){
    mutateSpiritConfig(command.name, function(config){
      config.url = command.value;
    })
    .then(function(){
      done(null, true);
    }, done);
  }),
  qvc.command('enableWebhook', function(command, done){
    mutateSpiritConfig(command.name, function(config){
      config.webhook.enable = true;
    })
    .then(function(){
      done(null, true);
    }, done);
  }),
  qvc.command('disableWebhook', function(command, done){
    mutateSpiritConfig(command.name, function(config){
      config.webhook.enable = false;
    })
    .then(function(){
      done(null, true);
    }, done);
  }),
  qvc.command('saveWebhook', function(command, done){
    mutateSpiritConfig(command.name, function(config){
      config.webhook['secret'] = command.secret;
      config.webhook['from-ip'] = command.fromIp;
    })
    .then(function(){
      done(null, true);
    }, done);
  }),
  qvc.command('addEnvVar', function(command, done){
    mutateSpiritConfig(command.name, function(config){
      if(!config.env){
        config.env = {};
      }
      config.env[command.key] = command.value;
    })
    .then(function(){
      done(null, true);
    }, done);
  }, {
    parameters: [
      {
        name: 'key',
        constraints: [
          {
            name: 'NotEmpty',
            attributes: {
              message: 'Please specify a key for the new environment variable'
            }
          }
        ]
      }
    ]
  }),
  qvc.command('setEnvVar', function(command, done){
    mutateSpiritConfig(command.name, function(config){
      if(!config.env){
        config.env = {};
      }
      if(command.key in config.env == false){
        throw new Error(command.key+" is not in the environment variable list");
      }
      config.env[command.key] = command.value;
    })
    .then(function(){
      done(null, true);
    }, done);
  }),
  qvc.command('removeEnvVar', function(command, done){
    mutateSpiritConfig(command.name, function(config){
      if(!config.env){
        config.env = {};
      }
      config.env[command.key] = undefined;
    })
    .then(function(){
      done(null, true);
    }, done);
  }),
];