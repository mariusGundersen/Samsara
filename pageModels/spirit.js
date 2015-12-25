const makePageModel = require('./spirits');

module.exports = function(title, content, spirit, selected){
  return makePageModel(title, {
    content: content,
    menu: {
      spirit: spirit,
      status: selected == 'status',
      config: selected == 'config',
      lives: selected == 'lives',
      settings: selected == 'settings'
    }
  }, spirit);
};