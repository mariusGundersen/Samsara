const cachebust = new Date().toISOString().replace(/\D/g, '');

module.exports = function(title, content, selected){
  return {
    title: title,
    content: content,
    cachebust: cachebust,
    menu: {
      constellations: selected == 'constellations',
      spirits: selected == 'spirits',
      containers: selected == 'containers',
      settings: selected == 'settings'
    }
  };
};