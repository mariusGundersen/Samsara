var qvc = require('qvc');
var authentication = require('../mutators/authentication');
var crypto = require('crypto');

function md5(username, realm, password){
  hash = crypto.createHash('MD5');
  hash.update(username+':'+realm+':'+password);
  return hash.digest('hex');
}

module.exports = [
  qvc.command('setAuthentication', function(command, done){
    
    console.log(command);
    
    authentication(function(entries){
      var found = entries.filter(function(entry){
        return entry.username == command.username;
      })[0];
      
      if(found == null){
        found = {
          username: command.username,
          realm: 'Samsara'
        };
        entries.push(found);
      }
      
      found.secret = md5(found.username, found.realm, command.password);
      console.log(entries);
    }).then(function(){
      done(null, true);
    }, function(err){
      done(err);
    });
  }, {
    parameters: [
      {
        name: 'username',
        constraints: [
          {
            name: 'NotEmpty',
            attributes: {
              message: 'Please specify the username to change password for'
            }
          }
        ]
      },
      {
        name: 'password',
        constraints: [
          {
            name: 'NotEmpty',
            attributes: {
              message: 'Please specify a new password'
            }
          }
        ]
      }
    ] 
  })
];