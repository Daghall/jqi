import fs from "fs";
import terminal from "node:readline";
import readline from "node:readline/promises";
import { stdin, stdout } from "node:process";

import tabCompletion from "./src/tab-completion.js";
import jqa from "./src/jq-async.js";

const promptText = "> ";
// const debug = process.env.DEBUG === "1";

const json = getJsonFromStdin();
stdout.unpipe();
stdin.unpipe();
console.log({ stdin }); // eslint-disable-line no-console
// process.exit();
// terminal.cursorTo(stdin, 0, 0);
// terminal.clearScreenDown(stdin);
const rl = readline.createInterface({
  input: stdin,
  output: stdout,
  terminal: true,
  prompt: promptText,
  autoCommit: true,
  completer: function completer(string) {
    return tabCompletion(string, json, rl);
  },
});

const {
  // colums: xMax,
  rows: yMax,
} = stdout;

(async () => {
  terminal.cursorTo(stdout, 0, 0);
  terminal.clearScreenDown(stdout);
  terminal.cursorTo(stdout, 0, 0);
  let res = await jqa(".", json);

  prompt(".");
  printResult(res, yMax);
  terminal.cursorTo(stdout, promptText.length + 1, 0);
  rl.on("line", async (line) => {
    switch (line.trim()) {
      case "q":
        rl.close();
        process.exitCode = 0;
        break;
    }
    if (process.exitCode === undefined) {
      terminal.cursorTo(stdout, 0, 0);
      res = await jqa(line, json);
      prompt(line);
      printResult(res, yMax);
      // terminal.cursorTo(stdout, 0, 0);
      // stdout.write();
      terminal.cursorTo(stdout, promptText.length + rl.line.length, 0);
    }
  });
})();

function prompt(str) {
  // terminal.moveCursor(stdout, 0, -1);
  // terminal.clearScreenDown(stdout);
  // terminal.cursorTo(stdout, 40, 58);
  // terminal.cursorTo(stdout, 0, 0);
  rl.prompt(true);
  rl.write(str);
}

function printResult(res, max) {
  let row = 0;
  for (const line of res.split("\n").slice(0, max)) {
    terminal.cursorTo(stdout, 0, ++row);
    stdout.write(line);
  }
}

function getJsonFromStdin() {
  if (!process.stdout.isTTY) {
    return fs.readFileSync(0).toString();
  } else {
    return JSON.stringify({
      xfiles: {
        a: 1,
        b: 2,
        zoo: { animals: [ "elepant", "leyon", "munkey" ] },
        zebbra: false,
      },
      yfiles: {
        a: 3,
        b: 4,
        c: 5,
      },
    });
  }
}
