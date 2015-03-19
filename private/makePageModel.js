module.exports = function(title, content, selected){
  return {
    title: title,
    content: content,
    menu: {
      constellations: selected == 'constellations',
      spirits: selected == 'spirit',
      containers: selected == 'container',
      settings: selected == 'settings'
    }
  };
};