const co = require('co');
const semver = require('semver');
const samsara = require('samsara-lib');

module.exports = co.wrap(function*(name, secret, image, tag, callback_url){
  const spirit = samsara().spirit(name);
  const config = yield spirit.config;
  
  console.log('config', config);
  if(config.name !== name){
    throw 'wrong spirit name';
  }

  console.log('enabled', config.webhook.enable);
  if(!config.webhook.enable){
    throw 'webhook disabled';
  }

  console.log('secret', config.webhook.secret, secret);
  if(config.webhook.secret !== secret){
    throw 'wrong secret';
  }

  console.log('image', config.image, image);
  if(config.image !== image){
    throw 'wrong image';
  }

  const matchTag = config.webhook.matchTag || config.tag;
  const currentTag = yield getCurrentTag(spirit);
  console.log('tag', matchTag, tag, currentTag);
  if(!semverSatisfies(matchTag, tag, currentTag) || matchTag !== tag){
    throw 'wrong tag';
  }

  console.log('callback_url', callback_url);
  if(callback_url == null){
    throw 'missing callback_url';
  }

  return true;
});

function semverSatisfies(matchTag, tag, currentTag){
  return semver.validRange(matchTag)
    && semver.satisfies(tag, matchTag)
    && (!semver.valid(currentTag) || semver.gt(tag, currentTag));
}

const getCurrentTag = co.wrap(function*(spirit){
  const currentLife = (yield spirit.currentLife) || (yield spirit.latestLife);
  if(currentLife == null){
    return '0';
  }
  try{
    const config = yield currentLife.config;
    return config.tag;
  }catch(e){
    return '0';
  }
});
