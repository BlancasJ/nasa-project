const { parse } = require("csv-parse");
const fs = require("fs");
const path = require("path");

const planets = require("./planets.mongo");

const isHabitablePlanet = (planet) => {
  const {
    koi_disposition,
    koi_insol,
    koi_prad,
  } = planet;

  const isPlanetConfirmed = koi_disposition === "CONFIRMED";
  const correctTemperature = koi_insol > 0.36 && koi_insol < 1.11;
  const correctRadious = koi_prad < 1.6;

  return isPlanetConfirmed && correctTemperature && correctRadious;
};

const getAllPlanets = async () => {
  return await planets.find({}, {
    "_id": 0, "__v": 0,
  });
}

const savePlanets = async (planet) => {
  try {
    await planets.updateOne(
      {
        keplerName: planet.kepler_name,
      },
      {
        keplerName: planet.kepler_name,
      },
      {
        upsert: true,
      },
    );
  } catch (error) {
    console.error(`Could not save planet ${error}`);
  }
};


const loadPlanetsData = () => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, "..", "..", "data", "kepler_data.csv"))
      .pipe(parse({
        comment: "#",
        columns: true,
      }))
      .on("data", async (data) => {
        if (isHabitablePlanet(data)) {
          await savePlanets(data);
        }
      })
      .on("error", (error) => {
        console.log(error);
        reject(error);
      })
      .on("end", async () => {
        const planets = await getAllPlanets();
        const countPlanetsFound = planets.length;
        console.log(`${countPlanetsFound} habitable planets found!`);
        resolve();
      });
  });
};

module.exports = {
  loadPlanetsData,
  getAllPlanets,
};
