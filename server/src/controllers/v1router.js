import express from "express";

import planetsRouter from "./planets/planet.router.js";
import launchesRouter from "./launches/launch.router.js";
import timerRouter from "./timer/timer.router.js";

const v1router = express.Router();

v1router.use("/planets", planetsRouter);
v1router.use("/launches", launchesRouter);
v1router.use("/timer", timerRouter);

export default v1router;
