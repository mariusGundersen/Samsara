define(['knockout', 'deco/qvc'], function(ko, qvc){
  return function AppInfoVM(model, when){
    var self = this;
    
    this.result = ko.observable();
    
    this.deploy = qvc.createCommand('deployApp', {
      name: model.name
    }).beforeExecute(function(){
      self.result('');
    }).success(function(){
      document.location.reload();
    }).error(function(){
      self.result('Deploy failed!');
    });
  };
});