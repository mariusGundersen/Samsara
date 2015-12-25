define(['knockout', 'deco/qvc'], function(ko, qvc){
  return function ControlsVM(model, when){
    var self = this;
    
    this.canStart = ko.observable(model.canStart);
    this.canRestart = ko.observable(model.canRestart);
    this.canStop = ko.observable(model.canStop);
    
    this.stop = qvc.createCommand('stopSpirit', {
      name: model.name
    }).success(function(){
      self.canStart(true);
      self.canRestart(false);
      self.canStop(false);
      document.location.reload();
    });
    
    this.start = qvc.createCommand('startSpirit', {
      name: model.name
    }).success(function(){
      self.canStart(false);
      self.canRestart(true);
      self.canStop(true);
      document.location.reload();
    });
    
    this.restart = qvc.createCommand('restartSpirit', {
      name: model.name
    }).success(function(){
      self.canStart(false);
      self.canRestart(true);
      self.canStop(true);
    });
    
    
    this.isBusy = ko.computed(function(){
      return self.stop.isBusy()
        || self.start.isBusy()
        || self.restart.isBusy();
    });
  };
});