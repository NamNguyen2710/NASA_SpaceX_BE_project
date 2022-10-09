import { parse } from "csv-parse";
import fs from "fs";

import planets from "./planet.mongo.js";

function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    Number(planet["koi_insol"]) >= 0.36 &&
    Number(planet["koi_insol"]) <= 1.11 &&
    Number(planet["koi_prad"]) <= 1.6
  );
}

function loadPlanetData() {
  return new Promise((res, rej) => {
    fs.createReadStream(
      new URL("../../../data/kepler_data.csv", import.meta.url)
    )
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", async (data) => {
        if (isHabitablePlanet(data)) await savePlanet(data);
      })
      .on("error", (e) => rej(e))
      .on("end", async () => {
        const habitablePlanets = await getAllPlanets();
        console.log(`${habitablePlanets.length} habitable planets found!`);
        res(habitablePlanets);
      });
  });
}

async function getAllPlanets() {
  return planets.find({}, { _id: 0, __v: 0 });
}

async function savePlanet(data) {
  try {
    await planets.updateOne(
      { keplerName: data.kepler_name },
      { keplerName: data.kepler_name },
      { upsert: true }
    );
  } catch (err) {
    console.error(`Could not save planet ${err}`);
  }
}

export { loadPlanetData, getAllPlanets, savePlanet };
