define(['knockout', 'deco/qvc', 'io'], function(ko, qvc, io){
  return function DeployVM(model, when){
    var self = this;
    
    this.deploy = qvc.createCommand('deploySpirit', {
      name: model.name
    }).success(function(){
      document.location += '/version/latest';
    });
    
    this.isBusy = ko.computed(function(){
      return model.isDeploying || self.deploy.isBusy();
    });
    
    init:{
      var socket = io.connect();
      socket.on('test', function(data){
        alert(data);
      });
    }
  };
});