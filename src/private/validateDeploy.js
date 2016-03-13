import semver from 'semver';
import samsara from 'samsara-lib';

export default async function validateDeploy(name, secret, image, tag, callback_url){
  const spirit = samsara().spirit(name);
  const config = await spirit.containerConfig;
  const settings = await spirit.settings;

  console.log('name', settings.name, name);
  if(settings.name !== name){
    throw 'wrong spirit name';
  }

  console.log('enabled', settings.webhook.enable);
  if(!settings.webhook.enable){
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
  const currentTag = await getCurrentTag(spirit);
  console.log('tag', matchTag, tag, currentTag);
  if(semverFailsToSatisfy(matchTag, tag, currentTag) && matchTag !== tag){
    throw 'wrong tag';
  }

  console.log('callback_url', callback_url);
  if(callback_url == null){
    throw 'missing callback_url';
  }

  return true;
};

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

async function getCurrentTag(spirit){
  const currentLife = (await spirit.currentLife) || (await spirit.latestLife);
  if(currentLife == null){
    return '0';
  }
  try{
    const config = await currentLife.containerConfig;
    return config.tag;
  }catch(e){
    return '0';
  }
};
