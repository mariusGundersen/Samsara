var fs = require('fs-promise');

module.exports = function(name, mutate){
  return fs.readFile('config/apps/'+name+'/config.json')
  .then(JSON.parse)
  .then(function(config){
    return mutate(config) || config;
  })
  .then(function(config){
    return fs.writeFile('config/apps/'+name+'/config.json', JSON.stringify(config, null, '  '));
  });
};