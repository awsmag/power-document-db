# power-document-db

A lightweight utility library to simplify connecting and working with **Amazon DocumentDB (with MongoDB compatibility)**.  
Built for real-world usage, including production DocumentDB clusters, containerized local MongoDB, and Koa middleware integration.

---

## 📦 NPM Package

[![npm version](https://img.shields.io/npm/v/@awsmag/power-document-db.svg)](https://www.npmjs.com/package/@awsmag/power-document-db)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
![NodeJS](https://img.shields.io/badge/node-%3E=18.0.0-blue)
![Types](https://img.shields.io/badge/TypeScript-Supported-blue)
[![Downloads](https://img.shields.io/npm/dm/@awsmag/power-document-db)](https://www.npmjs.com/package/@awsmag/power-document-db)

---

## 📚 Table of Contents

1. [Features](#-features)
2. [Installation](#-installation)
3. [Environment Variables](#-environment-variables)
4. [Usage](#-usage)
   - [With Environment Variables](#using-environment-variables)
   - [With Explicit Parameters](#passing-parameters-explicitly)
5. [Koa Middleware](#-koa-middleware)
6. [Transactions](#-transactions)
7. [API](#-api)
8. [Local Development](#-local-development)
9. [Troubleshooting](#-troubleshooting)
10. [Contributing](#-contributing)
11. [Maintainers](#-maintainers)
12. [License](#-license)

---

## ✅ Features

- Connect easily to DocumentDB or local MongoDB
- SSL/TLS support with AWS CA certificates
- Works with Docker-based Mongo
- Koa middleware support → `ctx.db`
- Supports transactions
- TypeScript friendly
- Minimal, simple API

---

## 🔧 Installation

```bash
npm install @awsmag/power-document-db
````

---

## 🌍 Environment Variables

| Variable         | Description                        | Optional |
| ---------------- | ---------------------------------- | -------- |
| `CONNECTION_URI` | Mongo/DocumentDB connection string | ✅        |
| `DB_NAME`        | Database name                      | ✅        |

> If set → `connectDb()` can be called without arguments
> Otherwise → pass parameters explicitly

---

## 🚀 Usage

### Using Environment Variables

```ts
import { connectDb } from "@awsmag/power-document-db";

async function main() {
  const db = await connectDb();
  const users = await db.collection("users").find({}).toArray();
  console.log(users);
}

main();
```

### Passing Parameters Explicitly

```ts
import { connectDb } from "@awsmag/power-document-db";

async function main() {
  const uri = "mongodb://localhost:27017";
  const dbName = "test";
  const ssl = false;
  const tlsCAFile = "./certs/global-bundle.pem"; // Required only when ssl=true

  const db = await connectDb(uri, dbName, ssl, tlsCAFile);
}
```

---

## 🧩 Koa Middleware

Attach DB client automatically to `ctx.db`:

```ts
import Koa from "koa";
import { connectDb, getDbClientMw } from "@awsmag/power-document-db";

const app = new Koa();

(async () => {
  await connectDb("mongodb://localhost:27017", "test");
  app.use(getDbClientMw());

  app.use(async ctx => {
    const users = await ctx.db.collection("users").find({}).toArray();
    ctx.body = users;
  });

  app.listen(3000);
})();
```

---

## 🔄 Transactions

```ts
import { startSession } from "@awsmag/power-document-db";

async function runWithTransaction(db) {
  const session = await startSession();

  try {
    await session.startTransaction();

    await db.collection("orders").insertOne({ item: "Book" }, { session });

    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    console.error("Transaction aborted:", err);
  } finally {
    session.endSession();
  }
}
```

---

## 🧠 API

### `connectDb(uri?, dbName?, ssl?, tlsCAFile?)`

Returns: `Promise<Db>`

If no args → uses env variables

---

### `startSession()`

Returns: `Promise<ClientSession>`

---

### `getDbClientMw()`

Koa middleware → adds `ctx.db`

---

## 🛠 Local Development

### Using Docker

```bash
docker run \
  -p 27017:27017 \
  --name mongo \
  mongo:latest
```

Then connect using:

```
mongodb://localhost:27017
```

> Use `ssl=false` for local development.

---

## ❗ Troubleshooting

| Issue                           | Fix                                            |
| ------------------------------- | ---------------------------------------------- |
| SSL enabled without CA bundle   | Provide `tlsCAFile`                            |
| Timeout connecting to AWS DocDB | Check VPC + security group access              |
| Transaction errors              | Ensure cluster supports transactions           |
| `ctx.db` undefined              | Make sure `connectDb()` runs before middleware |

---

## 🤝 Contributing

1. Fork the repo
2. Create branch → `feature/my-change`
3. Add tests if needed
4. Submit a PR

---

## 👨‍🔧 Maintainers

* **[AWSMAG](https://awsmag.com)**
* **[S25 Digital](https://s25.digital)**

---

## 📄 License

[MIT](LICENSE)
