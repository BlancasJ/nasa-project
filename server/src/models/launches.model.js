const axios = require("axios");

const launches = require("./launches.mongo");
const planets = require("./planets.mongo");

const DEFAULT_FLIGHT_NUMBER = 100;
const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

const getAllLaunches = async ({ skip, limit }) => {
  return await launches
    .find({}, { "_id": 0, "__v": 0 })
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit);
};

const getLatestFlightNumber = async () => {
  const latestLaunch = await launches
    .findOne()
    .sort("-flightNumber");

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestLaunch.flightNumber;
};

const findLaunch = async (filter) => {
  return await launches.findOne(filter);
};

const existsLaunchWithId = async (id) => {
  return await findLaunch({ flightNumber: id });
};

const saveLaunch = async (launch) => {
  await launches.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    },
  );
};

const scheduleNewLaunch = async (launch) => {
  const lastFlightNumber = await getLatestFlightNumber();
  const newFlightNumber = lastFlightNumber + 1;
  console.log("newFlightNumber: ", newFlightNumber);

  const newLaunch = {
    flightNumber: newFlightNumber,
    customers: ["Zero To Master", "NASA"],
    upcoming: true,
    success: true,
    ...launch,
  };

  const planet = await planets.find({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error("No matching planet found");
  }

  await saveLaunch(newLaunch);
};

const abortLaunchById = async (id) => {
  const aborted = await launches.updateOne(
    {
      flightNumber: id,
    },
    {
      upcoming: false,
      success: false,
    }
  );

  return aborted.modifiedCount === 1;
};

const populateLaunches = async () => {
  console.log("Downloading launches data...");
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1
          }
        },
        {
          path: "payloads",
          select: {
            customers: 1
          }
        }
      ]
    }
  });

  if (response.status !== 200) {
    console.log("Problem downloading launch data");
    throw new Error("Launch data download failed");
  }

  const { data: { docs: launchDocs } } = response;
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc["payloads"];

    const customers = payloads.flatMap(payload => {
      return payload["customers"];
    });

    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      launchDate: launchDoc["date_local"],
      upcoming: launchDoc["upcoming"],
      success: launchDoc["success"],
      customers,
    }

    console.log(`${launch.flightNumber} ${launch.mission}`);
    await saveLaunch(launch);
  }
}

const loadLaunchesData = async () => {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });

  if (firstLaunch) {
    console.log("Launch data already loaded");
    return;
  }

  await populateLaunches();
};

module.exports = {
  abortLaunchById,
  existsLaunchWithId,
  getAllLaunches,
  loadLaunchesData,
  scheduleNewLaunch,
}
