var fs = require('fs-promise');
var users = require('../providers/authentication');

module.exports = function(mutate){
  return users()
  .then(function(entries){
    return mutate(entries) || entries;
  })
  .then(function(entries){
    return entries.map(function(entry){
      return entry.username+':'+entry.secret;
    }).join('\n')+'\n';
  })
  .then(function(contents){
    return fs.writeFile('config/authentication', contents);
  });
};