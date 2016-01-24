'use strict'
const qvc = require('qvc');
const co = require('co');
const NotEmpty = require('qvc/constraints/NotEmpty');
const samsara = require('samsara-lib');

module.exports = [
  qvc.command('setAuthentication', co.wrap(function*(command){
    const users = yield samsara().users();
    const found = users.filter(user => user.username === command.username)[0];

    if(!found) return {success:false, valid:false, violations: [{fieldName:'', message: 'Unknown user'}]};

    found.password = command.password;
    yield found.save();
  }), {
    'username': new NotEmpty('Please specify the username to change password for'),
    'password': new NotEmpty('Please specify a new password')
  })
];
