define(['knockout', 'deco/qvc'], function(ko, qvc){
  return function ControlsVM(model, when){
    var self = this;
    
    this.running = ko.observable(model.state == 'running');
    
    this.stop = qvc.createCommand('stopSpirit', {
      name: model.name
    }).success(function(){
      self.running(false);
      document.location.reload();
    });
    
    this.start = qvc.createCommand('startSpirit', {
      name: model.name
    }).success(function(){
      self.running(true);
      document.location.reload();
    });
    
    this.restart = qvc.createCommand('restartSpirit', {
      name: model.name
    }).success(function(){
      self.running(true);
    });
    
    
    this.isBusy = ko.computed(function(){
      return self.stop.isBusy()
        || self.start.isBusy()
        || self.restart.isBusy();
    });
  };
});