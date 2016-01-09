define(['knockout', 'deco/qvc'], function(ko, qvc){
  return function LifeVM(model, when){
    var self = this;

    this.revive = qvc.createCommand('reviveSpiritLife', {
      name: model.name,
      life: model.life
    });
  };
});