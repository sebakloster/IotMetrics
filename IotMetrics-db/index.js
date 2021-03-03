"use strict";

const setupDatabase = require("./lib/db");
const setupAgentModel = require("./models/agent");
const setupMetricModel = require("./models/metric");

module.exports = async function (config) {
  const sequelize = setupDatabase(config);
  const AgentModel = setupAgentModel(config);
  const MetricModel = setupMetricModel(config);

  AgentModel.hasMany(MetricModel);
  MetricModel.belongsTo(AgentModel);

  await sequelize.authenticate(); //Deberia capturar el error de esta promesa, no?

  const Agent = {};
  const Metric = {};

  return {
    Agent,
    Metric,
  };
};
