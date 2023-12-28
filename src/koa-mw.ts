import { DefaultContext, DefaultState, Middleware } from "koa";
import { MongoClient } from "mongodb";
import { getDbClient } from "./client";
import config from "./config";

export function getDbCLientMw<T = DefaultState>(
  uri: string = config.uri,
  dbName: string = config.dbName,
  ssl: boolean = true,
): Middleware<T> {
  if (!uri || !dbName) {
    throw new Error("Connection String and DB Name are required");
  }

  return async (ctx, next) => {
    const client: MongoClient = await getDbClient(uri, ssl);
    ctx.db = client.db(dbName);

    await next();
  };
}
