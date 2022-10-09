import express from "express";

import {
  httpCreateLaunch,
  httpGetAllLaunches,
  httpUpdateLaunch,
  httpAbortLaunch,
} from "./launch.controller.js";

const launchesRouter = express.Router();

launchesRouter.get("/", httpGetAllLaunches).post("/", httpCreateLaunch);
launchesRouter.put("/:id", httpUpdateLaunch);
launchesRouter.put("/:id/abort", httpAbortLaunch);

export default launchesRouter;
