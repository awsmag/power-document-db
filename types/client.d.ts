import { MongoClient, Db, ClientSession, ChangeStreamDocument } from "mongodb";
import { IWatchStorage } from "../src/storage";

type SessionParams = {
  causalConsistency: boolean;
  snapshot: boolean;
};

export declare function connectDb(
  uri: string,
  ssl: boolean,
  tlsCAFile?: string,
): Promise<void>;

export declare function getDbClient(
  uri: string,
  ssl: boolean,
  tlsCAFile?: string,
): Promise<MongoClient>;

export declare function getConfiguredDb(
  uri?: string,
  ssl?: boolean,
  dbName?: string,
  tlsCAFile?: string,
): Promise<Db>;

export declare function closeDbConnection(): Promise<void>;

export declare function startSession(
  params?: SessionParams,
): Promise<ClientSession>;

export declare function watchCollection({
  collection,
  process,
  key,
  storageType,
  filter,
  storage,
}: {
  collection: string;
  process: (change: ChangeStreamDocument<Document>) => Promise<void>;
  key: string;
  storageType?: "Memory" | "Redis" | "Custom";
  filter?: Array<Record<string, any>>; // eslint-disable-line
  storage?: IWatchStorage;
}): Promise<void>;

// export declare function distributedWatchCollection({
//   collection,
//   process,
//   key,
//   filter,
// }: {
//   collection: string;
//   process: (change: ChangeStreamDocument<Document>) => Promise<void>;
//   key: string;
//   filter?: Array<Record<string, any>>; // eslint-disable-line
// }): Promise<void>;
