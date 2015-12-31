define(['spirit/EditVolumesFrom', 'knockout', 'deco/qvc'], function(EditVolumesFrom, ko, qvc){
  return function VolumesFromVM(model, when){
    var self = this;

    this.volumesFromList = ko.observableArray(model.volumesFrom.map(function(volumesFrom){
      return new EditVolumesFrom(volumesFrom, model.name);
    }));

    this.availableSpirits = ko.observableArray();
    this.freshAvailableSpirits = ko.computed(function(){
      return self.availableSpirits().filter(function(spirit){
        return !self.volumesFromList().some(function(entry){
          return entry.fromSpirit() == spirit;
        })
      });
    });
    this.creating = ko.observable(false);

    this.add = function(){
      self.getListOfSpirits();
      self.create.clearValidationMessages();
      self.creating(true);
    };

    this.fresh = {
      fromSpirit: ko.observable(),
      readOnly: ko.observable(false)
    };

    this.remove = function(entry){
      qvc.createCommand('removeVolumesFrom', {
        name: model.name,
        fromSpirit: entry.fromSpirit()
      }).success(function(){
        self.volumesFromList.remove(entry);
      })();
    };

    this.create = qvc.createCommand("addVolumesFrom", {
      name: model.name,
      fromSpirit: self.fresh.fromSpirit,
      readOnly: self.fresh.readOnly
    }).success(function(){
      self.volumesFromList.push(new EditVolumesFrom({
        spirit: self.fresh.fromSpirit(),
        readOnly: self.fresh.readOnly()
      }, model.name));
      self.fresh.fromSpirit('');
      self.fresh.readOnly(false);
      self.creating(false);
    });

    this.getListOfSpirits = qvc.createQuery("getListOfSpirits")
    .result(function(spirits){
      self.availableSpirits(spirits.filter(function(spirit){
        return spirit != model.name;
      }));
    });

    this.cancelCreate = function(){
      self.fresh.fromSpirit('');
      self.fresh.readOnly(false);
      self.creating(false);
    };

    init:{
      self.getListOfSpirits();
    }
  };
});