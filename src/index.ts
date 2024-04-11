import config from "./config";
import { getConfiguredDb as getCDb, closeDbConnection as clDb, startSession as sts } from "./client";

export * from "./koa-mw";

export async function connectDb(
  uri: string = config.uri,
  dbName: string = config.name,
  ssl: boolean = true,
  tlsCAFile: string = ""
) {
  if (!uri || !dbName) {
    throw new Error("Connection String and Db Name are required");
  }

  return await getCDb(uri, ssl, dbName, tlsCAFile);
}

export const getConfiguredDb = getCDb;
export const closeDbConnection = clDb;
export const startSession = sts;

export * from "mongodb";
