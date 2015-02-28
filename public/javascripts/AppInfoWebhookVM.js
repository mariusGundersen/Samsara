define(['knockout', 'deco/qvc'], function(ko, qvc){
  return function AppInfoWebhookVM(model, when){
    var self = this;
    
    this.fromIp = ko.observable(model.webhook['from-ip']);
    this.secret = ko.observable(model.webhook['secret']);
    
    this.state = ko.observable(model.webhook['enable'] ? 'enabled' : 'disabled');
    this.disabled = ko.computed(function(){
      return self.state() == 'disabled';
    });
    this.enabled = ko.computed(function(){
      return self.state() == 'enabled';
    });
    this.editing = ko.computed(function(){
      return self.state() == 'editing'; 
    });
    
    this.url = ko.computed(function(){
      return document.location.origin+'/deploy/'+model.name+'/'+self.secret();
    });
    
    this.edit = function(){
      self.state('editing');
    };
    
    this.enable = qvc.createCommand('enableWebhook', {
      name: model.name
    }).success(function(){
      self.state('editing');
    });
    
    this.disable = qvc.createCommand('disableWebhook', {
      name: model.name
    }).success(function(){
      self.state('disabled');
    });
    
    this.cancel = function(){
      self.state('enabled');
      self.fromIp(model.webhook['from-ip']);
      self.secret(model.webhook['secret']);
    };
    
    this.save = qvc.createCommand('saveWebhook', {
      name: model.name,
      fromIp: this.fromIp,
      secret: this.secret,
    }).success(function(){
      model.webhook['from-ip'] = self.fromIp();
      model.webhook['secret'] = self.secret();
      self.state('enabled');
    });
    
  };
});