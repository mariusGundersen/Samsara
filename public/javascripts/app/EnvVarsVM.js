define(['EditEnvVarVM', 'knockout', 'deco/qvc'], function(EditEnvVar, ko, qvc){
  return function AppEnvVarsVM(model, when){
    var self = this;
    
    this.envVars = ko.observableArray(toEnvList(model.env).map(function(envVar){
      return new EditEnvVar({key: envVar.key, value: envVar.value, name: model.name});
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
      self.envVars.push(new EditEnvVar({key: self.fresh.key(), value: self.fresh.value(), name: model.name}));
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
  
  
  function toEnvList(env){
    var result = [];
    if(env){
      for(var name in env){
        if(env.hasOwnProperty(name)){
          result.push({key: name, value: env[name]});
        }
      }
    }
    return result;
  }
});