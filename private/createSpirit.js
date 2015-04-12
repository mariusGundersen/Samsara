const co = require('co');
const fs = require('fs-promise');
const mkdirp = require('mkdirp');

module.exports = co.wrap(function *(name, image, tag){
  const path = 'config/spirits/'+name;
  const config = {
    name: name,
    image: image,
    tag: tag,
    description: '',
    url: '',
    webhook: {},
    raw: {},
    env: {},
    volumes: {},
  };
  
  yield Promise.denodeify(mkdirp)(path)
  return fs.writeFile(path+'/config.json', JSON.stringify(config, null, '  '));
});