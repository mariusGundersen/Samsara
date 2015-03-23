define(['knockout', 'deco/qvc'], function(ko, qvc){
  return function EditEnvVar(envVar, spiritName){
    var self = this;
    
    var oldKey = envVar && envVar.key;
    var oldValue = envVar && envVar.value;
    
    this.state = ko.observable('show');
    this.value = ko.observable(oldValue);
    this.key = ko.observable(oldKey);
    
    this.edit = function(){
      self.state('editing');
    };
    
    this.save = qvc.createCommand("setEnvVar", {
      name: spiritName,
      key: this.key,
      value: this.value
    }).success(function(){
      oldValue = self.value();
      oldKey = self.key();
      self.state('show');
    });
    
    this.cancel = function(){
      self.value(oldValue);
      self.key(oldKey);
      self.state('show');
    };
  };
});