define(['knockout'], function(ko){
  return function LifeVM(model, when){
    var self = this;

    this.tab = ko.observable('logs');
  };
});