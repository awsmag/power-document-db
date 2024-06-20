import {
  MongoClient,
  Db,
  MongoClientOptions,
  ClientSession,
  ResumeToken,
  ChangeStream,
  ChangeStreamDocument,
  Document,
} from "mongodb";
import pino from "pino";

import { getStorageClient, IWatchStorage } from "./storage";

let client: MongoClient;
let db: Db;

const logger = pino({
  name: "@awsmag/power-document-db/logger",
});

async function connectDb(
  uri: string,
  ssl: boolean,
  tlsCAFile: string = "",
) {
  if (!uri) {
    throw new Error("Connection String is required");
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
  client = null;
}

export async function watchCollection({
  collection,
  process,
  key,
  storageType = "Memory",
  filter = [],
  storage,
}: {
  collection: string;
  process: (change: ChangeStreamDocument<Document>) => Promise<void>;
  key: string;
  storageType?: "Memory" | "Redis" | "Custom";
  filter?: Array<Record<string, any>>; // eslint-disable-line
  storage?: IWatchStorage;
}): Promise<void> {
  if (!client) {
    throw new Error("Db is not connected");
  }

  if (storageType === "Custom" && !storage) {
    throw new Error(
      "A Storage needs to be provided with the Custom storage type",
    );
  }

  if (Array.isArray(filter) === false) {
    throw new Error("Filter should be a pipeline for change stream");
  }

  const storageClient: IWatchStorage = storageType === "Custom" ? storage : await getStorageClient(storageType);
  const db = await getConfiguredDb();
  const colls = db.collection(collection);

  const resumeToken = await storageClient.getToken(key);

  const opts: Record<string, any> = {}; // eslint-disable-line

  if(resumeToken) {
    opts.resumeAfter = resumeToken;
  }

  const changeStream: ChangeStream = colls.watch(filter, opts);

  changeStream.on("change", async (change) => {
    await process(change);
    const token = change._id as ResumeToken;
    await storageClient.saveToken(key, token);
  });

  changeStream.on("error", async (error) => {
    logger.error("Change stream error:", error);
    await changeStream.close();
    setTimeout(async () => {
      await watchCollection({
        collection,
        process,
        key,
        filter,
        storageType,
        storage,
      });
    }, 1000); // Retry after 1 second
  });

  changeStream.on("close", async () => {
    logger.warn("Change stream closed. Restarting...");
    await watchCollection({
      collection,
      process,
      key,
      filter,
      storageType,
      storage,
    });
  });
}
