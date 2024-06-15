import { expect } from "chai";
import { spy } from "sinon";

import { getDbCLientMw } from "../src/koa-mw";

const mw = getDbCLientMw();

const ctx: any = {}; // eslint-disable-line

const next = spy();

describe("The Koa Mw", () => {
  describe("getDbCLientMw Method", () => {
    describe("when executed", () => {
      it("should return a function", () => {
        expect(typeof mw).to.be.equal("function");
      });

      it("should attach db client with ctx", async () => {
        await mw(ctx, next);

        expect(ctx.db).to.deep.equal({});
      });
    });
  });
});
