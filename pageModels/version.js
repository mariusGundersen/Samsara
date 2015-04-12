const makePageModel = require('./spirit');
const spiritContainers = require('../providers/spiritContainers');
const co = require('co');

module.exports = co.wrap(function*(title, content, spirit, version){
  const containers = spiritContainers(spirit);
  
  var found = containers.filter(function(c){
    return c.version == version;
  })[0];

  found.selected = true;

  return makePageModel(title, {
    menu: containers,
    content:content
  }, spirit, 'versions');
});