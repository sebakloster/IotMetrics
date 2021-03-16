"use strict";

const express = require("express");
const chalk = require("chalk");
const debug = require("debug")("iotmetrics:api");
const port = process.env.PORT || 3000;
const bodyparser = require("body-parser");

const app = express();

const apiRouter = require("./router");
app.use(bodyparser.json());
app.use("/api", apiRouter);

// Express error handler

app.use((err, req, res, next) => {
  debug(`Error: ${err.message}`);

  if (err.message.match(/not found/)) {
    return res.status(404).send({ error: err.message });
  }

  res.status(500).send({ error: err.message });
});

function handleFatalError(err) {
  console.error(`${chalk.red("[fatal error]")} ${err.message}`);
  console.error(err.stack);
  process.exit(1);
}

if (!module.parent) {
  process.on("uncaughtException", handleFatalError);
  process.on("unhandledRejection", handleFatalError);

  app.listen(port, () => {
    console.log(
      `${chalk.green("[iotMetrics-api]")} server listening on port ${port}`
    );
  });
}

module.exports = app;
