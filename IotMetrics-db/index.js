if (process.env.NODE_ENV !== "production") {
  require("longjohn");
}

("use strict");

const setupDatabase = require("./lib/db");
const setupAgentModel = require("./models/agent");
const setupMetricModel = require("./models/metric");
const setupAgent = require("./lib/agent");
const setupMetric = require("./lib/metric");
const defaults = require("defaults");

module.exports = async function (config) {
  config = defaults(config, {
    dialect: "sqlite",
    pool: {
      max: 10,
      min: 0,
      idle: 10000,
    },
    query: {
      raw: true,
    },
  });

  const sequelize = setupDatabase(config);
  const AgentModel = setupAgentModel(config);
  const MetricModel = setupMetricModel(config);

  AgentModel.hasMany(MetricModel);
  MetricModel.belongsTo(AgentModel);

  await sequelize.authenticate();

  if (config.setup) {
    await sequelize.sync({ force: true });
    //Si la base de datos paso por el setup, entonces la creamos.
    //El force true significa que si ya existe, la borra y la vuleve a crear.
  }

  const Agent = setupAgent(AgentModel);
  const Metric = setupMetric(MetricModel, AgentModel);

  return {
    Agent,
    Metric,
  };
};
