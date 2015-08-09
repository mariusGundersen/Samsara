const qvc = require('qvc');
const NotEmpty = require('qvc/constraints/NotEmpty');
const Pattern = require('qvc/constraints/Pattern');
const co = require('co');
const samsara = require('samsara-lib');
const deploy = require('../private/deploy');
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
      return yield dockerHub.searchImageTags(query.image)
    }catch(error){
      return [];
    }
  }), {
    'image': new NotEmpty('')
  }),
  qvc.command('deploySpirit', co.wrap(function*(command){
    try{
      const config = yield samsara().spirit(command.name).config;
      return yield deploy.deploy(config);
    }catch(error){
      console.log(error.stack);
      return {success:false, valid:false, violations: [{fieldName:'', message:error.message}]};
    }
  })),
  qvc.command('rollbackSpirit', co.wrap(function*(command){
    try{
      console.log('rolling back container');
      const config = yield samsara().spirit(command.name).config;
      return yield deploy.rollback(config, command.version);
    }catch(e){
      return {success:false, valid:false, violations: [{fieldName:'', message:e.message}]};
    }
  },{
    'name': NotEmpty(''),
    'version': NotEmpty('')
  })),
  qvc.command('stopSpirit', co.wrap(function*(command){
    const currentLife = yield samsara().spirit(command.name).currentLife;
    
    if(currentLife && (yield currentLife.status) == 'running'){
      const container = yield currentLife.container;
      return yield container.stop();
    }
  })),
  qvc.command('startSpirit', co.wrap(function*(command){
    const latestLife = yield samsara().spirit(command.name).latestLife;
    
    if(latestLife && (yield latestLife.status) == 'stopped'){
      const container = yield latestLife.container;
      return yield container.start();
    }
  })),
  qvc.command('restartSpirit', co.wrap(function*(command){
    const currentLife = yield samsara().spirit(command.name).currentLife;
    
    if(currentLife && (yield currentLife.status) == 'running'){
      const container = yield currentLife.container;
      return yield container.restart();
    }
  })),
  qvc.query('getListOfSpirits', co.wrap(function*(query){
    const spirits = yield samsara().spirits();
    return spirits.map(spirit => spirit.name);
  })),
  qvc.query('getVolumes', co.wrap(function*(query){
    try{
      console.log(query.name);
      const currentLife = yield samsara().spirit(query.name).currentLife;
      const container = yield currentLife.container;
      const inspect = yield container.inspect();

      return Object.keys(inspect.Config.Volumes);
    }catch(e){
      console.log(e.stack);
      return []
    }
  }))
];
