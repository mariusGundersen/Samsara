define(['knockout', 'deco/qvc'], function(ko, qvc){
  return function EditLabel(label, spiritName){
    var self = this;

    var oldKey = label && label.key;
    var oldValue = label && label.value;

    this.state = ko.observable('show');
    this.value = ko.observable(oldValue);
    this.key = ko.observable(oldKey);

    this.edit = function(){
      self.state('editing');
    };

    this.save = qvc.createCommand("setLabel", {
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