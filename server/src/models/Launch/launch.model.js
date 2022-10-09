import axios from "axios";

import launches from "./launch.mongo.js";
import planets from "../Planet/planet.mongo.js";

const DEFAULT_LAUNCH_ID = 100;
const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

async function loadLaunchData() {
  const res = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      select: [
        "name",
        "flight_number",
        "date_local",
        "success",
        "payloads",
        "success",
      ],
      pagination: false,
      populate: [
        { path: "rocket", select: { name: 1 } },
        { path: "payloads", select: { customers: 1 } },
      ],
    },
  });

  if (res.status !== 200) {
    console.log("Problem downloading launch data");
    throw new Error("Launch data download failed");
  }

  const launchData = res.data.docs.map((doc) => ({
    id: doc.flight_number,
    mission: doc.name,
    rocket: doc.rocket.name,
    launchDate: new Date(doc.date_local),
    customers: doc.payloads.flatMap((payload) => [...payload.customers]),
    success: doc.success,
  }));
  await Promise.all(launchData.map((launch) => updateLaunchWithId(launch)));
}

async function readAllLaunches(limit, skip) {
  return launches
    .find({}, { _id: 0, __v: 0 })
    .sort({ id: -1 })
    .skip(skip)
    .limit(limit);
}

async function readLaunchWithId(id) {
  return launches.findOne({ id });
}

async function readLatestLaunchId() {
  const latestLaunch = await launches.findOne().sort("-id");
  return latestLaunch?.id ?? DEFAULT_LAUNCH_ID;
}

async function updateLaunchWithId(newLaunch) {
  if (newLaunch.destination) {
    const planet = await planets.findOne({ keplerName: newLaunch.destination });
    if (!planet) throw new Error("No matching planet found");
  }

  const savedLaunch = await launches.findOneAndUpdate(
    { id: newLaunch.id },
    newLaunch,
    {
      upsert: true,
      returnDocument: "after",
      projection: { _id: 0, __v: 0 },
    }
  );

  return savedLaunch;
}

async function createLaunch(launch) {
  const latestLaunchId = await readLatestLaunchId();
  const newLaunch = Object.assign({}, launch, {
    id: latestLaunchId + 1,
    customers: ["ZTM", "NASA"],
    success: true,
  });

  const createdLaunch = await updateLaunchWithId(newLaunch);
  return createdLaunch;
}

export {
  loadLaunchData,
  readAllLaunches,
  readLaunchWithId,
  createLaunch,
  updateLaunchWithId,
};
