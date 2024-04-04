import { MongoClient, Db, ClientSession } from "mongodb";

type SessionParams = {
  causalConsistency: boolean;
  snapshot: boolean;
};

export declare function connectDb(uri: string, ssl: boolean): Promise<void>;
export declare function getDbClient(
  uri: string,
  ssl: boolean,
): Promise<MongoClient>;
export declare function getConfiguredDb(
  uri?: string,
  ssl?: boolean,
  dbName?: string,
): Promise<Db>;
export declare function closeDbConnection(): Promise<void>;
export declare function startSession(
  params?: SessionParams,
): Promise<ClientSession>;
