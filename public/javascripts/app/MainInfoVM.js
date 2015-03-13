define(['EditEntryVM', 'knockout'], function(EditEntry, ko){
  return function AppInfoVM(model, when){
    var self = this;
    
    this.image = new EditEntry({value:model.image, command:'setAppImage', name:model.name});
    this.description = new EditEntry({value:model.description, command:'setAppDescription', name:model.name});
    this.url = new EditEntry({value:model.url, command:'setAppUrl', name:model.name});
  };
});