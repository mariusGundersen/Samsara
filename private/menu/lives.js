export default function(spirit, lives, selectedLife){
  return lives.map(life => ({
    spirit: spirit,
    life: life.life,
    selected: life.life === selectedLife,
    uptime: life.uptime,
    state: life.state,
    status: getStatus(life.state)
  })).reverse();
};

function getStatus(state){
  switch(state){
    case 'running': return 'active';
    case 'restarting': return 'active';
    default: return 'dead';
  }
}
