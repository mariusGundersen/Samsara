var qvc = require('qvc');
var app = require('../providers/app');
var deploy = require('../private/deploy');
var appContainers = require('../providers/appContainers');
var docker = require('../private/docker');
var fs = require('fs-promise');
var Promise = require('promise');

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
    }, function(error){
      done(error);
    });
  }),
  qvc.command('stopApp', function(command, done){
    appContainers(command.name).then(function(containers){
      return containers.filter(function(container){
        return container.state == 'running';
      });
    }).then(function(containers){
      return Promise.all(containers.map(function(container){
        return docker.getContainer(container.id).stop();
      }));
    })
    .then(function(){
      done(null, true);
    }, function(error){
      done(error);
    });
  }),
  qvc.command('startApp', function(command, done){
    appContainers(command.name).then(function(containers){
      return containers.filter(function(container){
        return container.state == 'stopped';
      })[0];
    }).then(function(container){
      return docker.getContainer(container.id).start();
    })
    .then(function(){
      done(null, true);
    }, function(error){
      done(error);
    });
  }),
  qvc.command('restartApp', function(command, done){
    appContainers(command.name).then(function(containers){
      return containers.filter(function(container){
        return container.state == 'running';
      })[0];
    }).then(function(container){
      return docker.getContainer(container.id).restart();
    })
    .then(function(){
      done(null, true);
    }, function(error){
      done(error);
    });
  })
];