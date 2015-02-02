define(['knockout'], function(ko){
  return function MenuViewModel(){
    var self = this;
    
    this.menuVisible = ko.observable(false);
    
    this.toggleMenuVisible = function(){
      self.menuVisible(!self.menuVisible());
    };
  };
});