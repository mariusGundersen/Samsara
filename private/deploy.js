const docker = require('./docker');
const co = require('co');
const extend = require('extend');
const createContainerFromConfig = require('./createContainerFromConfig');
const spiritContainers = require('../providers/spiritContainers');
const fs = require('fs-promise');
const mkdirp = require('mkdirp-then');

module.exports = co.wrap(function*(config){
  try{
    yield lockDeployment(config.name);
  }catch(e){
    throw new Error(config.name+' is already being deployed!');
  }
  
  try{
    console.log('deploying', config.image);
    
    yield pull(config.image);

    const oldContainers = yield spiritContainers(config.name);

    const nextLife = yield getNextLife(oldContainers);

    const containerName = yield getNewName(config.name, nextLife);

    const dockerConfig = yield compileConfig(containerName, nextLife, config);

    const container = yield create(dockerConfig);

    yield writeConfig(config, nextLife);

    const runningContainers = oldContainers.filter(function(container){
      return container.state === 'running';
    }).map(function(container){
      return docker.getContainer(container.id);
    });

    if(config.deploymentMethod === 'stop-before-start'){
      yield stopBeforeStart(runningContainers, container);
    }else{
      yield startBeforeStop(container, runningContainers);
    }
    
    console.log(config.name, 'deployed');
  }finally{
    yield unlockDeployment(config.name);
  }
});

module.exports.startBeforeStop = co.wrap(startBeforeStop);
module.exports.stopBeforeStart = co.wrap(stopBeforeStart);

function *startBeforeStop(container, runningContainers){
  console.log('start-before-stop');
  
  yield start(container);
  
  yield stop(runningContainers);
}

function *stopBeforeStart(runningContainers, container){
  console.log('stop-before-start');
  
  yield stop(runningContainers);
  
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

function *pull(image){
  console.log('pulling image');
  yield docker.pull(image);
  console.log('image pulled');
}

function *getNewName(name, life){
  return name + '_v' + life;
}

function *getNextLife(containers){
  const version = (containers[0] || {version:0}).version || 0;
  return version+1;
}

function *compileConfig(name, life, config){
  console.log('compiling config');
  const dockerConfig = yield createContainerFromConfig(name, life, config);
  console.log('config compiled');
  return dockerConfig;
}

function *create(config){
  console.log('creating container');
  const container = yield docker.createContainer(config)
  console.log('container created');
  return container;
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