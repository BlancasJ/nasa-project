const {
  abortLaunchById,
  scheduleNewLaunch,
  existsLaunchWithId,
  getAllLaunches,
} = require("../../models/launches.model");
const { getPagination } = require("../../services/query");

const httpGetAllLaunches = async (req, res) => {
  const { skip, limit } = getPagination(req.query);
  const launches = await getAllLaunches({ skip, limit });
  return res.status(200).json(launches);
};

const httpAddNewLaunch = async (req, res) => {
  const values = req.body;
  if (
    !values.mission || !values.rocket ||
    !values.launchDate || !values.target) {
    return res.status(400).json({
      error: "Missing required launch property",
    });
  }

  const { launchDate, ...restLaunchData } = values;
  const formatedLaunchDate = new Date(launchDate);

  if (isNaN(formatedLaunchDate)) {
    return res.status(400).json({
      error: "Invalid launch date",
    });
  }

  const launch = {
    launchDate: formatedLaunchDate,
    ...restLaunchData,
  };

  await scheduleNewLaunch(launch);
  return res.status(201).json(launch);
};

const httpAbortLaunch = async (req, res) => {
  const launchId = Number(req.params.id);

  const existingLaunch = await existsLaunchWithId(launchId);
  if (!existingLaunch) {
    return res.status(404).json({
      error: "Launch not found",
    });
  }

  const aborted = await abortLaunchById(launchId);
  if (!aborted) {
    return res.status(404).json({
      error: "Launch not aborted",
    });
  }

  return res.status(200).json({ ok: true });
};

module.exports = {
  httpAbortLaunch,
  httpAddNewLaunch,
  httpGetAllLaunches,
};
