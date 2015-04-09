var request = require('request-promise');

module.exports = {
  searchImages: function(term){
    return request('https://registry.hub.docker.com/v1/search?q='+encodeURIComponent(term)+'&n=5')
    .then(function(result){
      return JSON.parse(result);
    });
  },
  searchImageTags: function(term){
    return request('https://registry.hub.docker.com/v1/repositories/'+term+'/tags')
    .then(function(result){
      return JSON.parse(result);
    });
  }
};