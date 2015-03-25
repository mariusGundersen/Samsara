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
  qvc.command('addVolume', function(command, done){
    mutateSpiritConfig(command.name, function(config){
      if(!config.volumes){
        config.volumes = {};
      }
      config.volumes[command.containerPath] = {
        hostPath: command.hostPath,
        readOnly: command.readOnly
      };
    })
    .then(function(){
      done(null, true);
    }, done);
  }, {
    parameters: [
      {
        name: 'containerPath',
        constraints: [
          {
            name: 'NotEmpty',
            attributes: {
              message: 'Please specify a containerPath for the new volume'
            }
          }
        ]
      }
    ]
  }),
  qvc.command('setVolume', function(command, done){
    mutateSpiritConfig(command.name, function(config){
      if(!config.volumes){
        config.volumes = {};
      }
      if(command.containerPath in config.volumes == false){
        throw new Error(command.containerPath+" is not in the volumesironment variable list");
      }
      config.volumes[command.containerPath] = {
        hostPath: command.hostPath,
        readOnly: command.readOnly
      };
    })
    .then(function(){
      done(null, true);
    }, done);
  }),
  qvc.command('removeVolume', function(command, done){
    mutateSpiritConfig(command.name, function(config){
      if(!config.volumes){
        config.volumes = {};
      }
      config.volumes[command.containerPath] = undefined;
    })
    .then(function(){
      done(null, true);
    }, done);
  }),
  qvc.command('addPort', function(command, done){
    mutateSpiritConfig(command.name, function(config){
      if(!config.ports){
        config.ports = {};
      }
      config.ports[command.hostPort] = {
        containerPort: command.containerPort,
        hostIp: command.hostIp
      };
    })
    .then(function(){
      done(null, true);
    }, done);
  }, {
    parameters: [
      {
        name: 'hostPort',
        constraints: [
          {
            name: 'NotEmpty',
            attributes: {
              message: 'Please specify a host port for the new port'
            }
          },
          {
            name: 'Pattern',
            attributes: {
              regexp: '^\\d+$',
              message: 'The host port must be a number'
            }
          }
        ]
      },
      {
        name: 'containerPort',
        constraints: [
          {
            name: 'NotEmpty',
            attributes: {
              message: 'Please specify a container port for the new port'
            }
          },
          {
            name: 'Pattern',
            attributes: {
              regexp: '^\\d+$',
              message: 'The container port must be a number'
            }
          }
        ]
      },
      {
        name: 'hostIp',
        constraints: [
          {
            name: 'Pattern',
            attributes: {
              regexp: '^(\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3})?$',
              message: 'The host ip must follow the pattern #.#.#.#'
            }
          }
        ]
      }
    ]
  }),
  qvc.command('setPort', function(command, done){
    mutateSpiritConfig(command.name, function(config){
      if(!config.ports){
        config.ports = {};
      }
      if(command.hostPort in config.ports == false){
        throw new Error(command.hostPort+" is not in the ports list");
      }
      config.ports[command.hostPort] = {
        containerPort: command.containerPort,
        hostIp: command.hostIp
      };
    })
    .then(function(){
      done(null, true);
    }, done);
  }, {
    parameters: [
      {
        name: 'hostPort',
        constraints: [
          {
            name: 'NotEmpty',
            attributes: {
              message: 'Please specify a host port for the new port'
            }
          },
          {
            name: 'Pattern',
            attributes: {
              regexp: '^\\d+$',
              message: 'The host port must be a number'
            }
          }
        ]
      },
      {
        name: 'containerPort',
        constraints: [
          {
            name: 'NotEmpty',
            attributes: {
              message: 'Please specify a container port for the new port'
            }
          },
          {
            name: 'Pattern',
            attributes: {
              regexp: '^\\d+$',
              message: 'The container port must be a number'
            }
          }
        ]
      },
      {
        name: 'hostIp',
        constraints: [
          {
            name: 'Pattern',
            attributes: {
              regexp: '^(\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3})?$',
              message: 'The host ip must follow the pattern #.#.#.#'
            }
          }
        ]
      }
    ]
  }),
  qvc.command('removePort', function(command, done){
    mutateSpiritConfig(command.name, function(config){
      if(!config.ports){
        config.ports = {};
      }
      config.ports[command.hostPort] = undefined;
    })
    .then(function(){
      done(null, true);
    }, done);
  }),
];