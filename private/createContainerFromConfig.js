var extend = require('extend');

module.exports = function(name, config){
  return extend({
    Image: config.image, 
    name: name,
    Env: makeEnv(config.env),
    Volumes: makeVolumes(config.volumes),
    HostConfig: {
      Binds: makeBinds(config.volumes)
    }
  }, config.raw);
};

function makeEnv(env){
  var result = [];
  if(env){
    for(var name in env){
      if(env.hasOwnProperty(name)){
        result.push(name+'='+env[name]);
      }
    }
  }
  return result;
}

function makeVolumes(volumes){
  var result = {};
  if(volumes){
    for(var containerPath in volumes){
      if(volumes.hasOwnProperty(containerPath)){
        result[containerPath] = {};
      }
    }
  }
  return result;
}

function makeBinds(volumes){
  var result = [];
  if(volumes){
    for(var containerPath in volumes){
      if(volumes.hasOwnProperty(containerPath)){
        var volume = volumes[containerPath];
        if(typeof(volume) == 'string'){
          result.push(volume+':'+containerPath);
        }else if(volume.hostPath == ''){
          result.push(containerPath);
        }else if(volume.readOnly){
          result.push(volume.hostPath+':'+containerPath+':ro');
        }else{
          result.push(volume.hostPath+':'+containerPath);
        }
      }
    }
  }
  return result;
}
