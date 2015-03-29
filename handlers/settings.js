var qvc = require('qvc');
var authentication = require('../mutators/authentication');
var md5 = require('apache-md5');

module.exports = [
  qvc.command('setAuthentication', function(command, done){
    
    authentication(function(entries){
      var found = entries.filter(function(entry){
        return entry.username == command.username;
      })[0];
      
      if(found == null){
        found = {
          username: command.username
        };
        entries.push(found);
      }
      
      found.secret = md5(command.password);
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