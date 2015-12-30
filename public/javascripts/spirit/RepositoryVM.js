define(['knockout', 'deco/qvc'], function(ko, qvc){
  return function MainInfoVM(model, when){
    var self = this;

    this.image = ko.observable(model.image);
    this.tag = ko.observable(model.tag);

    this.editing = ko.observable(false);

    this.edit = function(){
      self.editing(true);
    };

    this.cancel = function(){
      self.editing(false);
      self.image(model.image);
      self.tag(model.tag);
    };

    this.save = qvc.createCommand('setSpiritImageAndTag', {
      name: model.name,
      image: self.image,
      tag: self.tag
    }).success(function(){
      model.image = self.image();
      model.tag = self.tag();
      self.editing(false);
    });
  };
});