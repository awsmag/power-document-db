import config from "./config";
import { getConfiguredDb as getCDb } from "./client";

export * from "./client";

export * from "./koa-mw";

export async function connectDb(
  uri: string = config.url,
  dbName: string = config.name,
  ssl: boolean = false,
  tlsCAFile: string = ""
) {
  if (!uri || !dbName) {
    throw new Error("Connection String and Db Name are required");
  }

  return await getCDb(uri, ssl, dbName, tlsCAFile);
}

export * from "mongodb";
