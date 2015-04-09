define(['knockout', 'deco/qvc'], function(ko, qvc){
  
  return function NewSpiritVM(model, when){
    var self = this;
    
    this.name = ko.observable();
    this.image = ko.observable();
    this.tag = ko.observable();
    
    this.query = ko.computed(this.image).extend({rateLimit:{timeout:500, method:'notifyWhenChangesStop'}});
    this.images = ko.observableArray();
    this.tags = ko.observableArray();

    this.inputHasFocus = ko.observable(false);
    this.imageHasFocus = ko.computed({
      read: function(){
        return self.inputHasFocus() 
        || self.images()
        .some(function(image){
          return image.focus();
        });
      },
      write: function(v){
        self.inputHasFocus(v);
      }
    }).extend({rateLimit:{timeout:10}});
    this.tagHasFocus = ko.observable(false);

    this.selectImage = function(image){
      self.image(image.name);
      self.tagHasFocus(true);
    };

    this.search = qvc.createQuery("searchImages", {
      term: this.query
    }).result(function(images){
      self.images(images.map(function(image){
        return {
          name: image.name,
          focus: ko.observable(false)
        };
      }));
    });

    this.searchTags = qvc.createQuery("searchImageTags", {
      image: ko.computed(this.query)
    }).result(this.tags)
    .success(function(){
      self.tag('latest');
    });

    this.query.subscribe(function(){
      self.images([])
      self.search();
      self.searchTags();
    });

    this.create = qvc.createCommand("newSpirit", {
      name: this.name,
      image: this.image,
      tag: this.tag
    }).success(function(){
      document.location = '/spirit/'+self.name();
    });
  };
});
