define(['knockout', 'deco/qvc'], function(ko, qvc){

  return function ImageAndTagVM(model, when){
    var self = this;

    this.image = model.image;
    this.tag = model.tag;

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
    }).result(this.tags);

    this.query.subscribe(function(){
      self.images([])
      self.search();
      self.searchTags();
    });

    init: {
      if(self.image()){
        self.searchTags();
      }
    }
  };
});
