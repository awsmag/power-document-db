import { IWatchStorage } from "./storage";
import { getRedisStorage } from "./RedisStorage";
import { getMemoryStorage } from "./MemoryStorage";

export * from "./storage";

export async function getStorageClient(
  type: "Custom" | "Memory" | "Redis",
): Promise<IWatchStorage> {
  switch (type) {
    case "Memory":
      return getMemoryStorage();
    case "Redis":
      return await getRedisStorage();
    default:
      throw new Error("Invalid Storage type");
  }
}
