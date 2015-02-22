define(['knockout', 'deco/qvc'], function(ko, qvc){
  return function AppInfoVM(model, when){
    var self = this;
    
    this.deploy = qvc.createCommand('deployApp', {
      name: model.name
    }).success(function(){
      document.location.reload();
    });
    
  };
});