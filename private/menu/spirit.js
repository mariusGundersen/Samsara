module.exports = function(name, selected){
  return {
    spirit: name,
    status: selected == 'status',
    settings: selected == 'settings',
    config: selected == 'config',
    lives: selected == 'lives'
  };
};
