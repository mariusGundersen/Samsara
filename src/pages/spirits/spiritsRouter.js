import Router from "express-promise-router";
import samsara from "samsara-lib";

import IndexMenu from "../index/menu.js";
import layout from "../layout.js";
import SpiritsView from "./index.js";
import SpiritsMenu from "./menu.js";
import NewView from "./new.js";

const router = Router();
export default router;

router.get("/", async function (req, res, next) {
  const spirits = await samsara().spirits();
  res.send(
    layout(
      "Spirits",
      <IndexMenu selected="spirits" />,
      <SpiritsMenu spirits={spirits} newSelected={false} />,
      <SpiritsView spirits={spirits} />
    )
  );
});

router.get("/new", async function (req, res, next) {
  const spirits = await samsara().spirits();
  res.send(
    layout(
      "New Spirit",
      <IndexMenu selected="spirits" />,
      <SpiritsMenu spirits={spirits} newSelected={true} />,
      <NewView />
    )
  );
});
