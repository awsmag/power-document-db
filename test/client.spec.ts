import { expect } from "chai";

import { closeDbConnection, getConfiguredDb, getDbClient } from "../src/client";
import config from "../src/config";
import { Db, MongoClient } from "mongodb";

describe("The Client", () => {
  describe("The getDbClient method", () => {
    describe("when uri is not provided", () => {
      it("should throw an error", async () => {
        try {
          await getDbClient(null, false, "");
        } catch (err) {
          expect(err.message).to.equal("Connection String is required");
        }
      });
    });

    describe("when ssl is true but tls file is not provided", () => {
      it("should throw an error", async () => {
        try {
          await getDbClient("test", true, "");
        } catch (err) {
          expect(err.message).to.equal(
            "CA File path required for ssl connection",
          );
        }
      });
    });

    describe("when all parameters are correct", () => {
      it("should return a client", async () => {
        const client = await getDbClient(config.url, false);
        expect(client instanceof MongoClient).to.be.true;
      });
    });

    describe("when client is already created", () => {
      it("should return same client", async () => {
        const client = await getDbClient(config.url, false);

        const client2 = await getDbClient(config.url, false);

        expect(client).to.deep.equal(client2);
      });
    });
  });

  describe("getConfiguredDb method", () => {
    describe("when all parameters are provided", () => {
      it("should return the configured db", async () => {
        const db = await getConfiguredDb(config.url, false, config.name);
        expect(db instanceof Db).to.be.true;
      });
    });

    describe("when db is already configured", () => {
      it("should return the same configured db", async () => {
        const db = await getConfiguredDb(config.url, false, config.name);
        const db2 = await getConfiguredDb(config.url, false, config.name);

        expect(db2).to.deep.equal(db);
      });
    });
  });

  describe("closeDbConnection method", () => {
    describe("when the client is not configured", () => {
      it("should throw an error", async () => {
        await getDbClient(config.url, false);
        await closeDbConnection();

        // if connection is closed, the closedb connection should throw an error now
        try {
          await closeDbConnection();
        } catch (err) {
          expect(err.message).to.equal("Db is not connected");
        }
      });
    });
  });
});
