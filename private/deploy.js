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
    const plan = [
      'pull',
      'create',
      config.deploymentMethod === 'stop-before-start' ? 'stop' : 'start',
      config.deploymentMethod === 'stop-before-start' ? 'start' : 'stop',
      'cleanup',
      'done'
    ].filter(step => config.cleanupLimit > 0 || step != 'cleanup');
    
    
    try{
      yield lockDeployment(config.name);
      eventBus.emit('deployLockGained', {
        id: config.name,
        plan: plan
      });
    }catch(e){
      throw new Error(config.name+' is already being deployed!');
    }
    var success = false;
    
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

      logger.writeln('pulling image');
      yield docker.pull(config.image, function(event){
        eventBus.emit('deployProcessPullStepProgress', {
          id: config.name,
          progress: event
        });
        logger.writeln(JSON.stringify(event)+'');
      });
      logger.writeln('image pulled');

      eventBus.emit('deployProcessStep', {
        id: config.name,
        step: 'create'
      });

      logger.writeln('compiling config');
      const dockerConfig = yield createContainerFromConfig(containerName, nextLife, config);
      logger.writeln('config compiled');

      logger.writeln('creating container');
      const containerToStart = yield docker.createContainer(dockerConfig)
      logger.writeln('container created');

      const containersToStop = runningContainers(oldContainers);

      if(config.deploymentMethod === 'stop-before-start'){
        logger.writeln('stop-before-start');
        yield stopBeforeStart(containersToStop, containerToStart, config.name);
      }else{
        logger.writeln('start-before-stop');
        yield startBeforeStop(containerToStart, containersToStop, config.name);
      }

      if(config.cleanupLimit > 0){
        eventBus.emit('deployProcessStep', {
          id: config.name,
          step: 'cleanup'
        });

        logger.writeln('cleaning up old containers and images');
        yield cleanupOldContainers(oldContainers, nextLife - config.cleanupLimit, logger);
        logger.writeln('cleanup completed');
      }

      eventBus.emit('deployProcessStep', {
        id: config.name,
        step: 'done'
      });
      
      logger.writeln(config.name + ' deployed successfully');
      success = true;
    }catch(e){
      if(logger){
        logger.writeln('Failed to deploy!');
        logger.writeln(e && e.message || e);
      }
      eventBus.emit('deployFailed', {
        id: config.name,
        error: e && e.message || e
      });
      throw e;
    }finally{
      logger && logger.end('Done');
      yield unlockDeployment(config.name);
      eventBus.emit('deployLockReleased', {
        id: config.name,
        success: success
      });
    }
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
      const containers = yield spiritContainers(config.name);

      const containersToStop = runningContainers(containers);

      const found = containers.filter(function(container){
        return container.version == version;
      })[0];

      if(!found) throw new Error('no such version '+version);

      const containerToStart = docker.getContainer(found.id);

      if(config.deploymentMethod === 'stop-before-start'){
        yield stopBeforeStart(containersToStop, containerToStart, config.name);
      }else{
        yield startBeforeStop(containerToStart, containersToStop, config.name);
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
  const stream = fs.createWriteStream(path+'/deploy.log');
  stream.writeln = ln => stream.write(ln+'\n');
  return stream;
}

function runningContainers(oldContainers){
  return oldContainers.filter(function(container){
    return container.state === 'running';
  }).map(function(container){
    return docker.getContainer(container.id);
  })
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

function distinct(value, index, collection){
  return collection.indexOf(value) === index;
}