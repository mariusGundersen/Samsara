define(['spirit/EditLabel', 'knockout', 'deco/qvc'], function(EditLabelVM, ko, qvc){
  return function LabelsVM(model, when){
    var self = this;

    this.labels = ko.observableArray(model.labels.map(function(envVar){
      return new EditLabelVM(envVar, model.name);
    }));

    this.creating = ko.observable(false);

    this.add = function(){
      self.create.clearValidationMessages();
      self.creating(true);
    };

    this.fresh = {
      key: ko.observable(),
      value: ko.observable()
    };

    this.remove = function(entry){
      qvc.createCommand('removeLabel', {
        name: model.name,
        key: entry.key()
      }).success(function(){
        self.labels.remove(entry);
      })();
    };

    this.create = qvc.createCommand("addLabel", {
      name: model.name,
      key: self.fresh.key,
      value: self.fresh.value
    }).success(function(){
      self.labels.push(new EditLabelVM({key: self.fresh.key(), value: self.fresh.value()}, model.name));
      self.fresh.value('');
      self.fresh.key('');
      self.creating(false);
    });

    this.cancelCreate = function(){
      self.fresh.value('');
      self.fresh.key('');
      self.creating(false);
    };
  };
});
