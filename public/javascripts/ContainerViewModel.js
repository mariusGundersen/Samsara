define(['knockout', 'deco/qvc', 'containerEvents'], function(ko, qvc, container){
  
  return function(model, when){
    var self = this;
    
    this.running = ko.observable(model.State.Running);
    
    this.stop = qvc.createCommand('stopContainer', {
      id: model.Id
    }).success(function(){
      self.running(false);
      container.hasStopped(model.Id);
    });
    
    this.start = qvc.createCommand('startContainer', {
      id: model.Id
    }).success(function(){
      self.running(true);
      container.hasStarted(model.Id);
    });
    
    this.restart = qvc.createCommand('restartContainer', {
      id: model.Id
    }).success(function(){
      self.running(true);
      container.hasStarted(model.Id);
    });
    
    this.remove = qvc.createCommand('removeContainer', {
      id: model.Id
    }).success(function(){
      document.location = '/';
    });
  };
});