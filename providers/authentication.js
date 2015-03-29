var fs = require('fs-promise');

module.exports = function(){
  return fs.readFile('config/authentication', 'utf8')
  .then(function(contents){
    return contents.split('\n')
    .filter(function(entry){
      return entry.length;  
    })
    .map(function(entry){
      var parts = entry.split(':');
      return {
        username: parts[0],
        realm: parts[1],
        secret: parts[2]
      };
    });
  });
};