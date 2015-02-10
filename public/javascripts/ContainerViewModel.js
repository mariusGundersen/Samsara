define(['knockout', 'deco/qvc'], function(ko, qvc){
  
  return function(model, when){
    var self = this;
    
    this.running = ko.observable(model.State.Running);
    
    this.stop = qvc.createCommand('stopContainer', {
      id: model.Id
    }).success(function(){
      self.running(false);
    });
    
    this.start = qvc.createCommand('startContainer', {
      id: model.Id
    }).success(function(){
      self.running(true);
    });
    
    this.restart = qvc.createCommand('restartContainer', {
      id: model.Id
    }).success(function(){
      self.running(true);
    });
    
  };
  
});