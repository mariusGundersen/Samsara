define(['knockout', 'deco/qvc', 'io'], function(ko, qvc, io){
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
          found.progress(data.progress);
        }else{
          self.pullStatus.push({
            id: data.id,
            status: ko.observable(data.status),
            progress: ko.observable(data.progress)
          });
        }
      });
    }
  };
  
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