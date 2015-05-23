define(['knockout', 'deco/qvc', 'io'], function(ko, qvc, io){
  return function DeployVM(model, when){
    var self = this;
    
    this.isDeploying = ko.observable(model.isDeploying);
    this.step = ko.observable('ready');
    
    this.deploy = qvc.createCommand('deploySpirit', {
      name: model.name
    }).canExecute(function(){
      return !self.isDeploying();
    }).success(function(){
      document.location += '/version/latest';
    });
    
    this.isBusy = ko.computed(function(){
      return self.isDeploying() || self.deploy.isBusy();
    });
    
    init:{
      var socket = io.connect();
    
      socket.on('connect', function(){
        socket.emit('subscribeToDeployStatus', model.name);
      });
    
      socket.on('status', function(data){
        console.log('status', data);
        self.isDeploying(data.isDeploying);
        self.step(data.step);
      });
    }
  };
});