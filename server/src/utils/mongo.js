import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

import { loadPlanetData } from "../models/Planet/planet.model.js";
import { loadLaunchData } from "../models/Launch/launch.model.js";

const MONGO_URL = process.env.MONGO_URL;

mongoose.connection.once("open", () =>
  console.log("MongoDB connection ready!")
);
mongoose.connection.on("error", (err) => console.error(err));

async function connectMongoDB() {
  await mongoose.connect(MONGO_URL);
  await loadPlanetData();
  await loadLaunchData();
}

async function disconnectMongoDB() {
  await mongoose.disconnect();
}

export { connectMongoDB, disconnectMongoDB };
