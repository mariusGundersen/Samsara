define(['knockout', 'deco/qvc'], function(ko, qvc){
  return function RestartVM(model, when){
    var self = this;

    var oldValue = model && model.restartPolicy;

    this.editing = ko.observable(false);
    this.value = ko.observable(oldValue);

    this.displayValue = ko.pureComputed(function(){
      switch(self.value()){
        case "": return "Don't restart";
        case "always": return "Always restart";
        case "unless-stopped": return "Restart unless stopped";
        case "on-failure": return "Restart on non-zero exit code";
      }
    });

    this.edit = function(){
      self.editing(true);
    };

    this.save = qvc.createCommand("setRestartPolicy", {
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