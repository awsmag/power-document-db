import NodeCache from "node-cache";
import { ResumeToken } from "mongodb";

import { IWatchStorage } from "./storage";

class MemoryStorage implements IWatchStorage {
  private _client: NodeCache;
  constructor(client: NodeCache) {
    this._client = client;
  }

  async getToken(key: string) {
    const value = this._client.get<string>(key);
    if (!value) {
      return value;
    }

    return JSON.parse(value) as ResumeToken;
  }

  async saveToken(key: string, token: ResumeToken) {
    this._client.set(key, JSON.stringify(token));
  }
}

export function getMemoryStorage() {
  const client = new NodeCache();
  return new MemoryStorage(client);
}
