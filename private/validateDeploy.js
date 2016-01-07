const co = require('co');
const semver = require('semver');
const samsara = require('samsara-lib');

module.exports = co.wrap(function*(name, secret, image, tag, callback_url){
  const spirit = samsara().spirit(name);
  const config = yield spirit.containerConfig;
  const settings = yield spirit.settings;

  console.log('config', config);
  if(settings.name !== name){
    throw 'wrong spirit name';
  }

  console.log('enabled', settings.webhook.enable);
  if(!config.webhook.enable){
    throw 'webhook disabled';
  }

  console.log('secret', settings.webhook.secret, secret);
  if(settings.webhook.secret !== secret){
    throw 'wrong secret';
  }

  console.log('image', config.image, image);
  if(config.image !== image){
    throw 'wrong image';
  }

  const matchTag = settings.webhook.matchTag || config.tag;
  const currentTag = yield getCurrentTag(spirit);
  console.log('tag', matchTag, tag, currentTag);
  if(semverFailsToSatisfy(matchTag, tag, currentTag) && matchTag !== tag){
    throw 'wrong tag';
  }

  console.log('callback_url', callback_url);
  if(callback_url == null){
    throw 'missing callback_url';
  }

  return true;
});

function semverFailsToSatisfy(matchTag, tag, currentTag){
  if(!semver.validRange(matchTag)){
    return true;
  }
  if(!semver.valid(tag)){
    return true;
  }
  if(!semver.satisfies(tag, matchTag)){
    return true;
  }
  if(semver.valid(currentTag) && semver.lte(tag, currentTag)){
    return true;
  }
  return false;
}

const getCurrentTag = co.wrap(function*(spirit){
  const currentLife = (yield spirit.currentLife) || (yield spirit.latestLife);
  if(currentLife == null){
    return '0';
  }
  try{
    const config = yield currentLife.containerConfig;
    return config.tag;
  }catch(e){
    return '0';
  }
});
