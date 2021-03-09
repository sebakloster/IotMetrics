"use strict";

const debug = require("debug")("iotmetrics:db:setup");
const inquirer = require("inquirer");
const chalk = require("chalk");
const db = require("./");

const prompt = inquirer.createPromptModule();

async function setup() {
  if (process.argv.pop() !== "--y") {
    const answer = await prompt([
      {
        type: "confirm",
        name: "setup",
        message: "This will destroy your database, are you sure? ",
      },
    ]);

    if (!answer.setup) {
      return console.log("Nothing happened :)");
    }
  }

  const config = {
    database: process.env.DB_NAME || "iotmetrics",
    username: process.env.DB_USER || "admin",
    password: process.env.DB_PASS || "admin1234",
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
    loggin: (message) => debug(message),
    setup: true,
  };
  await db(config).catch(handleFatalError);
  console.log("success!");
  process.exit(0);
}
function handleFatalError(err) {
  console.error(`${chalk.red("[fatal error]")} ${err.message}`);
  console.error(err.stack);
  process.exit(1);
}

setup();
