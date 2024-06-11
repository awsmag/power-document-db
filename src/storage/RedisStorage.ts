import { RedisClientType, createClient } from "redis";
import config from "../config";
import { IWatchStorage } from "./storage";
import { ResumeToken } from "mongodb";

let client: RedisClientType;

async function connectRedis() {
  const url = config.redis?.connectionString;
  const opts = {
    pingInterval: config.redis?.pingInterval,
  };

  if (!url) {
    throw new Error(
      "Setup the redis connection string in env var: POWER_DOCUMENT_DB_REDIS_CONNECTION_STRING",
    );
  }

  client = createClient({
    url: url,
    ...opts,
  });

  await client.connect();
}

async function getClient() {
  if (!client) {
    await connectRedis();
  }

  if (!client.isOpen) {
    await client.connect();
  }

  return client;
}

class RedisStorage implements IWatchStorage {
  private _client: RedisClientType;

  constructor(client: RedisClientType) {
    this._client = client;
  }

  async getToken(key: string): Promise<ResumeToken | null> {
    const value = await this._client.get(key);

    if (!value) {
      return value;
    }

    return JSON.parse(value) as ResumeToken;
  }

  async saveToken(key: string, token: ResumeToken): Promise<void> {
    await this._client.set(key, JSON.stringify(token));
  }
}

export async function getRedisStorage() {
  const client: RedisClientType = await getClient();

  return new RedisStorage(client);
}
