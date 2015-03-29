var fs = require('fs-promise');
var Promise = require('promise');
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

spirit.list = function(){
  return fs.readdir('config/spirits')
  .then(function(files){
    return Promise.all(files.map(function(file){
      return fs.stat('config/spirits/'+file)
      .then(function(stat){
        return {name: file, isDir: stat.isDirectory()};
      });
    }));
  })
  .then(function(files){
    return files.filter(function(file){
      return file.isDir;
    }).map(function(dir){
      return dir.name;
    });
  })
};

module.exports = spirit;