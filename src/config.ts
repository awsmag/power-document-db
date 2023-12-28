import {record, string, optional } from "typescript-json-decoder";

const envDecoder = record({
  CONNECTION_URI: optional(string),
  DB_NAME: optional(string)
});

const data = envDecoder(process.env);

const config: Record<string, string | null> = {
  url: data.CONNECTION_URI || null,
  name: data.DB_NAME || null
}

export default Object.freeze(config);