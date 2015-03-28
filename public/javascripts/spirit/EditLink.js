define(['knockout', 'deco/qvc'], function(ko, qvc){
  return function EditLink(link, spiritName){
    var self = this;
    
    var oldAlias = link && link.alias;
    var oldSpirit = link && link.spirit;
    
    this.state = ko.observable('show');
    this.spirit = ko.observable(oldSpirit);
    this.alias = ko.observable(oldAlias);
    
    this.edit = function(){
      self.state('editing');
    };
    
    this.save = qvc.createCommand("setLink", {
      name: spiritName,
      alias: this.alias,
      spirit: this.spirit
    }).success(function(){
      oldSpirit = self.spirit();
      oldAlias = self.alias();
      self.state('show');
    });
    
    this.cancel = function(){
      self.spirit(oldSpirit);
      self.alias(oldAlias);
      self.state('show');
    };
  };
});