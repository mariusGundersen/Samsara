'use strict'
const qvc = require('qvc');
const NotEmpty = require('qvc/constraints/NotEmpty');
const authentication = require('../private/authentication');
const md5 = require('apache-md5');

module.exports = [
  qvc.command('setAuthentication', function(command){
    return authentication.mutate(function(entries){
      let found = entries.filter(function(entry){
        return entry.username == command.username;
      })[0];

      if(found == null){
        found = {
          username: command.username
        };
        entries.push(found);
      }

      found.secret = md5(command.password);
    });
  }, {
    'username': new NotEmpty('Please specify the username to change password for'),
    'password': new NotEmpty('Please specify a new password')
  })
];