const fs = require('fs-promise');
const co = require('co');

module.exports = co.wrap(function*(name, mutate){
  const path = 'config/spirits/'+name+'/config.json';
  
  const json = yield fs.readFile(path);
  const config = JSON.parse(json);
  const mutatedConfig = yield (mutate(config) || config);
  const contents = JSON.stringify(mutatedConfig, null, '  ');
  
  return fs.writeFile(path, contents);
});