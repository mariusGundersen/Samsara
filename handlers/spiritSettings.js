const qvc = require('qvc');
const samsara = require('samsara-lib');
const NotEmpty = require('qvc/constraints/NotEmpty');
const Pattern = require('qvc/constraints/Pattern');

module.exports = [
  qvc.command('setSpiritDescription', function (command) {
    return samsara().spirit(command.name).mutateSettings(settings => settings.description = command.value);
  }),
  qvc.command('setSpiritUrl', function (command) {
    return samsara().spirit(command.name).mutateSettings(settings => settings.url = command.value);
  }),
  qvc.command('setSpiritDeploymentMethod', function (command) {
    return samsara().spirit(command.name).mutateSettings(settings => settings.deploymentMethod = command.value);
  }),
  qvc.command('setSpiritCleanupLimit', function (command) {
    if (command.value >= 0) {
      return samsara().spirit(command.name).mutateSettings(settings => settings.cleanupLimit = command.value | 0);
    } else {
      return { success: false, valid: false, violations: [{ fieldName: 'value', message: 'Value must be positive' }] };
    }
  }),
  qvc.command('enableWebhook', function (command) {
    return samsara().spirit(command.name).mutateSettings(settings => settings.webhook.enable = true);
  }),
  qvc.command('disableWebhook', function (command) {
    return samsara().spirit(command.name).mutateSettings(settings => settings.webhook.enable = false);
  }),
  qvc.command('saveWebhook', function (command) {
    return samsara().spirit(command.name).mutateSettings(settings => {
      settings.webhook['secret'] = command.secret;
      settings.webhook['matchTag'] = command.matchTag;
    });
  }, {
    'secret': new NotEmpty('Specify a secret key to validate the webhook request'),
    'matchTag': new NotEmpty('Specify either an exact tag or a semver tag to match against')
  })
];