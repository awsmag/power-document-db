import { record, string, optional, number } from "typescript-json-decoder";

const envDecoder = record({
  CONNECTION_URI: optional(string),
  DB_NAME: optional(string),
  POWER_DOCUMENT_DB_REDIS_CONNECTION_STRING: optional(string),
  POWER_DOCUMENT_DB_REDIS_PING_INTERVAL: optional(number),
});

const data = envDecoder(process.env);

const config: {
  url?: string;
  name?: string;
  redis?: {
    connectionString?: string;
    pingInterval: number;
  }
} = {
  url: data.CONNECTION_URI || null,
  name: data.DB_NAME || null,
  redis: {
    connectionString: data.POWER_DOCUMENT_DB_REDIS_CONNECTION_STRING,
    pingInterval: data.POWER_DOCUMENT_DB_REDIS_PING_INTERVAL || 60000 * 15,
  },
};

export default Object.freeze(config);
