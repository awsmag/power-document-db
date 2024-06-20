import { MongoMemoryServer } from "mongodb-memory-server";

let mongod: MongoMemoryServer;

let started = false;

export async function startDb() {
  if (started === true) {
    return;
  }

  started = true;
  mongod = await MongoMemoryServer.create({
    instance: {
      port: 8011,
    },
  });
}

export async function stopDb() {
  started = false;
  await mongod.stop();
}
