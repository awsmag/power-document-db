import { IWatchStorage } from "./storage";
import { getRedisStorage } from "./RedisStorage";

export * from "./storage";

export async function getStorageClient(
  type: "Custom" | "Memory" | "Redis",
): Promise<IWatchStorage> {
  switch (type) {
    case "Memory":
      return {} as IWatchStorage;
    case "Redis":
      return await getRedisStorage();
    default:
      throw new Error("Invalid Storage type");
  }
}
