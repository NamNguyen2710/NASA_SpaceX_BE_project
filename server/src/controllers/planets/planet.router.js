import express from "express";

import * as planetControllers from "./planet.controller.js";

const planetsRouter = express.Router();

planetsRouter.get("/", planetControllers.httoGetAllPlanets);

export default planetsRouter;
