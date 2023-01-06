import qvc from "qvc";
import NotEmpty from "qvc/constraints/NotEmpty.js";
import samsara from "samsara-lib";

export default [
  qvc.command("setSpiritDescription", async function (command) {
    await samsara()
      .spirit(command.name)
      .mutateSettings((settings) => (settings.description = command.value));
  }),
  qvc.command("setSpiritUrl", async function (command) {
    await samsara()
      .spirit(command.name)
      .mutateSettings((settings) => (settings.url = command.value));
  }),
  qvc.command("setSpiritDeploymentMethod", async function (command) {
    await samsara()
      .spirit(command.name)
      .mutateSettings(
        (settings) => (settings.deploymentMethod = command.value)
      );
  }),
  qvc.command("setSpiritCleanupLimit", async function (command) {
    if (command.value >= 0) {
      await samsara()
        .spirit(command.name)
        .mutateSettings(
          (settings) => (settings.cleanupLimit = command.value | 0)
        );
    } else {
      return {
        success: false,
        valid: false,
        violations: [{ fieldName: "value", message: "Value must be positive" }],
      };
    }
  }),
  qvc.command("enableWebhook", async function (command) {
    await samsara()
      .spirit(command.name)
      .mutateSettings((settings) => (settings.webhook.enable = true));
  }),
  qvc.command("disableWebhook", async function (command) {
    await samsara()
      .spirit(command.name)
      .mutateSettings((settings) => (settings.webhook.enable = false));
  }),
  qvc.command(
    "saveWebhook",
    async function (command) {
      await samsara()
        .spirit(command.name)
        .mutateSettings((settings) => {
          settings.webhook["secret"] = command.secret;
          settings.webhook["matchTag"] = command.matchTag;
        });
    },
    {
      secret: new NotEmpty(
        "Specify a secret key to validate the webhook request"
      ),
      matchTag: new NotEmpty(
        "Specify either an exact tag or a semver tag to match against"
      ),
    }
  ),
];
