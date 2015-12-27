const makePageModel = require('./spirit');
const samsara = require('samsara-lib');
const co = require('co');

module.exports = co.wrap(function*(title, content, spirit, selectedLife){
  const lives = yield samsara().spirit(spirit).lives;
  
  const menu = yield Promise.all(lives.reverse().map(co.wrap(function *(life){
    const status = yield life.status;
    const uptime = yield life.uptime;
    return {
      spirit: spirit,
      life: life.life,
      selected: life.life == selectedLife,
      uptime: uptime,
      status: status
    };
  })));

  return makePageModel(title, {
    menu: menu,
    content:content
  }, spirit, 'lives');
});