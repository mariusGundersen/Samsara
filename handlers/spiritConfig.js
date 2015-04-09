var qvc = require('qvc');
var spirit = require('../providers/spirit');
var mutateSpiritConfig = require('../mutators/spiritConfig');
var NotEmpty = require('qvc/constraints/NotEmpty');
var Pattern = require('qvc/constraints/Pattern');

module.exports = [
  qvc.command('setSpiritImage', function(command){
    return mutateSpiritConfig(command.name, function(config){
      config.image = command.value;
    });
  }),
  qvc.command('setSpiritTag', function(command){
    return mutateSpiritConfig(command.name, function(config){
      config.tag = command.value;
    });
  }),
  qvc.command('setSpiritDescription', function(command){
    return mutateSpiritConfig(command.name, function(config){
      config.description = command.value;
    });
  }),
  qvc.command('setSpiritUrl', function(command){
    return mutateSpiritConfig(command.name, function(config){
      config.url = command.value;
    });
  }),
  qvc.command('enableWebhook', function(command){
    return mutateSpiritConfig(command.name, function(config){
      config.webhook.enable = true;
    });
  }),
  qvc.command('disableWebhook', function(command){
    return mutateSpiritConfig(command.name, function(config){
      config.webhook.enable = false;
    });
  }),
  qvc.command('saveWebhook', function(command){
    return mutateSpiritConfig(command.name, function(config){
      config.webhook['secret'] = command.secret;
      config.webhook['from-ip'] = command.fromIp;
    });
  }),
  qvc.command('addEnvVar', function(command){
    return mutateSpiritConfig(command.name, function(config){
      if(!config.env){
        config.env = {};
      }
      config.env[command.key] = command.value;
    });
  }, {
    'key': new NotEmpty('Please specify a key for the new environment variable')
  }),
  qvc.command('setEnvVar', function(command){
    return mutateSpiritConfig(command.name, function(config){
      if(!config.env){
        config.env = {};
      }
      if(command.key in config.env == false){
        throw new Error(command.key+" is not in the environment variable list");
      }
      config.env[command.key] = command.value;
    });
  }),
  qvc.command('removeEnvVar', function(command){
    return mutateSpiritConfig(command.name, function(config){
      if(!config.env){
        config.env = {};
      }
      config.env[command.key] = undefined;
    });
  }),
  qvc.command('addVolume', function(command){
    return mutateSpiritConfig(command.name, function(config){
      if(!config.volumes){
        config.volumes = {};
      }
      config.volumes[command.containerPath] = {
        hostPath: command.hostPath,
        readOnly: command.readOnly
      };
    });
  }, {
    'containerPath': new NotEmpty('Please specify a containerPath for the new volume')
  }),
  qvc.command('setVolume', function(command){
    return mutateSpiritConfig(command.name, function(config){
      if(!config.volumes){
        config.volumes = {};
      }
      if(command.containerPath in config.volumes == false){
        throw new Error(command.containerPath+" is not in the volume list");
      }
      config.volumes[command.containerPath] = {
        hostPath: command.hostPath,
        readOnly: command.readOnly
      };
    });
  }),
  qvc.command('removeVolume', function(command){
    return mutateSpiritConfig(command.name, function(config){
      if(!config.volumes){
        config.volumes = {};
      }
      config.volumes[command.containerPath] = undefined;
    });
  }),
  qvc.command('addPort', function(command){
    return mutateSpiritConfig(command.name, function(config){
      if(!config.ports){
        config.ports = {};
      }
      config.ports[command.hostPort] = {
        containerPort: command.containerPort,
        hostIp: command.hostIp
      };
    });
  }, {
    'hostPort': [
      new NotEmpty('Please specify a host port for the new port'),
      new Pattern(/^\d+$/, 'The host port must be a number')
    ],
    'containerPort': [
      new NotEmpty('Please specify a container port for the new port'),
      new Pattern(/^\d+$/, 'The container port must be a number')
    ],
    'hostIp': new Pattern(/^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})?$/, 'The host ip must follow the pattern #.#.#.#')
  }),
  qvc.command('setPort', function(command){
    return mutateSpiritConfig(command.name, function(config){
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
    });
  }, {
    'hostPort': [
      new NotEmpty('Please specify a host port for the new port'),
      new Pattern(/^\d+$/, 'The host port must be a number')
    ],
    'containerPort': [
      new NotEmpty('Please specify a container port for the new port'),
      new Pattern(/^\d+$/, 'The container port must be a number')
    ],
    'hostIp': new Pattern(/^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})?$/, 'The host ip must follow the pattern #.#.#.#')
  }),
  qvc.command('removePort', function(command){
    return mutateSpiritConfig(command.name, function(config){
      if(!config.ports){
        config.ports = {};
      }
      config.ports[command.hostPort] = undefined;
    });
  }),
  qvc.command('addLink', function(command){
    return mutateSpiritConfig(command.name, function(config){
      if(!config.links){
        config.links = {};
      }
      config.links[command.alias] = {
        spirit: command.spirit
      };
    });
  }, {
    'alias': new NotEmpty('Please specify a alias for the new link')
  }),
  qvc.command('setLink', function(command){
    return mutateSpiritConfig(command.name, function(config){
      if(!config.links){
        config.links = {};
      }
      if(command.alias in config.links == false){
        throw new Error(command.alias+" is not in the links list");
      }
      config.links[command.alias] = {
        spirit: command.spirit
      };
    });
  }),
  qvc.command('removeLink', function(command){
    return mutateSpiritConfig(command.name, function(config){
      if(!config.links){
        config.links = {};
      }
      config.links[command.alias] = undefined;
    });
  }),
  qvc.command('addVolumesFrom', function(command){
    return mutateSpiritConfig(command.name, function(config){
      if(!config.volumesFrom){
        config.volumesFrom = [];
      }
      config.volumesFrom.push({
        spirit: command.fromSpirit,
        readOnly: command.readOnly
      });
    });
  }, {
    'fromSpirit': new NotEmpty('Please specify the spirit to use volumes from')
  }),
  qvc.command('setVolumesFrom', function(command){
    console.log("setVolumesFrom", command.name);
    return mutateSpiritConfig(command.name, function(config){
      if(!config.volumesFrom){
        config.volumesFrom = [];
      }
      
      var found = config.volumesFrom.filter(function(volumesFrom){
        return volumesFrom.spirit == command.oldFromSpirit;
      })[0];
            
      if(found){
        found.spirit = command.fromSpirit;
        found.readOnly = command.readOnly;
      }
    });
  }),
  qvc.command('removeVolumesFrom', function(command){
    return mutateSpiritConfig(command.name, function(config){
      if(!config.volumesFrom){
        config.volumesFrom = [];
      }
      var found = config.volumesFrom.filter(function(volumesFrom){
        return volumesFrom.spirit == command.fromSpirit;
      })[0];
      
      if(found){
        config.volumesFrom.splice(config.volumesFrom.indexOf(found), 1);
      }
    });
  })
];