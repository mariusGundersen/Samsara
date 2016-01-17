const makePageModel = require('./spirit');
const samsara = require('samsara-lib');
const co = require('co');

module.exports = co.wrap(function*(title, content, spirit, selectedLife){
  const spirits = yield samsara().spirits();
  const lives = spirits.filter(s => s.name === spirit)[0].lives;

  const menu = lives.reverse().map(life => ({
    spirit: spirit,
    life: life.life,
    selected: life.life == selectedLife,
    uptime: life.uptime,
    state: life.state,
    status: getStatus(life.state)
  }));

  return makePageModel(title, {
    menu: menu,
    content:content
  }, spirit, 'lives');
});

function getStatus(state){
  switch(state){
    case 'running': return 'active';
    case 'restarting': return 'active';
    default: return 'dead';
  }
}