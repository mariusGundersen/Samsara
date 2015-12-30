define(['spirit/EditEntry', 'knockout', 'deco/qvc'], function(EditEntry, ko, qvc){
  return function MainInfoVM(model, when){
    this.deploymentMethod = new EditEntry({value:model.deploymentMethod, command:'setSpiritDeploymentMethod'}, model.name);
    this.cleanupLimit = new EditEntry({value:model.cleanupLimit, command:'setSpiritCleanupLimit'}, model.name);
    this.description = new EditEntry({value:model.description, command:'setSpiritDescription'}, model.name);
    this.url = new EditEntry({value:model.url, command:'setSpiritUrl'}, model.name);
  };
});