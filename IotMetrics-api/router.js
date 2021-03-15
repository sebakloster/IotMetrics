"use strict";

const debug = require("debug")("iotmetrics:api:routes");
const express = require("express");
const router = express.Router();
const customErrors = require("./utils/customErrors");

router.get("/agents", (req, res) => {
  debug("A request has come to /agents");
  res.send({});
});

router.get("/agents/:uuid", (req, res, next) => {
  const { uuid } = req.params;
  if (uuid !== "yyy") {
    return next(new customErrors.AgentNotFoundError(uuid));
  }
  res.send({ uuid });
});

router.get("/metrics/:uuid", (req, res) => {
  const { uuid } = req.params;
  res.send({ uuid });
});

router.get("/metrics/:uuid/:type", (req, res) => {
  const { uuid, type } = req.params;
  res.send({ uuid, type });
});

module.exports = router;
