define(['knockout', 'deco/qvc'], function(ko, qvc){

  return function NewSpiritVM(model, when){
    var self = this;

    this.name = ko.observable();
    this.image = ko.observable();
    this.tag = ko.observable();

    this.create = qvc.createCommand("newSpirit", {
      name: this.name,
      image: this.image,
      tag: this.tag
    }).success(function(){
      document.location = '/spirit/'+self.name();
    });
  };
});
