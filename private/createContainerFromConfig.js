const extend = require('extend');
const spiritContainers = require('../providers/spiritContainers');
const co = require('co');

module.exports = co.wrap(function*(name, life, config){
  const links = yield makeLinks(config.links);
  const volumes = yield makeVolumesFrom(config.volumesFrom);
  
  return extend({
    Image: config.image+':'+config.tag, 
    name: name,
    Env: makeEnv(config.env),
    Volumes: makeVolumes(config.volumes),
    Labels: makeLabels(config.name, life),
    HostConfig: {
      Links: links,
      Binds: makeBinds(config.volumes),
      PortBindings: makePortBindings(config.ports),
      VolumesFrom: volumes
    }
  }, config.raw);
});

function makeEnv(env){
  return Object.keys(env || {})
  .map(function(name){
    return name+'='+env[name];
  });
}

function makeVolumes(volumes){
  return Object.keys(volumes || {})
  .reduce(function(result, containerPath){
    result[containerPath] = {};
    return result;
  }, {});
}

function makeBinds(volumes){
  return Object.keys(volumes || {})
  .map(function(containerPath){
    const volume = volumes[containerPath];
    if(typeof(volume) == 'string'){
      return volume+':'+containerPath;
    }else if(volume.hostPath == ''){
      return containerPath;
    }else if(volume.readOnly){
      return volume.hostPath+':'+containerPath+':ro';
    }else{
      return volume.hostPath+':'+containerPath;
    }
  });
}

function makePortBindings(ports){
  return Object.keys(ports || {})
  .reduce(function(result, hostPort){
    const port = ports[hostPort];
    if(typeof(port) == 'string'){
      result[port+'/tcp'] = [{"HostPort": hostPort}];
    }else{
      result[port.containerPort+'/'+(port.protocol||'tcp')] = [{"HostPort": hostPort, "HostIp": port.hostIp || ''}];
    }
    return result;
  }, {});
}

function makeLinks(links){
  return Promise.all(Object.keys(links || {})
  .map(function(name){
    const link = links[name];
    if(typeof(link) == 'string'){
      return link+':'+name;
    }else if('spirit' in link){
      return getLinkToApp(link.spirit, name);
    }else if('container' in link){
      return link.container+':'+name;
    }
  }));
}

function makeVolumesFrom(spirits){
  return Promise.all((spirits || [])
  .map(function(spirit){
    return getLinkToApp(spirit.spirit, spirit.readOnly ? 'ro' : 'rw');
  }));
}

function makeLabels(name, life){
  return {
    'samsara.spirit.name': name,
    'samsara.spirit.life': life.toString()
  };
}

function getLinkToApp(spirit, name){
  return spiritContainers(spirit)
  .then(function(containers){
    return containers[0].name+':'+name;
  });
}