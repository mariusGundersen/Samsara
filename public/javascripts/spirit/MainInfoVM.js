define(['spirit/EditEntry', 'knockout'], function(EditEntry, ko){
  return function MainInfoVM(model, when){
    var self = this;
    
    this.image = new EditEntry({value:model.image, command:'setSpiritImage'}, model.name);
    this.description = new EditEntry({value:model.description, command:'setSpiritDescription'}, model.name);
    this.url = new EditEntry({value:model.url, command:'setSpiritUrl'}, model.name);
  };
});