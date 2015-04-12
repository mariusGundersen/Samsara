var fs = require('fs-promise');
var co = require('co');
var freeze = require('deep-freeze');

function spirit(name){
  return {
    config: function(){
      return fs.readFile('config/spirits/'+name+'/config.json')
      .then(JSON.parse);
      //.then(freeze);
    }
  };
};

spirit.list = co.wrap(function*(){
  const dirEntry = yield fs.readdir('config/spirits');
  const files = yield dirEntry.map(co.wrap(function*(file){
    const stat = yield fs.stat('config/spirits/'+file);
    return {
      name: file, 
      isDir: stat.isDirectory()
    };
  }));
  
  return files.filter(function(file){
    return file.isDir;
  }).map(function(dir){
    return dir.name;
  });
});

module.exports = spirit;