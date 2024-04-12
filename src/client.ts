import { MongoClient, Db, MongoClientOptions, ClientSession } from "mongodb";

let client: MongoClient;
let db: Db;

export async function connectDb(
  uri: string,
  ssl: boolean,
  tlsCAFile: string = "",
) {
  if (!uri) {
    throw new Error("Connection String and DB Name are required");
  }

  if (ssl === true && !tlsCAFile) {
    throw new Error("CA File path required for ssl connection");
  }

  const options: MongoClientOptions =
    ssl === false
      ? {}
      : {
          tlsCAFile: tlsCAFile,
          tls: true,
        };

  client = await MongoClient.connect(uri, options);
}

export async function getDbClient(uri: string, ssl: boolean, tlsCAFile = "") {
  if (!client) {
    await connectDb(uri, ssl, tlsCAFile);
  }
  return client;
}

export async function getConfiguredDb(
  uri: string = "",
  ssl: boolean = false,
  dbName: string = "",
  tlsCAFile: string = "",
): Promise<Db> {
  if (!db) {
    const client = await getDbClient(uri, ssl, tlsCAFile);
    db = client.db(dbName);
  }

  return db;
}

export async function startSession(
  { causalConsistency, snapshot } = {
    causalConsistency: false,
    snapshot: true,
  },
): Promise<ClientSession> {
  if (!client) {
    throw new Error("Not connected");
  }

  return client.startSession({
    causalConsistency,
    snapshot,
  });
}

export async function closeDbConnection() {
  if (!client) {
    throw new Error("Db is not connected");
  }

  await client.close();
}
