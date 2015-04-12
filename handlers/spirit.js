var qvc = require('qvc');
var spirit = require('../providers/spirit');
var deploy = require('../private/deploy');
var spiritContainers = require('../providers/spiritContainers');
var docker = require('../private/docker');
var dockerHub = require('../private/dockerHub');
var createSpirit = require('../private/createSpirit');
var NotEmpty = require('qvc/constraints/NotEmpty');
var Pattern = require('qvc/constraints/Pattern');

module.exports = [
  qvc.command('newSpirit', function(command){
    console.log("newSpirit", command.name);
    return createSpirit(command.name, command.image, command.tag);
  }, {
    'name': [
      new NotEmpty('Please specify a name for the new spirit'),
      new Pattern(/^[a-zA-Z0-9_\.-]+$/, 'The name of the spirit can only contain letters, digits, dashes, full stop and underscores')
    ],
    'image': [
      new NotEmpty('Please specify an image for the new spirit'),
      new Pattern(/^[a-z0-9_\.\/-]+$/, 'The image name can only contain lower-case letters, digits, dashes, full stop and underscores')
    ],
    'tag': [
      new NotEmpty('Please specify an image tag to use')
    ]
  }),
  qvc.query('searchImages', function(query){
    return dockerHub.searchImages(query.term)
    .then(function(result){
      return result.results;
    });
  }, {
    'term': new NotEmpty('')
  }),
  qvc.query('searchImageTags', function(query){
    return dockerHub.searchImageTags(query.image)
    .catch(function(error){
      return [];
    });
  }, {
    'image': new NotEmpty('')
  }),
  qvc.command('deploySpirit', function(command){
    return spirit(command.name).config()
    .then(deploy)
    .catch(function(error){
      console.log(error.stack);
      return {success:false, valid:false, violations: [{fieldName:'', message:error.message}]};
    });
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
