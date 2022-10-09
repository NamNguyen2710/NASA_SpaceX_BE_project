import { getAllPlanets } from "../../models/Planet/planet.model.js";

export async function httoGetAllPlanets(req, res) {
  return res.status(200).json(await getAllPlanets());
}
