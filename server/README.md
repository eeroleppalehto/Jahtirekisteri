# Server

This document contains introduction to the server side of the application and recomendations for extensions for VS Code.

## Installation

To get this project up and running on your local machine, follow these steps:

* Install Node.js from <https://nodejs.org/en/download/>
* To check that Node.js is installed, run the following command in your terminal: `node -v`. If you see a version number, Node.js is installed.
* To run the server, you need to have a PostgreSQL database. You can get PostgreSQL from <https://www.postgresql.org/download/> or you can use the docker compose file in the postgresDocker folder to create a PostgreSQL database. If you use the docker compose file, you need to have Docker installed. Check for more instruction in the README.md file in the postgresDocker folder.
* Add *.env* file under the server folder and add the following connection string to it: `DATABASE_URL="postgresql://<username>:<password>@<host>:<port>/<database>?schema=<schema>"`. Replace:

  * `<username>` with your username for the database.
  * `<password>` with your password for the database.
  * `<host>` with the host for the database.
  * `<port>` with the port for the database.
  * `<database>` with the name of the database.
  * `<schema>` with the name of the schema.

* Once previous steps have been done, run the following command to install the dependencies for the project `npm install`

## Getting started

### Starting the server

To start the server, run the following command: `npm run dev`. Now you can try to access the server by going to <http://localhost:3000/ping> in your browser. If you see the text "pong" in your browser, the server is working.

### Prisma Studio

To start Prisma Studio, run the following command: `npx prisma studio`. Now you can try to access Prisma Studio by going to <http://localhost:5555> in your browser.

Prisma Studio is a visual editor for your database. You can use it to browse and edit data in your database. You can also use it to test your database queries.

## Folder structure

Here is a short description of the most important files and folders in the server folder:

* **prisma folder**: This folder contains the Prisma schema file and the migrations folder. The migrations folder contains the migrations for the database. 
  * **schema.prisma**: This file contains the database schema.
* **routers folder**: This folder contains the routers for the REST API.
* **services folder**: This folder contains the services used by the routers.
* **tests folder**: This folder contains the tests for the server.
* **utils folder**: This folder contains the utility functions for the server such as the error handler
* **zodSchemas folder**: This folder contains the Zod schemas to validate the data sent to the server.
* **client.ts**: This file contains the singleton for the Prisma client that is used to access the database.
* **index.ts**: This file contains the main logic for the server.
* **singleton.ts**: This file contains the singleton object for testing prisma client.

## Libraries

Here is a list of the most important libraries used in the server:

| Library | Short description | Documentation |
| --- | --- | --- |
| [Express](https://expressjs.com/) | Web framework for Node.js | [Documentation](https://expressjs.com/en/5x/api.html) |
| Prisma | Database toolkit for Node.js and TypeScript | [Documentation](https://www.prisma.io/docs/) |
| Zod | TypeScript-first schema validation with static type inference | [Documentation](https://zod.dev/) |
| Jest | JavaScript Testing Framework | [Documentation](https://jestjs.io/docs/getting-started) |
| Supertest | HTTP assertions for Jest | [Documentation](https://github.com/ladjs/supertest#readme) |
| express-async-errors | Async/await error handling for Express | [Documentation](https://github.com/davidbanham/express-async-errors#readme) |
