var qvc = require('qvc');
var spirit = require('../providers/spirit');
var deploy = require('../private/deploy');
var spiritContainers = require('../providers/spiritContainers');
var docker = require('../private/docker');
var fs = require('fs-promise');
var mkdirp = require('mkdirp');
var Promise = require('promise');

module.exports = [
  qvc.command('newSpirit', function(command, done){
    console.log("newSpirit", command.name);
    Promise.denodeify(mkdirp)('config/spirits/'+command.name)
    .then(function(){
      return fs.writeFile('config/spirits/'+command.name+'/config.json', JSON.stringify({
        name: command.name,
        image: command.image,
        description: '',
        url: '',
        webhook: {},
        raw: {},
        env: {},
        volumes: {},
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
              message: 'Please specify a name for the new spirit'
            }
          },
          {
            name: 'Pattern',
            attributes: {
              message: 'The name of the spirit can only contain letters, digits, dashes and underscores',
              regexp: '[a-zA-Z0-9_-]+'
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
              message: 'Please specify an image for the new spirit'
            }
          }
        ]
      }
    ]
  }),
  qvc.command('deploySpirit', function(command, done){
    spirit(command.name).config()
    .then(deploy)
    .then(function(){
      done(null, true);
    }, function(error){
      done(error);
    });
  }),
  qvc.command('stopSpirit', function(command, done){
    spiritContainers(command.name).then(function(containers){
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
  qvc.command('startSpirit', function(command, done){
    spiritContainers(command.name).then(function(containers){
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
  qvc.command('restartSpirit', function(command, done){
    spiritContainers(command.name).then(function(containers){
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
  }),
  qvc.query('getListOfSpirits', function(query, done){
    spirit.list().then(function(spirits){
      done(null, spirits);
    }, function(error){
      done(error);
    });
  })
];