define(['knockout', 'deco/qvc'], function(ko, qvc){
  return function EditVolume(volume, spiritName){
    var self = this;
    
    var oldContainerPath = volume && volume.containerPath;
    var oldHostPath = volume && volume.hostPath;
    var oldReadOnly = volume && volume.readOnly;
    
    this.state = ko.observable('show');
    this.hostPath = ko.observable(oldHostPath);
    this.containerPath = ko.observable(oldContainerPath);
    this.readOnly = ko.observable(oldReadOnly);
    
    this.edit = function(){
      self.state('editing');
    };
    
    this.toggleReadOnly = function(){
      self.readOnly(!self.readOnly());
    };
    
    this.save = qvc.createCommand("setVolume", {
      name: spiritName,
      containerPath: this.containerPath,
      hostPath: this.hostPath,
      readOnly: this.readOnly
    }).success(function(){
      oldHostPath = self.hostPath();
      oldContainerPath = self.containerPath();
      oldReadOnly = self.readOnly();
      self.state('show');
    });
    
    this.cancel = function(){
      self.hostPath(oldHostPath);
      self.containerPath(oldContainerPath);
      self.readOnly(oldReadOnly);
      self.state('show');
    };
  };
});