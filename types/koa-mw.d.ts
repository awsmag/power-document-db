import { DefaultState, Middleware } from "koa";
import { Db } from "mongodb";
export declare function getDbCLientMw<T = DefaultState>(): Middleware<T, { ctx: { db: Db } }>;
