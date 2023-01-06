import qvc from "qvc";
import NotEmpty from "qvc/constraints/NotEmpty.js";
import Pattern from "qvc/constraints/Pattern.js";
import samsara from "samsara-lib";
import { deploy, revive } from "../../private/deploy.js";
import { searchImages, searchImageTags } from "../../private/dockerHub.js";

export default [
  qvc.command(
    "newSpirit",
    async function (command) {
      await samsara().createSpirit(command.name, command.image, command.tag);
    },
    {
      name: [
        new NotEmpty("Please specify a name for the new spirit"),
        new Pattern(
          /^[a-zA-Z0-9_\.-]+$/,
          "The name of the spirit can only contain letters, digits, dashes, full stop and underscores"
        ),
      ],
      image: [
        new NotEmpty("Please specify an image for the new spirit"),
        new Pattern(
          /^[a-z0-9_\.\/-]+$/,
          "The image name can only contain lower-case letters, digits, dashes, full stop and underscores"
        ),
      ],
      tag: [new NotEmpty("Please specify an image tag to use")],
    }
  ),
  qvc.query(
    "searchImages",
    async function (query) {
      const result = await searchImages(query.term);

      return result.results;
    },
    {
      term: new NotEmpty(""),
    }
  ),
  qvc.query(
    "searchImageTags",
    async function (query) {
      try {
        return await searchImageTags(query.image);
      } catch (error) {
        return [];
      }
    },
    {
      image: new NotEmpty(""),
    }
  ),
  qvc.command("deploySpirit", async function (command) {
    try {
      deploy(command.name);
    } catch (error) {
      console.log(error.stack);
      return {
        success: false,
        valid: false,
        violations: [{ fieldName: "", message: error.message }],
      };
    }
  }),
  qvc.command(
    "reviveSpiritLife",
    async function (command) {
      try {
        console.log("reviving container");
        revive(command.name, command.life);
      } catch (e) {
        return {
          success: false,
          valid: false,
          violations: [{ fieldName: "", message: e.message }],
        };
      }
    },
    {
      name: NotEmpty(""),
      life: NotEmpty(""),
    }
  ),
  qvc.command("stopSpirit", async function (command) {
    const currentLife = await samsara().spirit(command.name).currentLife;

    if (currentLife && (await currentLife.status) == "running") {
      const container = await currentLife.container;
      return await container.stop();
    }
  }),
  qvc.command("startSpirit", async function (command) {
    const latestLife = await samsara().spirit(command.name).latestLife;

    if (latestLife && (await latestLife.status) == "stopped") {
      const container = await latestLife.container;
      return await container.start();
    }
  }),
  qvc.command("restartSpirit", async function (command) {
    const currentLife = await samsara().spirit(command.name).currentLife;

    if (currentLife) {
      const container = await currentLife.container;
      return await container.restart();
    }
  }),
  qvc.query("getListOfSpirits", async function (query) {
    const spirits = await samsara().spirits();
    return spirits.map((spirit) => spirit.name);
  }),
  qvc.query("getVolumes", async function (query) {
    try {
      const currentLife = await samsara().spirit(query.name).currentLife;
      if (currentLife == null) return [];
      const container = await currentLife.container;
      const inspect = await container.inspect();

      return Object.keys(inspect.Config.Volumes);
    } catch (e) {
      console.log(e.stack);
      return [];
    }
  }),
];
