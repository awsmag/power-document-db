import { MongoClient, Db, MongoClientOptions, ClientSession } from "mongodb";
import path from "path";

let client: MongoClient;
let db: Db;

export async function connectDb(uri: string, ssl: boolean) {
  try {
    if (!uri) {
      throw new Error("Connection String and DB Name are required");
    }
    const options: MongoClientOptions =
      ssl === false
        ? {}
        : {
            tlsCAFile: path.join(__dirname, "../certs/global-bundle.pem"),
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
  uri: string = "",
  ssl: boolean = false,
  dbName: string = "",
): Promise<Db> {
  if (!db) {
    const client = await getDbClient(uri, ssl);
    db = client.db(dbName);
  }

  return db;
}

export async function startSesion(
  { causalConsistency, snapshot } = {
    causalConsistency: false,
    snapshot: true,
  },
): Promise<ClientSession> {
  if (!client) {
    throw new Error("Not connected");
  }

  return await client.startSession();
}

export async function closeDbConnection() {
  if (!client) {
    throw new Error("Db is not connected");
  }

  await client.close();
}
