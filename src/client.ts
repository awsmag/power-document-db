import { MongoClient, Db, MongoClientOptions } from "mongodb";
import path from "path";

let client: MongoClient;

export async function connectDb(uri: string, ssl: boolean) {
  try {
    const options =
      ssl === false
        ? {}
        : {
            tlsCAFile: path.join(
              __dirname,
              "../certs/global-bundle.pem",
            ),
            tls: true,
          };

    client = await MongoClient.connect(uri, options);
  } catch (error) {
    throw error;
  }
}

export async function getDbClient(uri: string, ssl: boolean) {
  if (!client) {
    await connectDb(uri, ssl);
  }
  return client;
}

export async function getConfiguredDb(
  uri: string,
  ssl: boolean,
  dbName: string,
): Promise<Db> {
  const client = await getDbClient(uri, ssl);
  return client.db(dbName);
}
