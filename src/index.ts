import config from "./config";
import { getConfiguredDb } from "./client";

export * from "./koa-mw";

export async function getDbClient(
  uri: string = config.uri,
  dbName: string = config.name,
  ssl: boolean = true,
) {
  if (!uri || !dbName) {
    throw new Error("Connection String and Db Name are required");
  }

  return await getConfiguredDb(uri, ssl, dbName);
}
