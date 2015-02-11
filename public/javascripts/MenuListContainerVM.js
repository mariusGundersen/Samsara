define(['knockout', 'containerEvents'], function(ko, container){
  return function MenuViewModel(model, when){
    var self = this;
    
    this.running = ko.observable(model.state == 'running');
    
    when(container.hasStarted, function(id){
      if(id == model.id){
        self.running(true);
      }
    });
    
    when(container.hasStopped, function(id){
      if(id == model.id){
        self.running(false);
      }
    });
  };
});