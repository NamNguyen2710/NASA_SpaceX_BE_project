import express from "express";

import { httpGetDelay } from "./timer.controller.js";

const timerRouter = express.Router();

timerRouter.get("/", httpGetDelay);

export default timerRouter;
