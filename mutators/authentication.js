const fs = require('fs-promise');
const users = require('../providers/authentication');
const co = require('co');

module.exports = co.wrap(function*(mutate){
  const entries = yield users();
  const mutatedEntries = yield (mutate(entries) || entries);
  const contents = mutatedEntries.map(function(entry){
    return entry.username+':'+entry.secret;
  }).join('\n')+'\n';
  
  return fs.writeFile('config/authentication', contents);
});