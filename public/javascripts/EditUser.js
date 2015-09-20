define(['knockout', 'deco/qvc'], function(ko, qvc){
  return function EditUser(user){
    var self = this;
    
    this.username = user.username;
    
    this.state = ko.observable('show');
    this.password = ko.observable('');
    
    this.edit = function(){
      self.state('editing');
    };
    
    this.save = qvc.createCommand("setAuthentication", {
      username: ko.observable(user.username),
      password: this.password
    }).success(function(){
      self.password('');
      self.state('show');
    });
    
    this.cancel = function(){
      self.password('');
      self.state('show');
    };
  };
});