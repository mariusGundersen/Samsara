define(['knockout', 'deco/qvc'], function(ko, qvc){
  
  return function(model, when){
    var self = this;
    
    this.running = ko.observable(model.state == 'running');
    
    this.stop = qvc.createCommand('stopApp', {
      name: model.name
    }).success(function(){
      self.running(false);
      document.location.reload();
    });
    
    this.start = qvc.createCommand('startApp', {
      name: model.name
    }).success(function(){
      self.running(true);
      document.location.reload();
    });
    
    this.restart = qvc.createCommand('restartApp', {
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