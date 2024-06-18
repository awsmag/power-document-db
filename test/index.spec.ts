import { expect } from "chai";

import { connectDb, Db } from "../src";

describe("The Index", () => {
  describe("The connectDb Method", () => {
    describe("when uri is not provided", () => {
      it("should throw an error", async () => {
        try {
          await connectDb(null, "test", false);
        } catch (err) {
          expect(err.message).to.deep.equal("Connection String and Db Name are required");
        }
      });
    });

    describe("when dbName is not provided", () => {
      it("should throw an error", async () => {
        try {
          await connectDb("test", null, false);
        } catch (err) {
          expect(err.message).to.deep.equal("Connection String and Db Name are required");
        }
      });
    });

    describe("when it is sucessfully executed", () => {
      it("should return an instance of Db", async () => {
        const client = await connectDb();

        expect(client instanceof Db).to.be.true;
      });
    });
  });
});
