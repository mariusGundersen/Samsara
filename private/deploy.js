const docker = require('./docker');
const co = require('co');
const extend = require('extend');
const samsara = require('samsara-lib');
const fs = require('fs-promise');
const mkdirp = require('mkdirp-then');
const eventBus = require('./eventBus');

module.exports = {
  deploy: co.wrap(function*(name){
    const spirit = samsara().spirit(name);
    const progress = spirit.deploy();
    progress.on('start', translateEvent(eventBus, 'spirit.deploy.start'));
    progress.on('message', translateEvent(eventBus, 'spirit.deploy.message'));
    progress.on('stage', translateEvent(eventBus, 'spirit.deploy.stage'));
    progress.on('stop', translateEvent(eventBus, 'spirit.deploy.stop'));
    //const logger = yield createLogger(config.name, nextLife);

    //yield writeConfig(config, nextLife);
  }),
  rollback: co.wrap(function*(config, version){
    try{
      yield lockDeployment(config.name);
      eventBus.emit('deployLockGained', {
        id: config.name,
        plan: [
          config.deploymentMethod === 'stop-before-start' ? 'stop' : 'start',
          config.deploymentMethod === 'stop-before-start' ? 'start' : 'stop',
          'done'
        ]
      });
    }catch(e){
      throw new Error(config.name+' is already being deployed!');
    }
    
    try{
      const spirit = samsara().spirit(config.name);
      
      const currentLife = yield spirit.currentLife;
      
      const containerToStop = yield getContainerToStop(currentLife);

      const lifeToStart = spirit.life(version);

      if(!lifeToStart) throw new Error('no such version '+version);

      const containerToStart = yield lifeToStart.container;

      if(config.deploymentMethod === 'stop-before-start'){
        yield stopBeforeStart(containerToStop, containerToStart, config.name);
      }else{
        yield startBeforeStop(containerToStart, containerToStop, config.name);
      }
      
      eventBus.emit('deployProcessStep', {
        id: config.name,
        step: 'done'
      });
    }finally{
      yield unlockDeployment(config.name);
      eventBus.emit('deployLockReleased', {
        id: config.name
      });
    }
  })
};

function *startBeforeStop(containerToStart, containerToStop, name){
  eventBus.emit('deployProcessStep', {
    id: name,
    step: 'start'
  });
  
  yield start(containerToStart);
  
  yield delay(5000);
  
  eventBus.emit('deployProcessStep', {
    id: name,
    step: 'stop'
  });
  
  yield stop(containerToStop);
}

function *stopBeforeStart(containerToStop, containerToStart, name){
  eventBus.emit('deployProcessStep', {
    id: name,
    step: 'stop'
  });
  
  yield stop(containerToStop);
  
  eventBus.emit('deployProcessStep', {
    id: name,
    step: 'start'
  });
  
  try{
    yield start(containerToStart);
  }catch(e){
    if(containerToStop){
      try{
        yield start(containerToStop);
      }catch(innerException){
        e.innerException = innerException;
      }
    }
    throw e;
  }
}

function getNewName(name, life){
  return name + '_v' + life;
}

function getNextLife(latestLife){
  const life = (latestLife || {life:0}).life || 0;
  return life*1 + 1;
}

function *createLogger(name, life){
  const path = 'config/spirits/'+name+'/lives/'+life;
  yield mkdirp(path);
  const stream = fs.createWriteStream(path+'/deploy.log');
  stream.writeln = ln => stream.write(ln+'\n');
  return stream;
}

function getContainerToStop(life){
  return life ? life.container : Promise.resolve(null);
}

function *cleanupOldContainers(containers, newestLife, logger){
  const containerIds = containers
  .filter(container => container.version < newestLife)
  .map(container => container.id);
  
  logger.writeln(`removing ${containerIds.length} old containers`);
  
  const imageIds = yield Promise.all(containerIds
  .map(co.wrap(function*(containerId){
    try{
      const container = docker.getContainer(containerId);
      const imageId = (yield container.inspect()).Image;
      logger.writeln('removing container '+containerId);
      yield container.remove({v: true});
      return imageId;
    }catch(e){
      logger.writeln(e && e.message || e);
    }
  })));
  
  const distinctImageIds = imageIds.filter(distinct);
  
  logger.writeln(`removing ${distinctImageIds.length} old images`);
  
  return distinctImageIds.map(co.wrap(function *(imageId){
    try{
      const image = docker.getImage(imageId);
      logger.writeln('removing image '+imageId);
      yield image.remove();
    }catch(e){
      logger.writeln(e && e.message || e);
    }
  }));
}

function *start(container){
  console.log('starting container');
  yield container.start();
  console.log('container started');
}

function *stop(container){
  if(container){
    console.log('stopping old container', container.Id);
    yield container.stop();
    console.log('stopped old container', container.Id);
  }
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

function distinct(value, index, collection){
  return collection.indexOf(value) === index;
}

function translateEvent(out, name){
  return event => out.emit(name, Object.assign({id: event.spirit}, event));
}