define(['knockout', 'deco/qvc'], function(ko, qvc){
  return function DeployVM(model, when){
    var self = this;
    
    this.result = ko.observable();
    
    this.deploy = qvc.createCommand('deploySpirit', {
      name: model.name
    }).beforeExecute(function(){
      self.result('');
    }).success(function(){
      document.location += '/version/latest';
    }).error(function(){
      self.result('Deploy failed!');
    });
  };
});