define(['EditEntryVM', 'knockout', 'deco/qvc'], function(EditEntry, ko, qvc){
  return function AppInfoVM(model, when){
    var self = this;
    
    this.image = new EditEntry({value:model.image, command:'setAppImage', name:model.name});
    this.description = new EditEntry({value:model.description, command:'setAppDescription', name:model.name});
    this.url = new EditEntry({value:model.url, command:'setAppUrl', name:model.name});
    
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