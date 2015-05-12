define(['knockout', 'deco/qvc', 'containerEvents'], function(ko, qvc, container){
  
  return function(model, when){
    var self = this;
    
    this.tab = ko.observable('logs');
    
    this.running = ko.observable(model.running);
    
    this.stop = qvc.createCommand('stopContainer', {
      id: model.id
    }).success(function(){
      self.running(false);
      container.hasStopped(model.id);
    });
    
    this.start = qvc.createCommand('startContainer', {
      id: model.id
    }).success(function(){
      self.running(true);
      container.hasStarted(model.id);
    });
    
    this.restart = qvc.createCommand('restartContainer', {
      id: model.id
    }).success(function(){
      self.running(true);
      container.hasStarted(model.id);
    });
    
    this.remove = qvc.createCommand('removeContainer', {
      id: model.id
    }).success(function(){
      document.location = '/containers';
    });
    
    this.toSpirit = qvc.createCommand('newSpirit', {
      name: model.name,
      image: model.image
    }).success(function(){
      document.location = '/spirit/'+model.name;
    });
    
    this.isBusy = ko.computed(function(){
      return self.stop.isBusy()
        || self.start.isBusy()
        || self.restart.isBusy()
        || self.remove.isBusy()
        || self.toSpirit.isBusy();
    });
  };
});