var qvc = require('qvc');
var app = require('../providers/app');
var deploy = require('../private/deploy');
var fs = require('fs-promise');

module.exports = [
  qvc.command('newApp', function(command, done){
    console.log("newApp", command.name);
    fs.mkdir('config/apps/'+command.name)
    .then(function(){
      return fs.writeFile('config/apps/'+command.name+'/config.json', JSON.stringify({
        name: command.name,
        image: command.image,
        description: '',
        url: '',
        webhook: {},
        raw: {}
      }, null, '  '))
    })
    .then(function(){
      done(null, true);
    }, done);
  }, {
    parameters: [
      {
        name: 'name',
        constraints: [
          {
            name: 'NotEmpty',
            attributes: {
              message: 'Please specify a name for the new app'
            }
          }
        ]
      },
      {
        name: 'image',
        constraints: [
          {
            name: 'NotEmpty',
            attributes: {
              message: 'Please specify an image for the new app'
            }
          }
        ]
      }
    ]
  }),
  qvc.command('deployApp', function(command, done){
    app(command.name).config()
    .then(deploy)
    .then(function(){
      done(null, true);
    }, done);
  })
];