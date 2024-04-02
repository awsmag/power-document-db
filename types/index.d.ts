import { getConfiguredDb as getCDb, closeDbConnection as clDb, startSesion as st } from "./client";
export * from "./koa-mw";
export declare function connectDb(uri?: string, dbName?: string, ssl?: boolean): Promise<import("mongodb").Db>;
export declare const getConfiguredDb: typeof getCDb;
export declare const closeDbConnection: typeof clDb;
export declare const startSesion: typeof st;
export * from "mongodb";
