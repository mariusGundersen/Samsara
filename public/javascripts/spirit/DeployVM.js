define([
  'services/notifications',
  'knockout', 
  'deco/qvc', 
  'io'
], function(
  notifications,
  ko, 
  qvc, 
  io){
  return function DeployVM(model, when){
    var self = this;
    
    this.isDeploying = ko.observable(model.isDeploying);
    this.step = ko.observable('idle');
    this.steps = ko.observableArray([]);
    this.success = ko.observable(true);
    this.done = ko.observable(false);
        
    this.deploy = qvc.createCommand('deploySpirit', {
      name: model.name
    }).canExecute(function(){
      return !self.isDeploying();
    });
    
    this.pullStatus = ko.observableArray([]);
    
    this.isBusy = ko.pureComputed(function(){
      return self.isDeploying() || self.deploy.isBusy();
    });
    
    this.done.subscribe(function(done){
      if(done){
        var message = self.success() ? "Deployed "+model.name : "Failed to deploy "+model.name; 
        notifications.notify(message);
      }
    })
    
    init:{
      var socket = io.connect();
    
      socket.on('connect', function(){
        socket.emit('subscribeToDeployStatus', model.name);
      });
    
      socket.on('spiritDeployStatus', function(data){
        self.isDeploying(data.isDeploying);
        self.step(data.step);
        self.pullStatus([]);
        self.success(data.success);
        self.done(data.step === 'done');
        self.steps(data.plan.map(function(step){
          return new Step(step, data.plan, self.step);
        }));
      });
    
      socket.on('spiritDeployPullStatus', function(data){
        var found = self.pullStatus().filter(function(image){
          return image.id == data.id
        })[0];
        if(found){
          found.status(data.status);
          found.progress(prettyProgress(data.progressDetail));
        }else{
          self.pullStatus.push({
            id: data.id,
            status: ko.observable(data.status),
            progress: ko.observable(prettyProgress(data.progressDetail))
          });
        }
      });
    }
  };
  
  function prettyProgress(progress){
    if(progress != null && typeof(progress) == 'object' && 'current' in progress && 'total' in progress){
      return (progress.current/progress.total*100).toFixed(0)+'% of '+(progress.total/1024/1024).toFixed(2) + 'MiB'
    }
    
    return null;
  }
  
  function Step(name, plan, step){
    var self = this;
    this.isActive = ko.pureComputed(function(){
      return name != 'done' && step() == name;
    });
    this.isDone = ko.pureComputed(function(){
      return step() == 'done' || plan.indexOf(name) < plan.indexOf(step());
    }),
    this.isPending = ko.pureComputed(function(){
      return plan.indexOf(name) > plan.indexOf(step());
    })
    this.label = ko.pureComputed(function(){
      if(self.isPending()){
        return {
          'pull': 'Pull',
          'create': 'Create',
          'start': 'Start',
          'stop': 'Stopp',
          'done': 'Done'
        }[name];
      }else if(self.isActive()){
        return {
          'pull': 'Pulling',
          'create': 'Creating',
          'start': 'Starting',
          'stop': 'Stopping',
          'done': 'Done'
        }[name];
      }else if(self.isDone()){
        return {
          'pull': 'Pulled',
          'create': 'Created',
          'start': 'Started',
          'stop': 'Stopped',
          'done': 'Done'
        }[name];
      }
    });
  }
});