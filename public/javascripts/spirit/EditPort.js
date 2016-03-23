define(['knockout', 'deco/qvc'], function(ko, qvc){
  return function EditPort(port, spiritName){
    var self = this;

    var oldHostPort = port && port.hostPort;
    var oldContainerPort = port && port.containerPort;
    var oldHostIp = port && port.hostIp;
    var oldTcp = port && port.tcp===true;
    var oldUdp = port && port.udp===true;

    this.state = ko.observable('show');
    this.containerPort = ko.observable(oldContainerPort);
    this.hostPort = ko.observable(oldHostPort);
    this.hostIp = ko.observable(oldHostIp);
    this.tcp = ko.observable(oldTcp);
    this.udp = ko.observable(oldUdp);

    this.edit = function(){
      self.state('editing');
    };

    this.save = qvc.createCommand("setPort", {
      name: spiritName,
      hostPort: this.hostPort,
      containerPort: this.containerPort,
      hostIp: this.hostIp,
      tcp: this.tcp,
      udp: this.udp
    }).success(function(){
      oldContainerPort = self.containerPort();
      oldHostPort = self.hostPort();
      oldHostIp = self.hostIp();
      oldTcp = self.tcp();
      oldUdp = self.udp();
      self.state('show');
    });

    this.cancel = function(){
      self.containerPort(oldContainerPort);
      self.hostPort(oldHostPort);
      self.hostIp(oldHostIp);
      self.tcp(oldTcp);
      self.udp(oldUdp);
      self.state('show');
    };

    this.toggleTcp = function(){
      self.tcp(self.tcp() === false);
    };

    this.toggleUdp = function(){
      self.udp(self.udp() === false);
    };
  };
});