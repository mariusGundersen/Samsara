define(['knockout', 'deco/qvc'], function(ko, qvc){
  return function EditVolumesFrom(volume, spiritName){
    var self = this;
    
    var oldFromSpirit = volume && volume.spirit;
    var oldReadOnly = volume && volume.readOnly;
    
    this.state = ko.observable('show');
    this.fromSpirit = ko.observable(oldFromSpirit);
    this.readOnly = ko.observable(oldReadOnly);
    
    this.volumes = ko.observable('');
    
    this.edit = function(){
      self.state('editing');
    };
    
    this.toggleReadOnly = function(){
      self.readOnly(!self.readOnly());
    };
    
    this.save = qvc.createCommand("setVolumesFrom", {
      name: spiritName,
      fromSpirit: this.fromSpirit,
      oldFromSpirit: oldFromSpirit,
      readOnly: this.readOnly
    }).success(function(){
      oldFromSpirit = self.fromSpirit();
      oldReadOnly = self.readOnly();
      self.state('show');
    });
    
    this.getVolumes = qvc.createQuery('getVolumes', {
      name: ko.computed(this.fromSpirit)
    }).result(function(volumes){
      self.volumes(volumes.join(', '));
    });
    
    this.cancel = function(){
      self.fromSpirit(oldFromSpirit);
      self.readOnly(oldReadOnly);
      self.state('show');
    };
    
    init:{
      this.getVolumes();
      this.fromSpirit.subscribe(function(){
        self.getVolumes();
      });
    }
  };
});