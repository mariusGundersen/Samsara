var qvc = require('qvc');
var spirit = require('../providers/spirit');
var deploy = require('../private/deploy');
var spiritContainers = require('../providers/spiritContainers');
var docker = require('../private/docker');
var fs = require('fs-promise');
var mkdirp = require('mkdirp');
var Promise = require('promise');
var NotEmpty = require('qvc/constraints/NotEmpty');
var Pattern = require('qvc/constraints/Pattern');

module.exports = [
  qvc.command('newSpirit', function(command){
    console.log("newSpirit", command.name);
    return Promise.denodeify(mkdirp)('config/spirits/'+command.name)
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
    });
  }, {
    'name': [
      new NotEmpty('Please specify a name for the new spirit'),
      new Pattern(/^[a-zA-Z0-9_\.-]+$/, 'The name of the spirit can only contain letters, digits, dashes, full stop and underscores')
    ],
    'image': new NotEmpty('Please specify an image for the new spirit')    
  }),
  qvc.command('deploySpirit', function(command){
    return spirit(command.name).config()
    .then(deploy);
  }),
  qvc.command('stopSpirit', function(command){
    return spiritContainers(command.name).then(function(containers){
      return containers.filter(function(container){
        return container.state == 'running';
      });
    }).then(function(containers){
      return Promise.all(containers.map(function(container){
        return docker.getContainer(container.id).stop();
      }));
    });
  }),
  qvc.command('startSpirit', function(command){
    return spiritContainers(command.name).then(function(containers){
      return containers.filter(function(container){
        return container.state == 'stopped';
      })[0];
    }).then(function(container){
      return docker.getContainer(container.id).start();
    });
  }),
  qvc.command('restartSpirit', function(command){
    return spiritContainers(command.name).then(function(containers){
      return containers.filter(function(container){
        return container.state == 'running';
      })[0];
    }).then(function(container){
      return docker.getContainer(container.id).restart();
    });
  }),
  qvc.query('getListOfSpirits', function(query){
    return spirit.list();
  }),
  qvc.query('getVolumes', function(query){
    return spiritContainers(query.name).then(function(containers){
      return containers[0];
    }).then(function(container){
      return docker.getContainer(container.id);
    }).then(function(container){
      return container.inspect()
    }).then(function(config){
      var result = [];
      for(var volume in config.Config.Volumes){
        result.push(volume);
      }
      return result;
    });
  })
];
