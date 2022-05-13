require("dotenv").config();

const mongo = {
  url: process.env.MONGO_PATH,
};

const port = process.env.PORT ?? 8000;

module.exports = {
  mongo,
  port,
};
