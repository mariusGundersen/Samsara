module.exports = {
  environmentFromCompose: function(config){
    if(Array.isArray(config.environment)){
      return config.environment
        .map(env => env.split('='))
        .map(pair => ({
          key: pair.shift(),
          value: pair.join('=')
        }));
    }else{
      return Object.keys(config.environment || {})
        .map(key => ({
          key: key,
          value: config.environment[key]
        }));
    }
  },
  environmentToCompose: function(environment){
    return environment
      .map(env => env.key+'='+env.value);
  },
  volumesFromCompose: function(config){
    return (config.volumes || [])
      .map(volume => volume.split(':'))
      .map(parts => ({
        containerPath: parts[parts.length == 1 ? 0 : 1],
        hostPath: parts.length == 1 ? '' : parts[0],
        readOnly: parts.length == 3 ? parts[2] === 'ro' : false
      }));
  },
  volumesToCompose: function(volumes){
    return volumes
      .map(volume => {
        if(volume.hostPath){
          if(volume.readOnly){
            return volume.hostPath+':'+volume.containerPath+':ro';
          }else{
            return volume.hostPath+':'+volume.containerPath;
          }
        }else{
          if(volume.readOnly){
            return volume.containerPath+':ro';
          }else{
            return volume.containerPath;
          }
        }
      });
  },
  portsFromCompose: function(config){
    return (config.ports || [])
      .map(port => {
        const parts = port.split(':');
        if(parts.length == 1){
          return {containerPort: parts[0], hostPort: '', hostIp: ''};
        }else if(parts.length == 2){
          return {containerPort: parts[1], hostPort: parts[0], hostIp: ''};
        }else if(parts.length == 3){
          return {containerPort: parts[2], hostPort: parts[1], hostIp: parts[0]};
        }
      });
  },
  portsToCompose: function(ports){
    return ports
      .map(port => {
        if(port.hostPort){
          if(port.hostIp){
            return port.hostIp+':'+port.hostPort+':'+port.containerPort;
          }else{
            return port.hostPort+':'+port.containerPort;
          }
        }else{
          return port.containerPort;
        }
      });
  },
  linksFromCompose: function(config){
    return (config.links || [])
      .map(link => {
        const parts = link.split(':');
        const match = /^spirit\(([a-zA-Z0-9_\.-]+)\)$/.exec(parts[0]);
        if(match){
          if(parts.length == 1){
            return {spirit: match[1], alias: match[1], container: null};
          }else if(parts.length == 2){
            return {spirit: match[1], alias: parts[1], container: null};
          }
        }else{
          if(parts.length == 1){
            return {container: parts[0], alias: parts[0]};
          }else if(parts.length == 2){
            return {container: parts[0], alias: parts[1]};
          }
        }
      });
  },
  linksToCompose: function(links){
    return links
      .map(link => {
        if(link.spirit){
          return `spirit(${link.spirit}):${link.alias}`;
        }else{
          return `${link.container}:${link.alias}`;
        }
      });
  },
  volumesFromFromCompose: function(config){
    return (config.volumesFrom || [])
      .map(volumeFrom => {
        const parts = volumeFrom.split(':');
        const match = /^spirit\(([a-zA-Z0-9_\.-]+)\)$/.exec(parts[0]);
        if(match){
          if(parts.length == 1){
            return {spirit: match[1], readOnly: false, container: null};
          }else if(parts.length == 2){
            return {spirit: match[1], readOnly: parts[1] === 'ro', container: null};
          }
        }else{
          if(parts.length == 1){
            return {container: parts[0], readOnly: false};
          }else if(parts.length == 2){
            return {container: parts[0], readOnly: parts[1] === 'ro'};
          }
        }
      });
  },
  volumesFromToCompose: function(volumesFrom){
    return volumesFrom
      .map(volumeFrom => {
        if(volumeFrom.spirit){
          return `spirit(${volumeFrom.spirit})`+(volumeFrom.readOnly ? ':ro' : '');
        }else{
          return volumeFrom.container + (volumeFrom.readOnly ? ':ro' : '');
        }
      });
  }
}