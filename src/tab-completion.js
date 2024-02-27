import jqa from "./jq-async.js";
import extractKeys from "./extract-keys.js";

const debug = process.env.DEBUG === "1";
const keywords = [ "keys", "type", "values", "select" ];

export default async function tabCompletion(string, data, rl) {
  const word = string.split(/[|\], ]/).pop();
  let matches;
  if (word.startsWith(".")) {
    const nodes = word.split(/[.[]/);
    const node = nodes.slice(0, -1).join(".") || ".";
    const sub = nodes.pop() || (word.includes("[") ? "[" : ".");
    const lastFilter = string.split(",").pop();
    const jqq = `${lastFilter.slice(0, lastFilter.lastIndexOf(word)) + node} | keys?`;
    const jqKeys = await jqa(jqq, data, { output: "json" });

    if (debug)console.log({ string, jqq, jqKeys, sub, word, nodes, lastFilter }); // eslint-disable-line no-console

    // If multiple arrays are found, they are concatenated as a string
    if (Array.isArray(jqKeys)) {
      matches = jqKeys;
    } else if (typeof jqKeys === "string") {
      // matches = extractKeys(jqKeys).map((key) => `.${key}`);
      matches = extractKeys(jqKeys);
    }
    matches = matches
      .map((i) => typeof i === "number" ? `${word}[${i}]` : i)
      .filter((i) => word.slice(-1) === "." || (typeof i === "undefined") || (i.toString().startsWith(sub)))
      .map((s) => {
        if (typeof s === "number") {
          return `${nodes.join(".")}[${s}]`;
        }
        return nodes.slice().concat(s).join(".");
      });

    // console.log("XXX", matches.length, matches[0], word); // eslint-disable-line no-console
    if (matches.length === 1 && matches[0] === word) {
      const jqKeys2 = await jqa(`${string} | keys?`, data, { output: "json" });
      if (debug) console.log({ q: `${string} | keys?`, jqKeys2 }); // eslint-disable-line no-console
      if (Array.isArray(jqKeys2)) {
        const nodeType = await jqa(`${matches[0]} | type`, data, { output: "json" });
        if (nodeType === "array") {
          rl.write("[");
          return tabCompletion(`${matches[0]}[`);
        }
        rl.write(".");
        return tabCompletion(`${matches[0]}.`);
      } else {
        return [ [], word ];
      }
    }
  } else {
    matches = keywords.filter((k) => k.startsWith(word));
  }
  const um = Array.from(new Set(matches));
  if (debug) console.log({ matches, um, word }); // eslint-disable-line no-console
  return [ um, word ];
}
