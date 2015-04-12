define(['knockout', 'deco/qvc'], function(ko, qvc){
  return function ControlsVM(model, when){
    var self = this;
    
    this.state = ko.observable(model.state);
    
    this.stop = qvc.createCommand('stopSpirit', {
      name: model.name
    }).success(function(){
      self.state('stopped');
      document.location.reload();
    });
    
    this.start = qvc.createCommand('startSpirit', {
      name: model.name
    }).success(function(){
      self.state('running');
      document.location.reload();
    });
    
    this.restart = qvc.createCommand('restartSpirit', {
      name: model.name
    }).success(function(){
      self.state('running');
    });
    
    
    this.isBusy = ko.computed(function(){
      return self.stop.isBusy()
        || self.start.isBusy()
        || self.restart.isBusy();
    });
  };
});