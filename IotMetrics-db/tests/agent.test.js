"use strict";

const test = require("ava");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

const agentFixtures = require("./fixtures/agent");
const agent = require("./fixtures/agent");

let config = {
  logging: function () {},
};

let MetricStub = {
  belongsTo: sinon.spy(),
};
let single = Object.assign({}, agentFixtures.single);
let id = 1;
let uuid = "yyy-yyy-yyy";
let AgentStub = null;

let db = null;
let sandbox = null;

let uuidArgs = {
  where: {
    uuid,
  },
};

test.beforeEach(async () => {
  sandbox = sinon.createSandbox();
  AgentStub = {
    hasMany: sandbox.spy(),
  };

  //Model findOne stub
  AgentStub.findOne = sandbox.stub();
  AgentStub.findOne
    .withArgs(uuidArgs)
    .returns(Promise.resolve(agentFixtures.byUuid(uuid)));

  //Model update Stub

  AgentStub.update = sandbox.stub();
  AgentStub.update.withArgs(single, uuidArgs).returns(Promise.resolve(single));

  //Model findbyid Stub

  AgentStub.findById = sandbox.stub();
  AgentStub.findById.withArgs(id).returns(Promise.resolve(agent.byId(id)));

  const setupDatabase = proxyquire("../", {
    "./models/agent": () => AgentStub,
    "./models/metric": () => MetricStub,
  });
  db = await setupDatabase(config);
});

test.afterEach(() => {
  sandbox && sandbox.restore();
});

test("Agent", (t) => {
  t.truthy(db.Agent, "Agent Service should exist");
});

test.serial("Setup", (t) => {
  t.true(AgentStub.hasMany.called, "AgentModel.hasMany was executed");
  t.true(
    AgentStub.hasMany.calledWith(MetricStub),
    "Argument should be the MetricStub"
  );
  t.true(MetricStub.belongsTo.called, "MetricModel.hasMany was executed");
  t.true(
    MetricStub.belongsTo.calledWith(AgentStub),
    "Argument should be the AgentStub"
  );
});

test.serial("AgentFindByid", async (t) => {
  let agent = await db.Agent.findById(id);

  t.true(AgentStub.findById.called, "findById should be called on model");
  t.true(AgentStub.findById.calledOnce, "find by id should be called once");
  t.true(
    AgentStub.findById.calledWith(id),
    "find by id should be called with specified id"
  );

  t.deepEqual(agent, agentFixtures.byId(id), "should be the same");
});

test.serial("Agent#createOrUpdate", async (t) => {
  let agent = await db.Agent.createOrUpdate(single);

  t.true(AgentStub.findOne.called, "findOne should be called on model");
  t.true(AgentStub.findOne.calledTwice, "findOne should be called twice");
  t.true(AgentStub.update.calledOnce, "update should be called once");

  t.deepEqual(agent, single, "agent should be the same");
});