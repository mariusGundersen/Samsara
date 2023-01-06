import { Router } from "express";
import qvc from "qvc";

import containerHandler from "./pages/containers/containersHandler.js";
import settingsHandler from "./pages/settings/settingsHandler.js";
import spiritConfigHandler from "./pages/spirit/spiritConfigHandler.js";
import spiritHandler from "./pages/spirit/spiritHandler.js";
import spiritSettingsHandler from "./pages/spirit/spiritSettingsHandler.js";

import container from "./pages/containers/containersRouter.js";
import index from "./pages/index/indexRouter.js";
import life from "./pages/life/lifeRouter.js";
import settings from "./pages/settings/settingsRouter.js";
import spirit from "./pages/spirit/spiritRouter.js";
import spirits from "./pages/spirits/spiritsRouter.js";

const router = Router();
export default router;

router.use(
  "/qvc",
  qvc(
    containerHandler,
    spiritHandler,
    spiritConfigHandler,
    spiritSettingsHandler,
    settingsHandler,
    {
      debug: process.env.NODE_ENV === "development",
      cacheConstraints: process.env.NODE_ENV === "development" ? false : 84600,
    }
  )
);

router.use("/container(s?)/", container);
router.use("/spirit(s?)/", spirits);
router.use("/spirit(s?)/", spirit);
router.use("/spirit(s?)/", life);
router.use("/setting(s?)/", settings);
router.use("/", index);

router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});
