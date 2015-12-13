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

  deploySaga.createOn('spirit.deploy.start', function(data){
    this.data = {
      name: data.spirit,
      life: data.life,
      isDeploying: true,
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

  deploySaga.on('spirit.deploy.stage', function(data){
    var activeIndex = this.data.plan.map(step => step.state).indexOf('pending');
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

  deploySaga.on('spirit.deploy.message', function(data){
    if(data.message){
      if(typeof(data.message) == 'object'){
        if('progressDetail' in data.message){
          io.to('spirit/'+this.id+'/deploy').emit('spiritDeployPullStatus', {id: data.message.id, status: data.message.status, progressDetail: data.message.progressDetail});
        }else if('status' in data.message){
          io.to('spirit/'+this.id+'/deploy').emit('spiritDeployLog', data.message.status);
        }
      }else{
        io.to('spirit/'+this.id+'/deploy').emit('spiritDeployLog', data.message);
      }
    }
  });

  deploySaga.on('spirit.deploy.stop', function(data){
    this.data.isDeploying = false;
    this.data.success = !data.error;
    var activeIndex = this.data.plan.map(step => step.state).indexOf('active');
    var activeStep = this.data.plan[activeIndex];
    if(activeStep){
      activeStep.state = data.error ? 'failed' : 'done';
      activeStep.failed = !!data.error;
      activeStep.label = stepLabel(activeStep.id, 'done');
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
