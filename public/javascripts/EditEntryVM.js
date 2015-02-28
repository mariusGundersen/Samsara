define(['knockout', 'deco/qvc'], function(ko, qvc){
  return function EditEntryVM(model, when){
    var self = this;
    
    var oldValue = model && model.value;
    
    this.editing = ko.observable(false);
    this.value = ko.observable(oldValue);
    
    this.edit = function(){
      self.editing(true);
    };
    
    this.save = qvc.createCommand(model.command, {
      name: model.name,
      value: this.value
    }).success(function(){
      oldValue = self.value();
      self.editing(false);
    });
    
    this.cancel = function(){
      self.value(oldValue);
      self.editing(false);
    };
  };
});