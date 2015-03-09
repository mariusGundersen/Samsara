module.exports = function(title, content, selected){
  return {
    title: title,
    content: content,
    menu: {
      constellations: selected == 'constellations',
      spirits: selected == 'app',
      containers: selected == 'container',
      settings: selected == 'settings'
    }
  };
};