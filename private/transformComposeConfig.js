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
  }
}