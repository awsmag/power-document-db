import { ResumeToken } from "mongodb";

export interface IWatchStorage {
  getToken: (key: string) => Promise<ResumeToken | null>;
  saveToken: (key: string, token: ResumeToken) => Promise<void>;
}