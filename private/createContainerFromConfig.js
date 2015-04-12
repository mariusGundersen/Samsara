var extend = require('extend');
var spiritContainers = require('../providers/spiritContainers');
var co = require('co');

module.exports = co.wrap(function*(name, config){
  const links = yield makeLinks(config.links);
  const volumes = yield makeVolumesFrom(config.volumesFrom);
  
  return extend({
    Image: config.image+':'+config.tag, 
    name: name,
    Env: makeEnv(config.env),
    Volumes: makeVolumes(config.volumes),
    HostConfig: {
      Links: links,
      Binds: makeBinds(config.volumes),
      PortBindings: makePortBindings(config.ports),
      VolumesFrom: volumes
    }
  }, config.raw);
});

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

function makePortBindings(ports){
  var result = {};
  if(ports){
    for(var hostPort in ports){
      if(ports.hasOwnProperty(hostPort)){
        var port = ports[hostPort];
        if(typeof(port) == 'string'){
          result[port+'/tcp'] = [{"HostPort": hostPort}];
        }else{
          result[port.containerPort+'/'+(port.protocol||'tcp')] = [{"HostPort": hostPort, "HostIp": port.hostIp || ''}];
        }
      }
    }
  }
  return result;
}

function makeLinks(links){
  var result = [];
  if(links){
    for(var name in links){
      if(links.hasOwnProperty(name)){
        var link = links[name];
        if(typeof(link) == 'string'){
          result.push(link+':'+name);
        }else if('spirit' in link){
          result.push(getLinkToApp(link.spirit, name));
        }else if('container' in link){
          result.push(link.container+':'+name);
        }
      }
    }
  }
  
  return Promise.all(result);
}

function makeVolumesFrom(spirits){
  return Promise.all((spirits || []).map(function(spirit){
    return getLinkToApp(spirit.spirit, spirit.readOnly ? 'ro' : 'rw');
  }));
}

function getLinkToApp(spirit, name){
  return spiritContainers(spirit)
  .then(function(containers){
    return containers[0].name+':'+name;
  });
}