import config from "./config";
import { getConfiguredDb as getCDb } from "./client";

export * from "./koa-mw";

export async function connectDb(
  uri: string = config.uri,
  dbName: string = config.name,
  ssl: boolean = true,
) {
  if (!uri || !dbName) {
    throw new Error("Connection String and Db Name are required");
  }

  await getCDb(uri, ssl, dbName);
}

export const getConfiguredDb = getCDb;
