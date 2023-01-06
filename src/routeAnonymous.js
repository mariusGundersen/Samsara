import express, { Router } from "express";
import deploy from "./pages/deploy/deployRouter.js";
import login from "./pages/login/loginRouter.js";

const router = Router();
export default router;

router.use("/deploy", deploy);

router.use("/login", login);

router.use(
  express.static("./dist/public", {
    etag: false,
    lastModified: false,
    maxAge: process.env.NODE_ENV === "production" ? "1d" : 0,
  })
);
