define([
  'services/notifications',
  'knockout',
  'deco/qvc',
  'io'
], function(
  notifications,
  ko,
  qvc,
  io
){

  return function DeployProgressVM(model, when){
    var self = this;

    this.isDeploying = ko.observable(model.isDeploying);
    this.steps = ko.observableArray([]);
    this.success = ko.observable(true);
    this.showDeployProgress = ko.observable(model.isDeploying);
    this.pullStatus = ko.observableArray([]);
    this.deployLog = ko.observableArray([]);

    this.step = ko.pureComputed(function(){
      var activeStep = self.steps().filter(function(step){return step.isActive})[0];
      console.log("step:", activeStep ? activeStep.id : null);
      return activeStep ? activeStep.id : 'done';
    });

    this.isDeploying.subscribe(function(deploying){
      self.showDeployProgress(true);
      if(!deploying){
        var message = self.success() ? "Deployed "+model.name : "Failed to deploy "+model.name;
        notifications.notify(message);
      }
    });

    init: {
      var socket = io.connect();

      socket.on('connect', function(){
        socket.emit('subscribeToDeployStatus', model.name);
      });

      socket.on('spiritDeployStatus', function(data){
        console.log('status', data.plan);
        self.success(data.success);
        self.isDeploying(data.isDeploying);
        self.pullStatus([]);
        self.deployLog([]);
        self.steps(data.plan.map(function(step){
          return new Step(step);
        }));
      });

      socket.on('spiritDeployLog', function(data){
        console.log(data);
        self.deployLog.push(data);
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

  function Step(step){
    this.id = step.id;
    this.isActive = step.state == 'active';
    this.isDone = step.state == 'done';
    this.isPending = step.state == 'pending';
    this.isFail = step.state == 'failed';
    this.label = step.label;
  }
});