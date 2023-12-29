import { DefaultState, Middleware } from "koa";
import { Db } from "mongodb";
import { getConfiguredDb } from "./client";

export function getDbCLientMw<T = DefaultState>(): Middleware<T> {
  return async (ctx, next) => {
    const db: Db = await getConfiguredDb();
    ctx.db = db;

    await next();
  };
}
