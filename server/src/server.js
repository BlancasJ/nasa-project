const http = require("http");

const app = require("./app");
const config = require("./config");
const { mongoConnect } = require("./services/mongo");
const { loadPlanetsData } = require("./models/planets.model");
const { loadLaunchesData } = require("./models/launches.model");

const server = http.createServer(app);

const startServer = async () => {
  await mongoConnect();
  await loadPlanetsData();
  await loadLaunchesData();

  server.listen(config.port, () => {
    console.log(`Listening on port ${config.port}`);
  });
};

startServer();
