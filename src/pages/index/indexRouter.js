import Router from "express-promise-router";

import layout from "../layout.js";
import View from "./index.js";
import Menu from "./menu.js";

const router = Router();
export default router;

router.get("/", async function (req, res, next) {
  res.send(layout(null, <Menu />, <View />));
});
