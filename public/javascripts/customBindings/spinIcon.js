define(['knockout'], function(ko){
  
  var blacklist = [/^fa$/, /^fa-fw$/, /^fa-lg$/, /^fa-\dx$/, /^fa-fw$/, /^fa-li$/, /^fa-spin$/, /^fa-pulse$/, /^fa-border$/, /^fa-rotate-\d+$/, /^fa-flip-\w+$/];
  
  ko.bindingHandlers['spinIcon'] = {
    init: function(element, valueAccessor, allBindingsAccessor){
      
      var classList = Array.prototype.slice.call(element.classList, 0);
      var initial = classList.filter(function(item){
        return !blacklist.some(function(test){ return test.test(item); });
      })[0] || 'fa-question';
      
      var busy = valueAccessor();
      
      var rules = {
        'fa-spin': busy
      };
      
      if(initial !== 'fa-refresh'){
        rules['fa-refresh'] = busy;
        rules[initial] = ko.computed(function(){ return !ko.unwrap(busy); });
      }
      
      ko.applyBindingsToNode(element, {css: rules});
    }
  };
  
  return ko;
});