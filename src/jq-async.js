import jq from "node-jq";

export default async function jqa(filter, data, { output = "pretty" } = {}) {
  try {
    return await jq.run(filter, data, { input: "string", output });
  } catch ({ message }) {
    return message;
  }
}
