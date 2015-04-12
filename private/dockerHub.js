const request = require('request-promise');
const co = require('co');

module.exports = {
  searchImages: co.wrap(function*(term){
    const result = yield request('https://registry.hub.docker.com/v1/search?q='+encodeURIComponent(term)+'&n=5');
    return JSON.parse(result);
  }),
  searchImageTags: co.wrap(function*(term){
    const result = yield request('https://registry.hub.docker.com/v1/repositories/'+term+'/tags');
    return JSON.parse(result);
  })
};