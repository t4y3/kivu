#!/usr/bin/env node

const inquirer = require("inquirer");
const path = require("path");
const { spawn } = require("child_process");
const package = require(path.join(path.resolve(), "package.json"));

inquirer
  .prompt({
    type: "list",
    name: "script",
    message: 'Select the "script" field',
    choices: Object.keys(package.scripts).map(
      scriptName => `${scriptName}: ${package.scripts[scriptName]}`
    ),
    pageSize: Object.keys(package.scripts).length
  })
  .then(answers => {
    const scriptExec = spawn("npm", ["run", answers.script.split(":")[0]], {
      cwd: path.resolve(),
      stdio: "inherit"
    });

    scriptExec.on("close", code => {
      if (code !== 0) {
        // eslint-disable-next-line no-console
        console.error(`npm script process exited with code ${code}`);
      }
      // eslint-disable-next-line no-console
      console.log(`'npm run '${answers.script.split(":")[0]}:  Done.`);
    });
  });
