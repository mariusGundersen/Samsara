define(['knockout', 'containerEvents'], function(ko, container){
  return function MenuViewModel(model, when){
    var self = this;

    this.state = ko.observable(model.state);

    this.running = ko.pureComputed(function(){
      return self.state() == 'running';
    });
    this.stopped = ko.pureComputed(function(){
      return self.state() == 'exited';
    });
    this.paused = ko.pureComputed(function(){
      return self.state() == 'paused';
    });
    this.busy = ko.pureComputed(function(){
      return self.state() == 'restarting';
    });

    when(container.hasStarted, function(id){
      if(id == model.id){
        self.state('running');
      }
    });

    when(container.hasStopped, function(id){
      if(id == model.id){
        self.state('exited');
      }
    });

    when(container.isBusy, function(id){
      if(id == model.id){
        self.state('restarting');
      }
    });
  };
});