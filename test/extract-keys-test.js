import { expect } from "chai";

import extractKeys from "../src/extract-keys.js";

describe("Extract keys", () => {
  it("handles keys from multiple arrays, containing quotes and [], respectively", () => {
    const testString = "[\n  \"key1\",\n  \"key2\",\n  \"key \\\"3\\\"\"\n]\n[\n  \"key1b\",\n  \"key2b\",\n  \"[key4]\"\n]";
    expect(extractKeys(testString)).to.deep.equal([
      "key1",
      "key2",
      'key "3"',
      "key1b",
      "key2b",
      "[key4]",
    ]);
  });

  it("does not try if input does not look like concatenated arrays", () => {

    const testString = "node-jq: invalid json string argument supplied: \"undefined\"";
    expect(extractKeys(testString)).to.deep.equal([]);
  });
});
