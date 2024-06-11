import { ResumeToken } from "mongodb";

export interface IWatchStorage {
  getToken: (key: string) => Promise<ResumeToken | null>;
  saveToken: (key: string, token: ResumeToken) => Promise<void>;
}

export async function getStorageClient(
  type: "Custom" | "Memory" | "Redis",
): Promise<IWatchStorage> {
  switch (type) {
    case "Memory":
      return {} as IWatchStorage;
    case "Redis":
      return {} as IWatchStorage;
    default:
      throw new Error("Invalid Storage type");
  }
}
