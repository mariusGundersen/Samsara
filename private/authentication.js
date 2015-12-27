'use strict'
const fs = require('fs-promise');
const co = require('co');

const users = co.wrap(function*(){
  const contents = yield getAuth();
  return contents.split('\n')
  .filter(entry => entry.length)
  .map(line => line.split(':'))
  .map(parts => ({
    username: parts[0],
    secret: parts[1]
  }));
});

const mutate = co.wrap(function*(mutate){
  const entries = yield users();
  const mutatedEntries = yield (mutate(entries) || entries);
  const contents = mutatedEntries.map(function(entry){
    return entry.username+':'+entry.secret;
  }).join('\n')+'\n';

  return fs.writeFile('config/authentication', contents);
});

module.exports = {
  mutate: mutate,
  users: users
};

function* getAuth(){
  const authfile = 'config/authentication';
  try{
    return yield fs.readFile(authfile, 'utf8');
  }catch(e){
    console.error(e);
  }

  return 'admin:$apr1$TtDE7V/O$3MhOE98M30cWTDdrb1z7q1';
}
