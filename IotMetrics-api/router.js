"use strict";

const debug = require("debug")("iotmetrics:api:routes");
const express = require("express");
const customErrors = require("./utils/customErrors");
const db = require("iotmetrics-db");
const config = require("./config");
const router = express.Router();

let services, Agent, Metric;

router.use("*", async (req, res, next) => {
  if (!services) {
    debug("Connecting to database");
    try {
      services = await db(config.db);
    } catch (error) {
      return next(error);
    }
    Agent = services.Agent;
    Metric = services.Metric;
  }
  next();
});

router.get("/agents", async (req, res, next) => {
  debug("A request has come to /agents");

  let agents = [];
  try {
    agents = await Agent.findConnected();
  } catch (error) {
    return next(error);
  }

  res.send(agents);
});

router.get("/agent/:uuid", async (req, res, next) => {
  const { uuid } = req.params;

  debug(`request to /agent/${uuid}`);

  let agent;

  try {
    agent = await Agent.findByUuid(uuid);
  } catch (error) {
    return next(error);
  }

  if (!agent) {
    return next(new customErrors.AgentNotFoundError(uuid));
  }
  res.send(agent);
});

router.get("/metrics/:uuid", async (req, res, next) => {
  const { uuid } = req.params;

  debug(`Request to /metrics/${uuid}`);

  let metrics = [];

  try {
    metrics = await Metric.findByAgentUuid(uuid);
  } catch (error) {
    return next(error);
  }

  if (!metrics || metrics.length == 0) {
    return next(new customErrors.MetricsNotFoundError(uuid));
  }

  res.send(metrics);
});

router.get("/metrics/:uuid/:type", async (req, res, next) => {
  const { uuid, type } = req.params;

  debug(`request to /metrics/${uuid}/${type}`);

  let metrics = [];

  try {
    metrics = await Metric.findByTypeAgentUuid(type, uuid);
  } catch (error) {
    return next(error);
  }

  if (!metrics || metrics.length == 0) {
    return next(new customErrors.MetricsNotFoundError(uuid, type));
  }

  res.send(metrics);
});

module.exports = router;
