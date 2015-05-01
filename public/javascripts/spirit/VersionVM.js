define(['knockout', 'deco/qvc'], function(ko, qvc){
  return function VersionVM(model, when){
    var self = this;
    
    this.tab = ko.observable('logs');
        
    this.rollback = qvc.createCommand('rollbackSpirit', {
      name: model.name,
      version: model.version
    }).success(function(){
      document.location.reload();
    });
  };
});