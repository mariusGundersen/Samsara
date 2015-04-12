const docker = require('./docker');
const co = require('co');
const extend = require('extend');
const createContainerFromConfig = require('./createContainerFromConfig');
const spiritContainers = require('../providers/spiritContainers');

module.exports = co.wrap(function*(config){
  console.log('deploying', config.image);
  
  yield pull(config.image);
  
  const oldContainers = yield spiritContainers(config.name);
  
  const containerName = yield getNewName(config.name, oldContainers);
  
  const dockerConfig = yield compileConfig(containerName, config);
  
  const container = yield create(dockerConfig);
  
  const runningContainers = oldContainers.filter(function(container){
    return container.state === 'running';
  });
  
  if(config.deploymentMethod === 'stop-before-start'){
    yield stopBeforeStart(runningContainers, container);
  }else{
    yield startBeforeStop(container, runningContainers);
  }
  
  console.log(config.name, 'deployed');
});

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
      yield start(runningContainers[0]);
    }
    throw e;
  }
}

function *pull(image){
  console.log('pulling image');
  yield docker.pull(image);
  console.log('image pulled');
}

function *getNewName(name, containers){
  const version = (containers[0] || {version:0}).version || 0;
  return name + '_v' + (version+1);
}

function *compileConfig(name, config){
  console.log('compiling config');
  const dockerConfig = yield createContainerFromConfig(name, config);
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
    yield docker.getContainer(container.id).stop();
    console.log('stopped old container', container.id);
  });
}