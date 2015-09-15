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
    cleanupLimit: 10,
    description: '',
    url: '',
    webhook: {
      enable: false,
      secret: ''
    },
    raw: {},
    env: {},
    links: {},
    ports: {},
    volumes: {},
    volumesFrom: []
  };
  
  yield mkdirp(path);
  return fs.writeFile(path+'/config.json', JSON.stringify(config, null, '  '));
});
