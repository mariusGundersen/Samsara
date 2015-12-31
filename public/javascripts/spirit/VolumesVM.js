define(['spirit/EditVolume', 'knockout', 'deco/qvc'], function(EditVolume, ko, qvc){
  return function VolumesVM(model, when){
    var self = this;

    this.volumes = ko.observableArray(model.volumes.map(function(volume){
      return new EditVolume(volume, model.name);
    }));

    this.creating = ko.observable(false);

    this.add = function(){
      self.create.clearValidationMessages();
      self.creating(true);
    };

    this.fresh = {
      containerPath: ko.observable(),
      hostPath: ko.observable(),
      readOnly: ko.observable()
    };

    this.remove = function(entry){
      qvc.createCommand('removeVolume', {
        name: model.name,
        containerPath: entry.containerPath()
      }).success(function(){
        self.volumes.remove(entry);
      })();
    };

    this.create = qvc.createCommand("addVolume", {
      name: model.name,
      containerPath: self.fresh.containerPath,
      hostPath: self.fresh.hostPath,
      readOnly: self.fresh.readOnly
    }).success(function(){
      self.volumes.push(new EditVolume({
        containerPath: self.fresh.containerPath(),
        hostPath: self.fresh.hostPath(),
        readOnly: self.fresh.readOnly()
      }, model.name));
      self.fresh.hostPath('');
      self.fresh.containerPath('');
      self.fresh.readOnly(false);
      self.creating(false);
    });

    this.cancelCreate = function(){
      self.fresh.hostPath('');
      self.fresh.containerPath('');
      self.fresh.readOnly(false);
      self.creating(false);
    };
  };
});