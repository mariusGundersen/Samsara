define(['knockout', 'deco/qvc'], function(ko, qvc){
  return function EditEntry(entry, spiritName){
    var self = this;
    
    var oldValue = entry && entry.value;
    
    this.editing = ko.observable(false);
    this.value = ko.observable(oldValue);
    
    this.edit = function(){
      self.editing(true);
    };
    
    this.save = qvc.createCommand(entry.command, {
      name: spiritName,
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