define(function(){
  var supported = "Notification" in window;
  
  init: {
    if(supported){
      if(Notification.permission == "default"){
        Notification.requestPermission(function(){});
      }
    }
  }
  
  return {
    notify: function(title){
      if(!supported) return;
      if(Notification.permission != "granted") return;
      
      var notification = new Notification(title, {
      
      });
      setTimeout(notification.close.bind(notification), 5000);
    }
  };
});