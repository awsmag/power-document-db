import { expect } from "chai";

import { connectDb } from "../src";

describe("The Index", () => {
  describe("The connectDb Method", () => {
    describe("when uri is not provided", () => {
      it("should throw an error", async () => {
        try {
          await connectDb(null, "test", false);
        } catch (err) {
          expect(err.message).to.deep.equal("test");
        }
      });
    });
  });
});
