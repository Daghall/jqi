import jq from "node-jq";
import terminal from "node:readline";
import readline from "node:readline/promises";
import {
  stdin,
  stdout,
} from "node:process";
import fs from "fs";

const promptText = "> ";

const rl = readline.createInterface({
  input: stdin,
  output: stdout,
  prompt: promptText,
  autoCommit: true,
  completer: (word) => {
    return [ [ `${word}, you complete me!` ], word ];
  },
});
const json = fs.readFileSync(0).toString();
const {
  // colums: xMax,
  rows: yMax,
} = stdout;

(async () => {
  terminal.cursorTo(stdout, 0, 0);
  terminal.clearScreenDown(stdout);
  const res = await jqa(".env", json);

  prompt(".");
  printResult(res, yMax);
  rl.on("line", (line) => {
    // terminal.cursorTo(stdout, i, ++i);
    // stdout.write(`${++i}: ${line.trim()}`);
    switch (line.trim()) {
      case "q":
        rl.close();
        process.exitCode = 0;
        break;
    }
    if (process.exitCode === undefined) {
      prompt(line);
      terminal.cursorTo(stdout, 1, 1);
      // stdout.write("fooo");
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

function jqa(filter, data) {
  return new Promise((resolve) => {
    jq.run(filter, data, { input: "string" }).then(resolve);
  });
}
