define(['EditEntryVM', 'knockout'], function(EditEntry, ko){
  return function MainInfoVM(model, when){
    var self = this;
    
    this.image = new EditEntry({value:model.image, command:'setSpiritImage', name:model.name});
    this.description = new EditEntry({value:model.description, command:'setSpiritDescription', name:model.name});
    this.url = new EditEntry({value:model.url, command:'setSpiritUrl', name:model.name});
  };
});