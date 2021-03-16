"use strict";

const debug = require("debug")("iotmetrics:api:db");

module.exports = {
  db: {
    database: process.env.DB_NAME || "iotmetrics",
    username: process.env.DB_USER || "admin",
    password: process.env.DB_PASS || "admin1234",
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
    loggin: (message) => debug(message),
  },
};
