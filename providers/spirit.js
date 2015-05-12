const fs = require('fs-promise');
const co = require('co');

function spirit(name){
  return {
    config: co.wrap(function*(){
      const result = yield fs.readFile('config/spirits/'+name+'/config.json');
      return JSON.parse(result);
    })
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
  }).sort(function(a, b){
    return a.toLowerCase().localeCompare(b.toLowerCase());
  });
});

module.exports = spirit;