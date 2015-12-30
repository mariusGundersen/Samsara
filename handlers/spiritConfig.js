const qvc = require('qvc');
const samsara = require('samsara-lib');
const NotEmpty = require('qvc/constraints/NotEmpty');
const Pattern = require('qvc/constraints/Pattern');

module.exports = [
  qvc.command('setSpiritImageAndTag', function (command) {
    return samsara().spirit(command.name).mutateContainerConfig(config => {
      config.image = command.image+':'+command.tag;
    });
  }, {
    'image': new NotEmpty('Specify the image to use'),
    'tag': new NotEmpty('Specify the tag')
  }),
  qvc.command('addEnvVar', function (command) {
    return samsara().spirit(command.name).mutateContainerConfig(function (config) {
      if (!config.env) {
        config.env = {};
      }
      config.env[command.key] = command.value;
    });
  }, {
    'key': new NotEmpty('Please specify a key for the new environment variable')
  }),
  qvc.command('setEnvVar', function (command) {
    return samsara().spirit(command.name).mutateContainerConfig(function (config) {
      if (!config.env) {
        config.env = {};
      }
      if (command.key in config.env == false) {
        throw new Error(command.key + " is not in the environment variable list");
      }
      config.env[command.key] = command.value;
    });
  }),
  qvc.command('removeEnvVar', function (command) {
    return samsara().spirit(command.name).mutateContainerConfig(function (config) {
      if (!config.env) {
        config.env = {};
      }
      config.env[command.key] = undefined;
    });
  }),
  qvc.command('addVolume', function (command) {
    return samsara().spirit(command.name).mutateContainerConfig(function (config) {
      if (!config.volumes) {
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
  qvc.command('setVolume', function (command) {
    return samsara().spirit(command.name).mutateContainerConfig(function (config) {
      if (!config.volumes) {
        config.volumes = {};
      }
      if (command.containerPath in config.volumes == false) {
        throw new Error(command.containerPath + " is not in the volume list");
      }
      config.volumes[command.containerPath] = {
        hostPath: command.hostPath,
        readOnly: command.readOnly
      };
    });
  }),
  qvc.command('removeVolume', function (command) {
    return samsara().spirit(command.name).mutateContainerConfig(function (config) {
      if (!config.volumes) {
        config.volumes = {};
      }
      config.volumes[command.containerPath] = undefined;
    });
  }),
  qvc.command('addPort', function (command) {
    return samsara().spirit(command.name).mutateContainerConfig(function (config) {
      if (!config.ports) {
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
  qvc.command('setPort', function (command) {
    return samsara().spirit(command.name).mutateContainerConfig(function (config) {
      if (!config.ports) {
        config.ports = {};
      }
      if (command.hostPort in config.ports == false) {
        throw new Error(command.hostPort + " is not in the ports list");
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
  qvc.command('removePort', function (command) {
    return samsara().spirit(command.name).mutateContainerConfig(function (config) {
      if (!config.ports) {
        config.ports = {};
      }
      config.ports[command.hostPort] = undefined;
    });
  }),
  qvc.command('addLink', function (command) {
    return samsara().spirit(command.name).mutateContainerConfig(function (config) {
      if (!config.links) {
        config.links = {};
      }
      config.links[command.alias] = {
        spirit: command.spirit
      };
    });
  }, {
    'alias': new NotEmpty('Please specify a alias for the new link')
  }),
  qvc.command('setLink', function (command) {
    return samsara().spirit(command.name).mutateContainerConfig(function (config) {
      if (!config.links) {
        config.links = {};
      }
      if (command.alias in config.links == false) {
        throw new Error(command.alias + " is not in the links list");
      }
      config.links[command.alias] = {
        spirit: command.spirit
      };
    });
  }),
  qvc.command('removeLink', function (command) {
    return samsara().spirit(command.name).mutateContainerConfig(function (config) {
      if (!config.links) {
        config.links = {};
      }
      config.links[command.alias] = undefined;
    });
  }),
  qvc.command('addVolumesFrom', function (command) {
    return samsara().spirit(command.name).mutateContainerConfig(function (config) {
      if (!config.volumesFrom) {
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
  qvc.command('setVolumesFrom', function (command) {
    console.log("setVolumesFrom", command.name);
    return samsara().spirit(command.name).mutateContainerConfig(function (config) {
      if (!config.volumesFrom) {
        config.volumesFrom = [];
      }

      const found = config.volumesFrom.filter(function (volumesFrom) {
        return volumesFrom.spirit == command.oldFromSpirit;
      })[0];

      if (found) {
        found.spirit = command.fromSpirit;
        found.readOnly = command.readOnly;
      }
    });
  }),
  qvc.command('removeVolumesFrom', function (command) {
    return samsara().spirit(command.name).mutateContainerConfig(function (config) {
      if (!config.volumesFrom) {
        config.volumesFrom = [];
      }
      const found = config.volumesFrom.filter(function (volumesFrom) {
        return volumesFrom.spirit == command.fromSpirit;
      })[0];

      if (found) {
        config.volumesFrom.splice(config.volumesFrom.indexOf(found), 1);
      }
    });
  })
];