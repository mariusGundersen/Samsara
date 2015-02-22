define(['knockout', 'deco/qvc'], function(ko, qvc){
  
  return function NewAppVM(model, when){
    var self = this;
    
    this.name = ko.observable();
    this.image = ko.observable();
    
    this.create = qvc.createCommand("newApp", {
      name: this.name,
      image: this.image
    }).success(function(){
      document.location = '/app/'+self.name();
    });
      
  };
  
});