define(['EditUser', 'deco/qvc', 'knockout'], function(EditUser, qvc, ko){
  return function UsersVM(model, when){
  
    
    this.users = ko.observableArray(model.map(function(entry){
      return new EditUser(entry);
    }));
    
    
  };
});