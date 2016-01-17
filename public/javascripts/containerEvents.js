define(['deco/proclaimWhen'], function(events){
  return events.extend({
    'hasStopped': function(id){},
    'hasStarted': function(id){},
    'isBusy': function(id){}
  });
});