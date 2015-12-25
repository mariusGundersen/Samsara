const co = require('co');
const semver = require('semver');

module.exports = co.wrap(function*(config, name, secret, image, tag, callback_url){
    
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
  console.log('tag', matchTag, tag);
  if(!semverSatisfies(matchTag, tag) || matchTag !== tag){
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
    && semver.gt(tag, currentTag);
}