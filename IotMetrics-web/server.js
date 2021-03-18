"use strict";

const debug = require("debug")("iotmetrics:web");
const chalk = require("chalk");
const path = require("path");

const port = process.env.PORT || 8080;
const express = require("express");
const socketio = require("socket.io");
const IotMetricsAgent = require("iotmetrics-agent");
const app = express();
const server = require("http").createServer(app);

const io = socketio(server);
const agent = new IotMetricsAgent();

app.use(express.static(path.join(__dirname, "public")));

//Socket io / websockets

io.on("connect", (socket) => {
  debug(`Connected ${socket.id}`);

  agent.on("agent/message", (payload) => {
    socket.emit("agent/message", payload);
  });
  agent.on("agent/connected", (payload) => {
    socket.emit("agent/connected", payload);
  });
  agent.on("agent/disconnected", (payload) => {
    socket.emit("agent/disconnected", payload);
  });
});

function handleFatalError(err) {
  console.error(`${chalk.red("[fatal error]")} ${err.message}`);
  console.error(err.stack);
  process.exit(1);
}

process.on("uncaughtException", handleFatalError);
process.on("unhandledRejection", handleFatalError);

server.listen(port, () => {
  console.log(
    `${chalk.green("[IotMetrics-web]")} server listening on port: ${port}`
  );
  agent.connect();
});
