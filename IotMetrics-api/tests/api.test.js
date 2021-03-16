"use strict";

const test = require("ava");
const request = require("supertest");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

const agentFixtures = require("./fixtures/agent");

let sandbox = null;
let app = null;
let dbStub = null;
let AgentStub = {};
let MetricStub = {};
const uuid = "yyy-yyy-yyy";
const wrongUuid = "wrong";

test.beforeEach(async () => {
  sandbox = sinon.createSandbox();
  dbStub = sandbox.stub();
  dbStub.returns(
    Promise.resolve({
      Agent: AgentStub,
      Metric: MetricStub,
    })
  );

  AgentStub.findConnected = sandbox.stub();
  AgentStub.findConnected.returns(Promise.resolve(agentFixtures.connected));

  AgentStub.findByUuid = sandbox.stub();
  AgentStub.findByUuid
    .withArgs(uuid)
    .returns(Promise.resolve(agentFixtures.byUuid(uuid)));

  AgentStub.findByUuid
    .withArgs(wrongUuid)
    .returns(Promise.resolve(agentFixtures.byUuid(null)));

  const router = proxyquire("../router", {
    "iotmetrics-db": dbStub,
  });
  app = proxyquire("../server", {
    "./router": router,
  });
});

test.afterEach(() => {
  sandbox && sandbox.restore();
});

test.serial.cb("/api/agents", (t) => {
  request(app)
    .get("/api/agents")
    .expect(200)
    .expect("Content-Type", /json/)
    .end((err, res) => {
      t.falsy(err, "should not return an error");
      let body = JSON.stringify(res.body);
      let expected = JSON.stringify(agentFixtures.connected);
      t.deepEqual(body, expected, "response body should be the expected");
      t.end();
    });
});

test.serial.cb("/api/agent/:uuid", (t) => {
  request(app)
    .get(`/api/agent/${uuid}`)
    .expect(200)
    .expect("Content-Type", /json/)
    .end((err, res) => {
      t.falsy(err, "should not return an error");
      let body = JSON.stringify(res.body);
      let expected = JSON.stringify(agentFixtures.byUuid(uuid));
      t.deepEqual(body, expected, "response body should be the expected");
      t.end();
    });
});

test.serial.cb("/api/agent/:uuid - not found", (t) => {
  request(app)
    .get(`/api/agent/${wrongUuid}`)
    .expect(404)
    .expect("Content-Type", /json/)
    .end((err, res) => {
      t.truthy(res.body.error, "should return an error");

      t.end();
    });
});

test.serial.todo("/api/metrics/:uuid");
test.serial.todo("/api/metrics/:uuid - not found");

test.serial.todo("/api/metrics/:uuid/:type");
test.serial.todo("/api/metrics/:uuid/:type - not found");
