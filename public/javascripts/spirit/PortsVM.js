define(['spirit/EditPort', 'knockout', 'deco/qvc'], function(EditPort, ko, qvc){
  return function PortsVM(model, when){
    var self = this;
    
    this.ports = ko.observableArray(toPortsList(model.ports).map(function(port){
      return new EditPort(port, model.name);
    }));
    
    this.creating = ko.observable(false);
    
    this.add = function(){
      self.create.clearValidationMessages();
      self.creating(true);
    };
    
    this.fresh = {
      hostPort: ko.observable(),
      containerPort: ko.observable(),
      hostIp: ko.observable()
    };
    
    this.remove = function(entry){
      qvc.createCommand('removePort', {
        name: model.name,
        hostPort: entry.hostPort()
      }).success(function(){
        self.ports.remove(entry);
      })();
    };
        
    this.create = qvc.createCommand("addPort", {
      name: model.name,
      hostPort: self.fresh.hostPort,
      containerPort: self.fresh.containerPort,
      hostIp: self.fresh.hostIp
    }).success(function(){
      self.ports.push(new EditPort({
        hostPort: self.fresh.hostPort(), 
        containerPort: self.fresh.containerPort(), 
        hostIp: self.fresh.hostIp()
      }, model.name));
      self.fresh.containerPort('');
      self.fresh.hostPort('');
      self.fresh.hostIp(false);
      self.creating(false);
    });
    
    this.cancelCreate = function(){
      self.fresh.containerPort('');
      self.fresh.hostPort('');
      self.fresh.hostIp(false);
      self.creating(false);
    };
  };
  
  
  function toPortsList(ports){
    var result = [];
    if(ports){
      for(var hostPort in ports){
        if(ports.hasOwnProperty(hostPort)){
          result.push({
            hostPort: hostPort, 
            containerPort: typeof(ports[hostPort]) == 'string' ? ports[hostPort] : ports[hostPort].containerPort || '', 
            hostIp: typeof(ports[hostPort]) == 'string' ? '' : ports[hostPort].hostIp || ''
          });
        }
      }
    }
    return result;
  }
});