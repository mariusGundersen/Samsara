'use strict'

const qvc = require('qvc');
const samsara = require('samsara-lib');
const NotEmpty = require('qvc/constraints/NotEmpty');
const Pattern = require('qvc/constraints/Pattern');
const transform = require('../private/transformComposeConfig');

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
      let environment = transform.environmentFromCompose(config);
      environment.push({key:command.key, value: command.value});
      config.environment = transform.environmentToCompose(environment);
    });
  }, {
    'key': new NotEmpty('Please specify a key for the new environment variable')
  }),
  qvc.command('setEnvVar', function (command) {
    return samsara().spirit(command.name).mutateContainerConfig(function (config) {
      let environment = transform.environmentFromCompose(config);
      environment
        .filter(env => env.key === command.key)
        .forEach(env => env.value = command.value);
      config.environment = transform.environmentToCompose(environment);
    });
  }),
  qvc.command('removeEnvVar', function (command) {
    return samsara().spirit(command.name).mutateContainerConfig(function (config) {
      let environment = transform.environmentFromCompose(config)
        .filter(env => env.key !== command.key);
      config.environment = transform.environmentToCompose(environment);
    });
  }),
  qvc.command('addVolume', function (command) {
    return samsara().spirit(command.name).mutateContainerConfig(function (config) {
      let volumes = transform.volumesFromCompose(config);
      volumes.push({containerPath:command.containerPath, hostPath: command.hostPath, readOnly: command.readOnly});
      config.volumes = transform.volumesToCompose(volumes);
    });
  }, {
    'containerPath': new NotEmpty('Please specify a containerPath for the new volume')
  }),
  qvc.command('setVolume', function (command) {
    return samsara().spirit(command.name).mutateContainerConfig(function (config) {
      let volumes = transform.volumesFromCompose(config);
      volumes
        .filter(volume => volume.containerPath === command.containerPath)
        .forEach(volume => {
          volume.hostPath = command.hostPath;
          volume.readOnly = command.readOnly;
        });
      config.volumes = transform.volumesToCompose(volumes);
    });
  }),
  qvc.command('removeVolume', function (command) {
    return samsara().spirit(command.name).mutateContainerConfig(function (config) {
      let volumes = transform.volumesFromCompose(config)
        .filter(volume => volume.containerPath !== command.containerPath);
      config.volumes = transform.volumesToCompose(volumes);
    });
  }),
  qvc.command('addPort', function (command) {
    return samsara().spirit(command.name).mutateContainerConfig(function (config) {
      let ports = transform.portsFromCompose(config);
      ports.push({hostPort: command.hostPort, containerPort: command.containerPort, hostIp: command.hostIp});
      config.ports = transform.portsToCompose(ports);
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
      let ports = transform.portsFromCompose(config);
      ports
        .filter(port => port.hostPort === command.hostPort)
        .forEach(port => {
          port.containerPort = command.containerPort;
          port.hostIp = command.hostIp;
        });
      config.ports = transform.portsToCompose(ports);
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
      let ports = transform.portsFromCompose(config)
        .filter(port => port.hostPort !== command.hostPort);
      config.ports = transform.portsToCompose(ports);
    });
  }),
  qvc.command('addLink', function (command) {
    return samsara().spirit(command.name).mutateContainerConfig(function (config) {
      let links = transform.linksFromCompose(config);
      links.push({alias: command.alias, spirit: command.spirit, container: command.container});
      config.links = transform.linksToCompose(links);
    });
  }, {
    'alias': new NotEmpty('Please specify an alias for the new link')
  }),
  qvc.command('setLink', function (command) {
    return samsara().spirit(command.name).mutateContainerConfig(function (config) {
      let links = transform.linksFromCompose(config);
      links
        .filter(link => link.alias === command.alias)
        .forEach(link => {
          link.spirit = command.spirit;
          link.container = command.container;
        });
      config.links = transform.linksToCompose(links);
    });
  }),
  qvc.command('removeLink', function (command) {
    return samsara().spirit(command.name).mutateContainerConfig(function (config) {
      let links = transform.linksFromCompose(config)
        .filter(link => link.alias !== command.alias);
      config.links = transform.linksToCompose(links);
    });
  }),
  qvc.command('addVolumesFrom', function (command) {
    return samsara().spirit(command.name).mutateContainerConfig(function (config) {
      let volumesFrom = transform.volumesFromFromCompose(config);
      volumesFrom.push({spirit: command.fromSpirit, container: command.fromContainer, readOnly: command.readOnly});
      config.volumesFrom = transform.volumesFromToCompose(volumesFrom);
    });
  }, {
    'fromSpirit': new NotEmpty('Please specify the spirit to use volumes from')
  }),
  qvc.command('setVolumesFrom', function (command) {
    console.log("setVolumesFrom", command.name);
    return samsara().spirit(command.name).mutateContainerConfig(function (config) {
      let volumesFrom = transform.volumesFromFromCompose(config);
      volumesFrom
        .filter(volumeFrom => volumeFrom.spirit === command.oldFromSpirit && volumeFrom.container === command.oldFromContainer)
        .forEach(volumeFrom => {
          volumeFrom.spirit = command.fromSpirit;
          volumeFrom.container = command.fromContainer;
          volumeFrom.readOnly = command.readOnly;
        });
      config.volumesFrom = transform.volumesFromToCompose(volumesFrom);
    });
  }),
  qvc.command('removeVolumesFrom', function (command) {
    return samsara().spirit(command.name).mutateContainerConfig(function (config) {
      let volumesFrom = transform.volumesFromFromCompose(config)
        .filter(volumeFrom => volumeFrom.spirit !== command.fromSpirit && volumeFrom.container !== command.fromContainer)
      config.volumesFrom = transform.volumesFromToCompose(volumesFrom);
    });
  })
];
