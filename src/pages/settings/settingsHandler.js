import qvc from "qvc";
import NotEmpty from "qvc/constraints/NotEmpty.js";
import samsara from "samsara-lib";

export default [
  qvc.command(
    "setAuthentication",
    async function (command) {
      const users = await samsara().users();
      const found = users.filter(
        (user) => user.username === command.username
      )[0];

      if (!found)
        return {
          success: false,
          valid: false,
          violations: [{ fieldName: "", message: "Unknown user" }],
        };

      found.password = command.password;
      await found.save();
    },
    {
      username: new NotEmpty(
        "Please specify the username to change password for"
      ),
      password: new NotEmpty("Please specify a new password"),
    }
  ),
];
