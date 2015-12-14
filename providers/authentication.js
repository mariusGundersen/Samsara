const fs = require('fs-promise');
const co = require('co');

module.exports = co.wrap(function*(){
  const contents = yield getAuth();
  return contents.split('\n')
  .filter(entry => entry.length)
  .map(line => line.split(':'))
  .map(parts => ({
    username: parts[0],
    secret: parts[1]
  }));
});

function* getAuth(){
  const authfile = 'config/authentication';
  try{
    return yield fs.readFile(authfile, 'utf8');
  }catch(e){
    console.error(e);
  }
  
  return 'admin:$apr1$TtDE7V/O$3MhOE98M30cWTDdrb1z7q1';
}
