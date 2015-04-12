const fs = require('fs-promise');
const co = require('co');

module.exports = co.wrap(function*(){
  const contents = yield fs.readFile('config/authentication', 'utf8');
  return contents.split('\n')
  .filter(function(entry){
    return entry.length;  
  })
  .map(function(entry){
    const parts = entry.split(':');
    return {
      username: parts[0],
      secret: parts[1]
    };
  });
});