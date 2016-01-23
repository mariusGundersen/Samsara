import EventSaga from 'event-saga';

export default function deploySaga(eventBus){
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

    eventBus.emit('spiritDeployStatus', {
      target: 'spirit/'+this.id+'/deploy',
      data:  this.data
    });
  });

  deploySaga.on('deployStatusRequest', function(data){
    eventBus.emit('spiritDeployStatus', {
      target: data.target,
      data: this.data
    });
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

    eventBus.emit('spiritDeployStatus', {
      target: 'spirit/'+this.id+'/deploy',
      data:  this.data
    });
  });

  deploySaga.on('spirit.deploy.message', function(data){
    if(data.message){
      if(typeof(data.message) == 'object'){
        if('progressDetail' in data.message){
          eventBus.emit('spiritDeployPullStatus', {
            target: 'spirit/'+this.id+'/deploy',
            data: {id: data.message.id, status: data.message.status, progressDetail: data.message.progressDetail}
          });
        }else if('status' in data.message){
          eventBus.emit('spiritDeployLog', {
            target: 'spirit/'+this.id+'/deploy',
            data: data.message.status
          });
        }
      }else{
        eventBus.emit('spiritDeployLog', {
            target: 'spirit/'+this.id+'/deploy',
            data: data.message
        });
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

    eventBus.emit('spiritDeployStatus', {
      target: 'spirit/'+this.id+'/deploy',
      data:  this.data
    });
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
