var eventBus = require('./eventBus');
var EventSaga = require('event-saga');

module.exports = function(io){
  io.on('connection', function(socket){
    socket.on('subscribeToDeployStatus', function(name){
      socket.join('spirit/'+name+'/deploy');
      eventBus.emit('deployStatusRequest', {id: name, socket: socket});
    });
  });
  
  var deploySaga = new EventSaga(eventBus);
  
  deploySaga.createOn('deployLockGained', function(data){
    this.data = {
      isDeploying: true,
      step: 'init',
      plan: data.plan.map(function(step){
        return {
          id: step,
          label: stepLabel(step, 'pending'),
          state: 'pending',
          failed: false
        }
      })
    };
    io.to('spirit/'+this.id+'/deploy').emit('spiritDeployStatus', this.data);
  });
  
  deploySaga.on('deployStatusRequest', function(data){
    data.socket.emit('spiritDeployStatus', this.data);
  });

  deploySaga.on('deployProcessStep', function(data){
    this.data.step = data.step;
    var activeIndex = this.data.plan.map(function(step){ return step.id; }).indexOf(data.step);
    var activeStep = this.data.plan[activeIndex];
    if(activeStep){
      activeStep.state = 'active';
      activeStep.label = stepLabel(activeStep.id, 'active');
    }
    
    var previousStep = this.data.plan[activeIndex - 1];
    if(previousStep){
      previousStep.state = 'done';
      previousStep.label = stepLabel(previousStep.id, 'done');
    }
    
    io.to('spirit/'+this.id+'/deploy').emit('spiritDeployStatus', this.data);
  });
  
  deploySaga.on('deployFailed', function(data){
    this.data.error = data.error;
    var activeIndex = this.data.plan.map(function(step){ return step.id; }).indexOf(this.data.step);
    var activeStep = this.data.plan[activeIndex];
    if(activeStep){
      activeStep.failed = true;
      activeStep.state = 'failed';
      activeStep.label = stepLabel(activeStep.id, 'done');
    }
  });
  
  deploySaga.on('deployProcessPullStepProgress', function(data){
    if(data && 'progress' in data && 'id' in data.progress){
      io.to('spirit/'+this.id+'/deploy').emit('spiritDeployPullStatus', data.progress);
    }
  });
  
  deploySaga.on('deployLockReleased', function(data){
    this.data.step = 'done';
    this.data.isDeploying = false;
    this.data.success = data.success;
    var activeIndex = this.data.plan.map(function(step){ return step.id; }).indexOf('done');
    var activeStep = this.data.plan[activeIndex];
    if(activeStep && activeStep.state == 'active'){
      activeStep.state = 'done';
    }
    
    io.to('spirit/'+this.id+'/deploy').emit('spiritDeployStatus', this.data);
    this.done();
  });
};

function stepLabel(step, state){
  return {
    'pull': ['Pull', 'Pulling', 'Pulled'],
    'create': ['Create', 'Creating', 'Created'],
    'start': ['Start', 'Starting', 'Started'],
    'stop': ['Stopp', 'Stopping', 'Stopped'],
    'cleanup': ['Cleanup', 'Cleaning', 'Cleaned'],
    'done': ['Done', 'Done', 'Done'],
  }[step][['pending', 'active', 'done'].indexOf(state)];
}

function stepState(step, currentIndex, index){
  return currentIndex < index ? 'pending' 
    : currentIndex == index && step != 'done' ? 'active' //done cannot be active, it can only be pending and done
    : 'done';
}