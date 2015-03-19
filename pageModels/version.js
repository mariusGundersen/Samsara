var makePageModel = require('./spirit');
var spiritContainers = require('../providers/spiritContainers');

module.exports = function(title, content, spirit, version){
  
  return spiritContainers(spirit)
  .then(function(containers){    
    var found = containers.filter(function(c){
      return c.version == version;
    })[0];
    
    found.selected = true;
    
    return makePageModel(title, {
      menu: containers,
      content:content
    }, spirit, 'versions');
  });
};