define(['knockout', 'deco/qvc'], function(ko, qvc){
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
  };
});