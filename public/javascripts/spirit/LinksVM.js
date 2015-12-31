define(['spirit/EditLink', 'knockout', 'deco/qvc'], function(EditLink, ko, qvc){
  return function LinksVM(model, when){
    var self = this;

    this.links = ko.observableArray(model.links.map(function(link){
      return new EditLink(link, model.name);
    }));

    this.availableSpirits = ko.observableArray();
    this.creating = ko.observable(false);

    this.add = function(){
      self.getListOfSpirits();
      self.create.clearValidationMessages();
      self.creating(true);
    };

    this.fresh = {
      alias: ko.observable(),
      spirit: ko.observable()
    };

    this.remove = function(entry){
      qvc.createCommand('removeLink', {
        name: model.name,
        alias: entry.alias()
      }).success(function(){
        self.links.remove(entry);
      })();
    };

    this.create = qvc.createCommand("addLink", {
      name: model.name,
      alias: self.fresh.alias,
      spirit: self.fresh.spirit
    }).success(function(){
      self.links.push(new EditLink({
        alias: self.fresh.alias(),
        spirit: self.fresh.spirit()
      }, model.name));
      self.fresh.spirit('');
      self.fresh.alias('');
      self.creating(false);
    });

    this.getListOfSpirits = qvc.createQuery("getListOfSpirits")
    .result(function(links){
      self.availableSpirits(links.filter(function(link){
        return link != model.name;
      }));
    });

    this.cancelCreate = function(){
      self.fresh.spirit('');
      self.fresh.alias('');
      self.creating(false);
    };

    init:{
      self.getListOfSpirits();
    }
  };
});