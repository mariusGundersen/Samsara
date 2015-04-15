const co = require('co');
const fs = require('fs-promise');
const mkdirp = require('mkdirp-then');

module.exports = co.wrap(function *(name, image, tag){
  const path = 'config/spirits/'+name;
  const config = {
    name: name,
    image: image,
    tag: tag,
    deploymentMethod: 'start-before-stop',
    description: '',
    url: '',
    webhook: {},
    raw: {},
    env: {},
    volumes: {},
  };
  
  yield mkdirp(path);
  return fs.writeFile(path+'/config.json', JSON.stringify(config, null, '  '));
});
