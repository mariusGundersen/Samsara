var qvc = require('qvc');
var app = require('../providers/app');
var mutateAppConfig = require('../mutators/appConfig');

module.exports = [
  qvc.command('setAppImage', function(command, done){
    mutateAppConfig(command.name, function(config){
      config.image = command.value;
    })
    .then(function(){
      done(null, true);
    }, done);
  }),
  qvc.command('setAppDescription', function(command, done){
    mutateAppConfig(command.name, function(config){
      config.description = command.value;
    })
    .then(function(){
      done(null, true);
    }, done);
  }),
  qvc.command('setAppUrl', function(command, done){
    mutateAppConfig(command.name, function(config){
      config.url = command.value;
    })
    .then(function(){
      done(null, true);
    }, done);
  }),
  qvc.command('enableWebhook', function(command, done){
    mutateAppConfig(command.name, function(config){
      config.webhook.enable = true;
    })
    .then(function(){
      done(null, true);
    }, done);
  }),
  qvc.command('disableWebhook', function(command, done){
    mutateAppConfig(command.name, function(config){
      config.webhook.enable = false;
    })
    .then(function(){
      done(null, true);
    }, done);
  }),
  qvc.command('saveWebhook', function(command, done){
    mutateAppConfig(command.name, function(config){
      config.webhook['secret'] = command.secret;
      config.webhook['from-ip'] = command.fromIp;
    })
    .then(function(){
      done(null, true);
    }, done);
  }),
  qvc.command('addEnvVar', function(command, done){
    mutateAppConfig(command.name, function(config){
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
    mutateAppConfig(command.name, function(config){
      if(!config.env){
        config.env = {};
      }
      if(command.key != config.env){
        throw new Error(command.key+" is not in the environment variable list");
      }
      config.env[command.key] = command.value;
    })
    .then(function(){
      done(null, true);
    }, done);
  }),
  qvc.command('removeEnvVar', function(command, done){
    mutateAppConfig(command.name, function(config){
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