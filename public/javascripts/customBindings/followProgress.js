define(['knockout'], function(ko){

  ko.bindingHandlers['followProgress'] = {
    init: function(element){
      ko.utils.domData.set(element, 'sticky', true);
      ko.utils.registerEventHandler(element, 'scroll', function(){
        var isSticky = element.scrollHeight - element.offsetHeight <= element.scrollTop;
        ko.utils.domData.set(element, 'sticky', isSticky);
      });
    },
    update: function(element, valueAccessor){
      var value = valueAccessor();
      ko.unwrap(value);
      var isSticky = ko.utils.domData.get(element, 'sticky');
      if(isSticky){
        requestAnimationFrame(function(){
          element.scrollTop = element.scrollHeight;
        });
      }
    }
  };

  return ko;
});
