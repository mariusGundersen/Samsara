import qvc from 'qvc';
import samsara from 'samsara-lib';
import NotEmpty from 'qvc/constraints/NotEmpty';
import Pattern from 'qvc/constraints/Pattern';

export default [
  qvc.command('setSpiritImageAndTag', async function(command) {
    let containerConfig = await samsara().spirit(command.name).containerConfig;
    containerConfig.image = command.image;
    containerConfig.tag = command.tag;
    await containerConfig.save();
  }, {
    'image': new NotEmpty('Specify the image to use'),
    'tag': new NotEmpty('Specify the tag')
  }),
  qvc.command('addEnvVar', async function(command) {
    let containerConfig = await samsara().spirit(command.name).containerConfig;
    let environment = containerConfig.environment;
    environment.push({
      key: command.key,
      value: command.value
    });
    containerConfig.environment = environment;
    await containerConfig.save();
  }, {
    'key': new NotEmpty('Please specify a key for the new environment variable')
  }),
  qvc.command('setEnvVar', async function(command) {
    let containerConfig = await samsara().spirit(command.name).containerConfig;
    let environment = containerConfig.environment;
    environment
      .filter(env => env.key === command.key)
      .forEach(env => env.value = command.value);
    containerConfig.environment = environment;
    await containerConfig.save();
  }),
  qvc.command('removeEnvVar', async function(command) {
    let containerConfig = await samsara().spirit(command.name).containerConfig;
    containerConfig.environment = containerConfig.environment
      .filter(env => env.key !== command.key);
    await containerConfig.save();
  }),
  qvc.command('addVolume', async function(command) {
    let containerConfig = await samsara().spirit(command.name).containerConfig;
    let volumes = containerConfig.volumes;
    volumes.push({
      containerPath: command.containerPath,
      hostPath: command.hostPath,
      readOnly: command.readOnly
    });
    containerConfig.volumes = volumes;
    await containerConfig.save();
  }, {
    'containerPath': new NotEmpty('Please specify a containerPath for the new volume')
  }),
  qvc.command('setVolume', async function(command) {
    let containerConfig = await samsara().spirit(command.name).containerConfig;
    let volumes = containerConfig.volumes;
    volumes
      .filter(volume => volume.containerPath === command.containerPath)
      .forEach(volume => {
        volume.hostPath = command.hostPath;
        volume.readOnly = command.readOnly;
      });
    containerConfig.volumes = volumes;
    await containerConfig.save();
  }),
  qvc.command('removeVolume', async function(command) {
    let containerConfig = await samsara().spirit(command.name).containerConfig;
    containerConfig.volumes = containerConfig.volumes
      .filter(volume => volume.containerPath !== command.containerPath);
    await containerConfig.save();
  }),
  qvc.command('addPort', async function(command) {
    let containerConfig = await samsara().spirit(command.name).containerConfig;
    let ports = containerConfig.ports;
    ports.push({
      hostPort: command.hostPort,
      containerPort: command.containerPort,
      hostIp: command.hostIp,
      tcp: command.tcp === true,
      udp: command.udp === true
    });
    containerConfig.ports = ports;
    await containerConfig.save();
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
  qvc.command('setPort', async function(command) {
    let containerConfig = await samsara().spirit(command.name).containerConfig;
    let ports = containerConfig.ports;
    ports
      .filter(port => port.hostPort === command.hostPort)
      .forEach(port => {
        port.containerPort = command.containerPort;
        port.hostIp = command.hostIp;
        port.tcp = command.tcp === true;
        port.udp = command.udp === true;
      });
    containerConfig.ports = ports;
    await containerConfig.save();
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
  qvc.command('removePort', async function(command) {
    let containerConfig = await samsara().spirit(command.name).containerConfig;
    containerConfig.ports = containerConfig.ports
      .filter(port => port.hostPort !== command.hostPort);
    await containerConfig.save();
  }),
  qvc.command('addLink', async function(command) {
    let containerConfig = await samsara().spirit(command.name).containerConfig;
    let links = containerConfig.links;
    links.push({
      alias: command.alias,
      spirit: command.spirit,
      container: command.container
    });
    containerConfig.links = links;
    await containerConfig.save();
  }, {
    'alias': new NotEmpty('Please specify an alias for the new link')
  }),
  qvc.command('setLink', async function(command) {
    let containerConfig = await samsara().spirit(command.name).containerConfig;
    let links = containerConfig.links;
    links
      .filter(link => link.alias === command.alias)
      .forEach(link => {
        link.spirit = command.spirit;
        link.container = command.container;
      });
    containerConfig.links = links;
    await containerConfig.save();
  }),
  qvc.command('removeLink', async function(command) {
    let containerConfig = await samsara().spirit(command.name).containerConfig;
    containerConfig.links = containerConfig.links
      .filter(link => link.alias !== command.alias);
    await containerConfig.save();
  }),
  qvc.command('addVolumesFrom', async function(command) {
    let containerConfig = await samsara().spirit(command.name).containerConfig;
    let volumesFrom = containerConfig.volumesFrom;
    volumesFrom.push({
      spirit: command.fromSpirit,
      container: command.fromContainer,
      readOnly: command.readOnly
    });
    containerConfig.volumesFrom = volumesFrom;
    await containerConfig.save();
  }, {
    'fromSpirit': new NotEmpty('Please specify the spirit to use volumes from')
  }),
  qvc.command('setVolumesFrom', async function(command) {
    console.log("setVolumesFrom", command.name);
    let containerConfig = await samsara().spirit(command.name).containerConfig;
    let volumesFrom = containerConfig.volumesFrom;
    volumesFrom
      .filter(volumeFrom => volumeFrom.spirit === command.oldFromSpirit && volumeFrom.container === command.oldFromContainer)
      .forEach(volumeFrom => {
        volumeFrom.spirit = command.fromSpirit;
        volumeFrom.container = command.fromContainer;
        volumeFrom.readOnly = command.readOnly;
      });
    containerConfig.volumesFrom = volumesFrom;
    await containerConfig.save();
  }),
  qvc.command('removeVolumesFrom', async function(command) {
    let containerConfig = await samsara().spirit(command.name).containerConfig;
    containerConfig.volumesFrom = containerConfig.volumesFrom
      .filter(volumeFrom => volumeFrom.spirit !== command.fromSpirit && volumeFrom.container !== command.fromContainer)
    await containerConfig.save();
  })
];
