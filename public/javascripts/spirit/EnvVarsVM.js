define(['spirit/EditEnvVar', 'knockout', 'deco/qvc'], function(EditEnvVar, ko, qvc){
  return function EnvVarsVM(model, when){
    var self = this;

    this.envVars = ko.observableArray(model.environment.map(function(envVar){
      return new EditEnvVar(envVar, model.name);
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
      qvc.createCommand('removeEnvVar', {
        name: model.name,
        key: entry.key()
      }).success(function(){
        self.envVars.remove(entry);
      })();
    };

    this.create = qvc.createCommand("addEnvVar", {
      name: model.name,
      key: self.fresh.key,
      value: self.fresh.value
    }).success(function(){
      self.envVars.push(new EditEnvVar({key: self.fresh.key(), value: self.fresh.value()}, model.name));
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
