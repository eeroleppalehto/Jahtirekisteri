# Journal

This document contains logs of procedures when setting up the server enviroment.

## Work done in branch *12-initialize-the-server*

* Initialize the node project by running `npm init`.
* Run command `npm install typescript --save-dev` to save TypeScript as a dependency for the duration of the development cycle.
* Add "tsc": "tsc" script under the packege.json file. This will allow us to run the TypeScript compiler by running `npm run tsc`.
* Run  `npm run tsc -- --init` to create a tsconfig.json file. This file will contain the configuration for the TypeScript compiler.
* Run commands ```npm install express
npm install --save-dev eslint @types/express @typescript-eslint/eslint-plugin @typescript-eslint/parser``` to install express and eslint.
* Create *.eslintrc* file and add code from <https://fullstackopen.com/en/part9/typing_an_express_app>
* Run command `npm install --save-dev ts-node-dev` to install ts-node-dev. This will allow us to run the server by running `npm run dev`.
* Add `"dev": "ts-node-dev index.ts",
    "lint": "eslint --ext .ts ."` to the scripts in the package.json file.
* Create *index.ts* file and add code following code to test that the server is working:

```javascript
import express from 'express';
const app = express();
app.use(express.json());

const PORT = 3000;

app.get('/ping', (_req, res) => {
    console.log('someone pinged here');
    res.send('pong');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

* To allow cross-origin resource sharing (CORS) install cors by running `npm install cors`.
* Add types for cors by running `npm install --save-dev @types/cors`.
* Add the following code to the index.ts file to allow CORS:

```javascript
import cors from 'cors';
// ...
app.use(cors());
```

## Work done in branch 16-initialize-connection-between-prisma-and-the-backend-server

The following steps can be found with more details in <https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project/relational-databases-typescript-postgresql>

* Run command `npm install prisma --save-dev` to install prisma as a development dependency.
* Next run command `npx prisma init` to initialize prisma. This will create a prisma folder with a schema.prisma file.
* Next add connection string to *.env* file for connecting to the database. The connection string is in the following format: `postgresql://<username>:<password>@<host>:<port>/<database>?schema=<schema>`.
* Next pull the database schema from the existing database by running `npx prisma db pull`.
* Run command `mkdir -p prisma/migrations/0_init` to create a migrations folder.
* Next generate the migration file by running `npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > prisma/migrations/0_init/migration.sql`
* Run the migration with command `npx prisma migrate resolve --applied 0_init`.
* Finally install the prisma client by running `npm install @prisma/client` and generate the prisma client by running `npx prisma generate`.

## Work done in branch 23-router-and-service-modules-for-member-table

* Create *client.ts* file for generating the prisma client.
* Create routers, services, and zodSchema folders for organizing the code.
* Install zod by running `npm install zod`.
* Create zod schema for member input by creating *member.ts* file in the zodSchema folder.
* Next create *member.ts* file in the services folder where CRUD operations for the member table will be implemented.
* Last create *member.ts* file in the routers folder where the routes for the member table will be implemented.
* Import the member router in the index.ts file to allow the routes to be used.
