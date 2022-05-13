const config = require("../config");
const mongoose = require("mongoose");

mongoose.connection.once("open", () => console.log("Mongo connection ready!"));
mongoose.connection.on("error", (err) => console.error(err));

const mongoConnect = async () => {
  await mongoose.connect(config.mongo.url);
};

const mongoDisconnect = async () => {
  await mongoose.disconnect();
};

module.exports = {
  mongoConnect,
  mongoDisconnect,
}
