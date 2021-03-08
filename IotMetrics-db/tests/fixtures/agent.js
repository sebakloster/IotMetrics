"use strict";

const agent = {
  id: 1,
  uuid: "yyy-yyy-yyy",
  name: "fixture",
  username: "agent-1",
  hostname: "test-host",
  pid: 0,
  connected: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

function extend(obj, values) {
  const clone = Object.assign({}, obj);
  return Object.assign(clone, values);
}

const agents = [
  agent,
  extend(agent, {
    id: 2,
    uuid: "yyy-yyy-yyw",
    connected: false,
    username: "agent-2",
  }),
  extend(agent, {
    id: 3,
    uuid: "yyy-yyy-yyx",
  }),
  extend(agent, {
    id: 4,
    uuid: "yyy-yyy-yyz",
    username: "agent-4",
  }),
];

module.exports = {
  single: agent,
  all: agents,
  connected: agents.filter((a) => a.connected),
  agent1: agents.filter((a) => a.username == "agent-1"),
  byUuid: (id) => agents.find((a) => a.uuid == id),
  byId: (id) => agents.find((a) => a.id == id),
};
