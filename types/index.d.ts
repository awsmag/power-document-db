export * from "./koa-mw";
export declare function connectDb(uri?: string, dbName?: string, ssl?: boolean, tlsCAFile?: string): Promise<import("mongodb").Db>;
export * from "./client"
export * from "mongodb";
