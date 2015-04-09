define(['knockout', 'deco/qvc'], function(ko, qvc){
  return function DeployVM(model, when){
    var self = this;
    
    this.deploy = qvc.createCommand('deploySpirit', {
      name: model.name
    }).success(function(){
      document.location += '/version/latest';
    });
  };
});