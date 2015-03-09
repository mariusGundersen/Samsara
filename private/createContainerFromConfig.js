var extend = require('extend');

module.exports = function(name, config){
  return extend({
    Image: config.image, 
    name: name,
    Env: makeEnv(config.env)
  }, config.raw);
};

function makeEnv(env){
  var result = [];
  if(env){
    for(var name in env){
      if(env.hasOwnProperty(name)){
        result.push(name+"="+env[name]);
      }
    }
  }
  return result;
}