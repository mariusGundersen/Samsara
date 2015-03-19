module.exports = function(title, content, selected){
  return {
    title: title,
    content: content,
    menu: {
      constellations: selected == 'constellations',
      spirits: selected == 'spirits',
      containers: selected == 'containers',
      settings: selected == 'settings'
    }
  };
};