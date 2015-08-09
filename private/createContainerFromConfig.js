const extend = require('extend');
const co = require('co');
const samsara = require('samsara-lib');

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
      return getCurrentLifeContainerId(link.spirit)
        .then(id => id +':'+ name)
        .catch(e => {throw new Error(`Could not link to ${link.spirit}. Theres no running versions of that spirit`)});
    }else if('container' in link){
      return link.container+':'+name;
    }
  }));
}

function makeVolumesFrom(spirits){
  return Promise.all((spirits || [])
  .map(function(spirit){
    return getCurrentLifeContainerId(spirit.spirit)
      .then(id => id+':'+(spirit.readOnly ? 'ro' : 'rw'))
      .catch(e => {throw new Error(`Could not get volumes from ${spirit.spirit}. Theres no running versions of that spirit`)});
  }));
}

function makeLabels(name, life){
  return {  
    'samsara.spirit.name': name,
    'samsara.spirit.life': life.toString()
  };
}

function getCurrentLifeContainerId(name){
  return samsara().spirit(name).currentLife
  .then(life => life.container)
  .then(container => container.id);
}