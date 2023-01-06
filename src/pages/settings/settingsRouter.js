import Router from "express-promise-router";
import samsara from "samsara-lib";

import IndexMenu from "../index/menu.js";
import layout from "../layout.js";
import SettingsView from "./index.js";

const router = Router();
export default router;

router.get("/", async function (req, res, next) {
  const users = await samsara().users();
  res.send(
    layout(
      "Settings",
      <IndexMenu selected="settings" />,
      <SettingsView
        users={users.map((user) => ({ username: user.username }))}
      />
    )
  );
});
