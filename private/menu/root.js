export default function(selected){
  return {
    constellations: selected == 'constellations',
    spirits: selected == 'spirits',
    containers: selected == 'containers',
    settings: selected == 'settings'
  };
};
