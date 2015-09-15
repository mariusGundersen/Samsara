define(['spirit/EditEntry', 'knockout', 'deco/qvc'], function(EditEntry, ko, qvc){
  return function MainInfoVM(model, when){
    var self = this;
    
    this.image = new EditEntry({value:model.image, command:'setSpiritImage'}, model.name);
    this.tag = new EditEntry({value:model.tag, command:'setSpiritTag'}, model.name);
    this.deploymentMethod = new EditEntry({value:model.deploymentMethod, command:'setSpiritDeploymentMethod'}, model.name);
    this.cleanupLimit = new EditEntry({value:model.cleanupLimit, command:'setSpiritCleanupLimit'}, model.name);
    this.description = new EditEntry({value:model.description, command:'setSpiritDescription'}, model.name);
    this.url = new EditEntry({value:model.url, command:'setSpiritUrl'}, model.name);
    
    this.query = ko.computed(this.image.value).extend({rateLimit:{timeout:500, method:'notifyWhenChangesStop'}});
    this.images = ko.observableArray();
    this.tags = ko.observableArray([{name:model.tag}]);

    this.imageHasFocus = ko.computed({
      read: function(){
        return self.image.editing() 
        || self.images()
        .some(function(image){
          return image.focus();
        });
      },
      write: function(v){}
    }).extend({rateLimit:{timeout:10}});    
    this.tagHasFocus = ko.observable(false);

    this.selectImage = function(image){
      self.image.value(image.name);
      self.image.save();
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
      image: ko.computed(this.image.value)
    }).result(this.tags);
    
    this.image.value.subscribe(function(){
      self.images([])
      self.search();
    });
    
    this.tag.editing.subscribe(function(v){
      if(v)
        self.searchTags();
    });
  };
});