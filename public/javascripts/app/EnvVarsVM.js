define(['EditEnvVarVM', 'knockout', 'deco/qvc'], function(EditEnvVar, ko, qvc){
  return function AppEnvVarsVM(model, when){
    var self = this;
    
    this.envVars = ko.observableArray(toEnvList(model.env).map(function(envVar){
      return new EditEnvVar({key: envVar.key, value: envVar.value, name: model.name});
    }));
    
    this.add = function(){
      self.envVars.push(new EditEnvVar({key: '', value: '', name: model.name, editing: true}));
    };
    
    this.remove = function(entry){
      qvc.createCommand('removeEnvVar', {
        name: model.name,
        key: entry.key()
      }).success(function(){
        self.envVars.remove(entry);
      })();
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