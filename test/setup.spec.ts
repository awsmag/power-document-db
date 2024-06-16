import { startDb, stopDb } from "./setupDb";

before(async () => {
  await startDb();
});

after(async () => {
  await stopDb();
});
