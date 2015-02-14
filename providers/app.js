var fs = require('fs-promise');
var Promise = require('promise');

module.exports = function app(name){
  return {
    config: function(){
      return fs.readFile('config/apps/'+name+'/config.json')
      .then(JSON.parse);
    }
  };
};