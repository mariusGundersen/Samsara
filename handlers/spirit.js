const qvc = require('qvc');
const NotEmpty = require('qvc/constraints/NotEmpty');
const Pattern = require('qvc/constraints/Pattern');
const co = require('co');
const spirit = require('../providers/spirit');
const deploy = require('../private/deploy');
const spiritContainers = require('../providers/spiritContainers');
const docker = require('../private/docker');
const dockerHub = require('../private/dockerHub');
const createSpirit = require('../private/createSpirit');

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
  qvc.query('searchImages', co.wrap(function*(query){
    const result = yield dockerHub.searchImages(query.term)
    
    return result.results;
  }), {
    'term': new NotEmpty('')
  }),
  qvc.query('searchImageTags', co.wrap(function*(query){
    try{
      return dockerHub.searchImageTags(query.image)
    }catch(error){
      return [];
    }
  }), {
    'image': new NotEmpty('')
  }),
  qvc.command('deploySpirit', co.wrap(function*(command){
    try{
      const config = yield spirit(command.name).config();
      return deploy(config);
    }catch(error){
      console.log(error.stack);
      return {success:false, valid:false, violations: [{fieldName:'', message:error.message}]};
    }
  })),
  qvc.command('stopSpirit', co.wrap(function*(command){
    const containers = yield spiritContainers(command.name);
    
    return Promise.all(containers.filter(function(container){
      return container.state == 'running';
    }).map(function(container){
      return docker.getContainer(container.id).stop();
    }));
  })),
  qvc.command('startSpirit', co.wrap(function*(command){
    const containers = yield spiritContainers(command.name);
    const container = containers.filter(function(container){
      return container.state == 'stopped';
    })[0];
    
    return docker.getContainer(container.id).start();
  })),
  qvc.command('restartSpirit', co.wrap(function*(command){
    const containers = yield spiritContainers(command.name);
    const container = containers.filter(function(container){
      return container.state == 'running';
    })[0];
    
    return docker.getContainer(container.id).restart();
  })),
  qvc.query('getListOfSpirits', function(query){
    return spirit.list();
  }),
  qvc.query('getVolumes', co.wrap(function*(query){
    try{
      const containers = yield spiritContainers(query.name);
      const container = docker.getContainer(containers[0].id);
      const config = yield container.inspect();

      return Object.keys(config.Config.Volumes);
    }catch(e){
      return []
    }
  }))
];
