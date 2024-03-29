import Router from "express-promise-router";
import samsara from "samsara-lib";
import nth from "../../private/nthLife.js";
import streamToString from "../../private/streamToString.js";

import ErrorView from "../errorView.js";
import IndexMenu from "../index/menu.js";
import layout from "../layout.js";
import SpiritMenu from "../spirit/menu.js";
import SpiritsMenu from "../spirits/menu.js";
import LivesView from "./index.js";
import LifeView from "./life.js";
import LivesMenu from "./menu.js";

const router = Router();
export default router;

router.get("/:name/lives", async function (req, res, next) {
  const name = req.params.name;
  const spirits = await samsara().spirits();
  const spirit = spirits.filter((s) => s.name == name)[0];

  if (spirit == undefined) {
    res.status(404);
    return res.send(
      layout(
        `${name} - Spirit`,
        <IndexMenu selected="spirits" />,
        <SpiritsMenu
          spirits={spirits}
          newSelected={false}
          selectedSpiritName={name}
        />,
        <ErrorView message="404 Not Found" />
      )
    );
  }

  const lives = spirit.lives;
  const list = lives.map((x) => x).reverse();
  res.send(
    layout(
      `Lives of ${name} - Spirit`,
      <IndexMenu selected="spirits" />,
      <SpiritsMenu
        spirits={spirits}
        newSelected={false}
        selectedSpiritName={name}
      />,
      <SpiritMenu name={name} selected="lives" />,
      <LivesMenu name={name} lives={list} />,
      <LivesView name={name} lives={list} />
    )
  );
});

router.get("/:name/life/latest", async function (req, res, next) {
  const latestLife = await samsara().spirit(req.params.name).latestLife;

  if (!latestLife) throw new Error("404");

  res.redirect(latestLife.life);
});

router.get("/:name/life/:life", async function (req, res, next) {
  const name = req.params.name;
  const life = req.params.life;
  const spirits = await samsara().spirits();
  const spirit = spirits.filter((s) => s.name == name)[0];

  if (spirit == undefined) {
    res.status(404);
    return res.send(
      layout(
        `${name} - Spirit`,
        <IndexMenu selected="spirits" />,
        <SpiritsMenu
          spirits={spirits}
          newSelected={false}
          selectedSpiritName={name}
        />,
        <ErrorView message="404 Not Found" />
      )
    );
  }

  const lives = spirit.lives;
  const list = lives.map((x) => x).reverse();
  const foundLife = lives.filter((l) => l.life == life)[0];

  if (foundLife == undefined) {
    res.status(404);
    return res.send(
      layout(
        `${name} - Spirit`,
        <IndexMenu selected="spirits" />,
        <SpiritsMenu
          spirits={spirits}
          newSelected={false}
          selectedSpiritName={name}
        />,
        <SpiritMenu name={name} selected="lives" />,
        <LivesMenu name={name} lives={list} selectedLife={life} />,
        <ErrorView message="404 Not Found" />
      )
    );
  }

  const state = foundLife.state;
  const currentLife = samsara().spirit(name).life(life);
  const container = await currentLife.container.catch((e) => null);

  res.send(
    layout(
      nth(life) + " life of " + name,
      <IndexMenu selected="spirits" />,
      <SpiritsMenu
        spirits={spirits}
        newSelected={false}
        selectedSpiritName={name}
      />,
      <SpiritMenu name={name} selected="lives" />,
      <LivesMenu name={name} lives={list} selectedLife={life} />,
      <LifeView
        name={name}
        life={life}
        logs={{
          lifeLog: {
            name: name,
            life: life,
          },
          name: name,
          life: life,
          json: await currentLife.inspect.then((json) =>
            json ? JSON.stringify(json, null, "  ") : ""
          ),
          config: await currentLife.containerConfig.catch((e) => ""),
          log: await streamToString(
            currentLife.containerLog(true, {
              stdout: true,
              stderr: true,
              tail: 50,
            })
          ),
          deploy: await currentLife.deployLog.catch((e) => ""),
        }}
        revive={{
          name: name,
          life: life,
          revivable: state == "exited",
        }}
        deploy={{
          name: name,
          life: life,
          isDeploying: spirit.state === "deploying",
        }}
      />
    )
  );
});

router.get("/:name/life/:life/logs/download", async function (req, res, next) {
  const name = req.params.name;
  const life = req.params.life;
  const logs = await samsara()
    .spirit(name)
    .life(life)
    .containerLog(false, { stdout: true, stderr: true });

  res.setHeader(
    "Content-disposition",
    `attachment;filename=${name}_v${life}.log`
  );
  logs.pipe(res);
});
