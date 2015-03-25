define(['knockout', 'deco/qvc'], function(ko, qvc){
  return function EditPort(port, spiritName){
    var self = this;
    
    var oldHostPort = port && port.hostPort;
    var oldContainerPort = port && port.containerPort;
    var oldHostIp = port && port.hostIp;
    
    this.state = ko.observable('show');
    this.containerPort = ko.observable(oldContainerPort);
    this.hostPort = ko.observable(oldHostPort);
    this.hostIp = ko.observable(oldHostIp);
    
    this.edit = function(){
      self.state('editing');
    };
    
    this.save = qvc.createCommand("setPort", {
      name: spiritName,
      hostPort: this.hostPort,
      containerPort: this.containerPort,
      hostIp: this.hostIp
    }).success(function(){
      oldContainerPort = self.containerPort();
      oldHostPort = self.hostPort();
      oldHostIp = self.hostIp();
      self.state('show');
    });
    
    this.cancel = function(){
      self.containerPort(oldContainerPort);
      self.hostPort(oldHostPort);
      self.hostIp(oldHostIp);
      self.state('show');
    };
  };
});