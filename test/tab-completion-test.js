import { expect } from "chai";

import tabCompletion from "../src/tab-completion.js";

const json = JSON.stringify({
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

const mockRealine = { write: () => { } };

describe("Tab completion", () => {
  describe("basic commands", () => {
    it("keys", async () => {
      await expectCompletion("k", [
        "keys",
      ]);
    });

    it("type", async () => {
      await expectCompletion("ty", [
        "type",
      ]);
    });

    it("select", async () => {
      await expectCompletion("sel", [
        "select",
      ]);
    });

    it("values", async () => {
      await expectCompletion("valu", [
        "values",
      ]);
    });
  });

  describe("straigh up", () => {
    it("root", async () => {
      await expectCompletion(".", [
        ".xfiles",
        ".yfiles",
      ]);
    });

    it("level 1, partial", async () => {
      await expectCompletion(".x", [
        ".xfiles",
      ]);
    });

    it("level 1 complete", async () => {
      await expectCompletion(".xfiles", [], ".xfiles.");
    });

    it("level 2, root", async () => {
      await expectCompletion(".xfiles.", [
        ".xfiles.a",
        ".xfiles.b",
        ".xfiles.zebbra",
        ".xfiles.zoo",
      ]);
    });

    it("level 2, leaf", async () => {
      await expectCompletion(".xfiles.a", []);
    });

    it("level 2, multiple choices", async () => {
      await expectCompletion(".xfiles.z", [
        ".xfiles.zebbra",
        ".xfiles.zoo",
      ]);
    });

    it("level 2, single choice, multiple possible", async () => {
      await expectCompletion(".xfiles.zo", [
        ".xfiles.zoo",
      ]);
    });

    it("level 3, root", async () => {
      await expectCompletion(".xfiles.zoo", [], ".xfiles.zoo.");
    });

    it("level 3, only child", async () => {
      await expectCompletion(".xfiles.zoo.", [
        ".xfiles.zoo.animals",
      ]);
    });

    it("level 4, array", async () => {
      await expectCompletion(".xfiles.zoo.animals", [], ".xfiles.zoo.animals[");
    });

    it.skip("level 4, array indices", async () => {
      await expectCompletion(".xfiles.zoo.animals", [
        ".xfiles.zoo.animals[0",
        ".xfiles.zoo.animals[1",
        ".xfiles.zoo.animals[2",
      ]);
    });
  });

  describe("pipes", () => {
    it("level 1, root", async () => {
      await expectCompletion(". | .", [
        ".xfiles",
        ".yfiles",
      ], ".");
    });

    it("level 2", async () => {
      await expectCompletion(".xfiles | .", [
        ".a",
        ".b",
        ".zebbra",
        ".zoo",
      ], ".");
    });

    it("level 1, for each", async () => {
      await expectCompletion(".[] | .", [
        ".a",
        ".b",
        ".c",
        ".zebbra",
        ".zoo",
      ], ".");
    });
  });

});

async function expectCompletion(searchString, expextedArray, expectedString) {
  expect(await tabCompletion(searchString, json, mockRealine)).to.deep.equal([
    expextedArray,
    expectedString || searchString,
  ]);
}
