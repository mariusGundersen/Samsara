define(['knockout'], function(ko){
  
  ko.bindingHandlers['ifSelected'] = {
    init: function(element, valueAccessor, allBindings, viewModel, context){
      
      var value = valueAccessor();
      var name = allBindings.get('name');
      
      return ko.bindingHandlers['if'].init(element, function(){
        return ko.unwrap(value) === ko.unwrap(name);
      }, allBindings, viewModel, context);
    },
    update: function(element, valueAccessor, allBindings){
      
      var value = valueAccessor();
      var name = allBindings.get('name');
      
      ko.bindingHandlers['visible'].update(element, function(){
        return ko.unwrap(value) === ko.unwrap(name);
      });
    }
  };
  
  ko.bindingHandlers['selectable'] = {
    init: function(element, valueAccessor, allBindings){
      
      var value = valueAccessor();
      var name = allBindings.get('name');
      var unselectable = allBindings.get('unselectable');
      
      ko.utils.registerEventHandler(element, 'click', function(){
        if(ko.isWritableObservable(value)){
          if(value() === ko.unwrap(name) && ko.unwrap(unselectable)){
            value(undefined);
          }else{
            value(ko.unwrap(name));
          }
        }
      });
    },
    update: function(element, valueAccessor, allBindings){
      
      var value = valueAccessor();
      var name = allBindings.get('name');
            
      ko.bindingHandlers['attr'].update(element, function(){
        return {
          selected: ko.unwrap(value) === ko.unwrap(name)
        }
      });
    }
  };
  
  return ko;
});
