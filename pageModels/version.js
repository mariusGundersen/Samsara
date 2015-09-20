const makePageModel = require('./spirit');
const samsara = require('samsara-lib');
const co = require('co');

module.exports = co.wrap(function*(title, content, spirit, version){
  const lives = yield samsara().spirit(spirit).lives;
  
  const menu = yield Promise.all(lives.reverse().map(co.wrap(function *(life){
    //const container = yield life.container;
    const status = yield life.status;
    const uptime = '';
    return {
      spirit: spirit,
      version: life.life,
      selected: life.life == version,
      uptime: uptime,
      status: status
    };
  })));

  return makePageModel(title, {
    menu: menu,
    content:content
  }, spirit, 'versions');
});