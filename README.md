# power-document-db

A package to help connect and work with Amazon DocumentDB (with MongoDB compatibility). You can run this package locally by disabling ssl and connecting to a compatible mongodb docker container.

## Badges

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

## Environment Variables

The package supports two env variables

`CONNECTION_URI`: Connection string to connect to the instance

`DB_NAME`: The name of the Db to be configured in client.

Both the env vars are optional. You can eithr configure these or can pass them to the function.

## Installation

install the package fron npm

```bash
  npm install @awsmag/power-document-db
```

## Usage/Examples

```javascript
import { connectDb } from "@awsmag/power-document-db";

async function useDbWithEnvVarSet() {
  return await connectDb(); // if en variables are set
}

async function useDbWithoutEnvVarSet() {
  const uri = "mongodb://localhost:27017";
  const dbName = "test";
  const ssl = true; // Keep it true when connecting to instance. For local testing and docker container keep it false
  const tlsCAFile = "./certs/global-bundle.pem"; // mandatory when it is set to true. You will get this from AWS under the steps of how to connect to AWS document Db
  return await connectDb(uri, dbName, ssl, tlsCAFile); // if en variables are not set
}
```

The package also supports a Koa middleware to attach the client to ctx.

```javascript
import { connectDb, getDbCLientMw } from "@awsmag/power-document-db";
import Koa from "koa";

const server = new Koa();
const uri = "mongodb://localhost:27017";
const dbName = "test";
const ssl = true; // Keep it true when connecting to instance. For local testing and docker container keep it false
const tlsCAFile = "./certs/global-bundle.pem"; // mandatory when it is set to true. You will get this from AWS under the steps of how to connect to AWS document Db

(async () => {
  await connectDb(uri, dbName, ssl, tlsCAFile); // if en variables are not set
  server.use(getDbCLientMw());

  // rest of your code goes here
})();

// it will be available as `db` in ctx. In your handler use it like below.

const db = ctx.db;
// perform functions using db
```

### Transactions

To use transactions, you can start a session on the client by using the following method

```javascript
import { startSession } from "@awsmag/power-document-db";

const session = await startSession();

// start transaction
session.startTransaction();

await db.insertOne({}, {session}); // use the session in options of the used command to binfd it to particular session and use transaction

// commit or abort transaction
session.commitTransaction();

session.abortTransaction();

```

The package is developed and maintained by [S25Digital](https://s25.digital). You can also check our blog [AWSMAG](https://awsmag.com)
