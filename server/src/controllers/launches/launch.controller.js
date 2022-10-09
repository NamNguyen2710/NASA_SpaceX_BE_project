import {
  readAllLaunches,
  readLaunchWithId,
  createLaunch,
  updateLaunchWithId,
} from "../../models/Launch/launch.model.js";
import { getPagination } from "../../utils/query.js";

async function httpGetAllLaunches(req, res) {
  const { skip, limit } = getPagination(req.query);
  const launches = await readAllLaunches(limit, skip);
  return res.status(200).json(launches);
}

async function httpCreateLaunch(req, res) {
  const launch = req.body;

  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.destination
  )
    return res.status(400).json({
      error: "Missing required launch property",
    });

  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate))
    return res.status(400).json({
      error: "Invalid launch date",
    });

  try {
    const newLaunch = await createLaunch(launch);
    return res.status(201).json(newLaunch);
  } catch (err) {
    if (err.message === "No matching planet found")
      return res.json(400).json({ error: err.message });

    return res.json(500).json({ err: err.message });
  }
}

async function httpUpdateLaunch(req, res) {
  const launchData = req.body;
  const id = Number(req.params.id);
  const launch = await readLaunchWithId(id);

  if (!launch)
    return res.status(404).json({
      error: "Launch not found",
    });

  if (launchData.launchDate) {
    launchData.launchDate = new Date(launchData.launchDate);
    if (isNaN(launchData.launchDate))
      return res.status(400).json({
        error: "Invalid launch date",
      });
  }

  const updatedLaunch = await updateLaunchWithId({ ...launchData, id });
  return res.status(200).json(updatedLaunch);
}

async function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.id);
  const launch = await readLaunchWithId(launchId);

  if (!launch)
    return res.status(404).json({
      error: "Launch not found",
    });

  launch.success = false;
  const abortedLaunch = await updateLaunchWithId(launch);
  return res.status(200).json(abortedLaunch);
}

export {
  httpGetAllLaunches,
  httpCreateLaunch,
  httpAbortLaunch,
  httpUpdateLaunch,
};
