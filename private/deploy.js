const docker = require('./docker');
const co = require('co');
const extend = require('extend');
const createContainerFromConfig = require('./createContainerFromConfig');
const spirit = require('../providers/spirit');
const spiritContainers = require('../providers/spiritContainers');
const fs = require('fs-promise');
const mkdirp = require('mkdirp-then');
const eventBus = require('./eventBus');

module.exports = {
  deploy: co.wrap(function*(config){
    try{
      yield lockDeployment(config.name);
      eventBus.emit('deployLockGained', {
        id: config.name
      });
    }catch(e){
      throw new Error(config.name+' is already being deployed!');
    }

    try{
      console.log('deploying', config.image);

      const oldContainers = yield spiritContainers(config.name);

      const nextLife = yield getNextLife(oldContainers);

      const logger = yield createLogger(config.name, nextLife);

      yield writeConfig(config, nextLife);

      const containerName = yield getNewName(config.name, nextLife);

      eventBus.emit('deployProcessStep', {
        id: config.name,
        step: 'pull'
      });

      logger.write('pulling image\n');
      yield docker.pull(config.image, logger);
      logger.write('image pulled\n');

      eventBus.emit('deployProcessStep', {
        id: config.name,
        step: 'create'
      });

      logger.write('compiling config\n');
      const dockerConfig = yield createContainerFromConfig(containerName, nextLife, config);
      logger.write('config compiled\n');

      logger.write('creating container\n');
      const containerToStart = yield docker.createContainer(dockerConfig)
      logger.write('container created\n');

      const containersToStop = runningContainers(oldContainers);

      if(config.deploymentMethod === 'stop-before-start'){
        logger.write('start-before-stop\n');
        yield stopBeforeStart(containersToStop, containerToStart, config.name);
      }else{
        logger.write('stop-before-start\n');
        yield startBeforeStop(containerToStart, containersToStop, config.name);
      }

      logger.write(config.name + ' deployed successfully\n');
    }finally{
      logger && logger.end('done');
      yield unlockDeployment(config.name);
      eventBus.emit('deployLockReleased', {
        id: config.name
      });
    }
  }),
  rollback: co.wrap(function*(name, version){
    try{
      yield lockDeployment(name);
      eventBus.emit('deployLockGained', {
        id: name
      });
    }catch(e){
      throw new Error(name+' is already being deployed!');
    }
    
    try{
      const containers = yield spiritContainers(name);

      const containersToStop = runningContainers(containers);

      const found = containers.filter(function(container){
        return container.version == version;
      })[0];

      if(!found) throw new Error('no such version '+version);

      const containerToStart = docker.getContainer(found.id);
      const config = yield spirit(name).config();

      if(config.deploymentMethod === 'stop-before-start'){
        yield stopBeforeStart(containersToStop, containerToStart, name);
      }else{
        yield startBeforeStop(containerToStart, containersToStop, name);
      }
    }finally{
      yield unlockDeployment(name);
      eventBus.emit('deployLockReleased', {
        id: name
      });
    }
  })
};

function *startBeforeStop(container, runningContainers, name){
  eventBus.emit('deployProcessStep', {
    id: name,
    step: 'start'
  });
  
  yield start(container);
  
  yield delay(5000);
  
  eventBus.emit('deployProcessStep', {
    id: name,
    step: 'stop'
  });
  
  yield stop(runningContainers);
}

function *stopBeforeStart(runningContainers, container, name){
  eventBus.emit('deployProcessStep', {
    id: name,
    step: 'stop'
  });
  
  yield stop(runningContainers);
  
  eventBus.emit('deployProcessStep', {
    id: name,
    step: 'start'
  });
  
  try{
    yield start(container);
  }catch(e){
    if(runningContainers && runningContainers.length){
      try{
        yield start(runningContainers[0]);
      }catch(innerException){
        e.innerException = innerException;
      }
    }
    throw e;
  }
}

function *getNewName(name, life){
  return name + '_v' + life;
}

function *getNextLife(containers){
  const version = (containers[0] || {version:0}).version || 0;
  return version+1;
}

function *createLogger(name, life){
  const path = 'config/spirits/'+name+'/lives/'+life;
  yield mkdirp(path);
  return fs.createWriteStream(path+'/deploy.log');
}

function runningContainers(oldContainers){
  return oldContainers.filter(function(container){
    return container.state === 'running';
  }).map(function(container){
    return docker.getContainer(container.id);
  })
}

function *start(container){
  console.log('starting container');
  yield container.start();
  console.log('container started');
}

function *stop(containers){
  console.log('stopping old containers', containers.length);
  yield containers.map(function*(container){
    console.log('old container found, will be stopped', container.id);
    yield container.stop();
    console.log('stopped old container', container.id);
  });
}

function *writeConfig(config, life){
  const path = 'config/spirits/'+config.name+'/lives/'+life;
  yield mkdirp(path);
  return fs.writeFile(path+'/config.json', JSON.stringify(config, null, '  '));
}

function *lockDeployment(name){
  const path = 'config/spirits/'+name;
  yield mkdirp(path);
  yield fs.open(path+'/deploy.lock', 'wx');
}

function *unlockDeployment(name){
  const path = 'config/spirits/'+name;
  return fs.unlink(path+'/deploy.lock');
}

function delay(ms){
  return new Promise(function(resolve){
    setTimeout(resolve, ms);
  });
}