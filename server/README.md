# Server

This document contains introduction to the server side of the application and recomendations for extensions for VS Code.

## Installation

To get this project up and running on your local machine, follow these steps:

* Install Node.js from <https://nodejs.org/en/download/>
* To check that Node.js is installed, run the following command in your terminal: `node -v`. If you see a version number, Node.js is installed.
* Add *.env* file under the server folder and add the following connection string to it: `DATABASE_URL="postgresql://<username>:<password>@<host>:<port>/<database>?schema=<schema>"`. Replace:

  * `<username>` with your username for the database.
  * `<password>` with your password for the database.
  * `<host>` with the host for the database.
  * `<port>` with the port for the database.
  * `<database>` with the name of the database.
  * `<schema>` with the name of the schema.

* Once previous steps have been done, run the following command to install the dependencies for the project `npm install`

## Manual

### Starting the server

To start the server, run the following command: `npm run dev`. Now you can try to access the server by going to <http://localhost:3000/ping> in your browser. If you see the text "pong" in your browser, the server is working.

## Extensions

This section contains recomendations for extensions for VS Code.

### ESLint

ESLint is a tool for identifying and reporting on patterns found in ECMAScript/JavaScript code, with the goal of making code more consistent and avoiding bugs. In layman's terms, it's a tool that analyzes your code and points out any errors or bad practices that your code may have.

### GitHub Copilot

GitHub Copilot is an AI pair programmer that helps you write better code. GitHub Copilot draws context from the code you’re working on, suggesting whole lines or entire functions.

### Pretty TypeScript Errors

This extension will format TypeScript errors in a way that is easy to read and understand. It will also add links to the documentation for each error code.

### Prisma

The Prisma extension provides syntax highlighting for Prisma schema files (.prisma) and Prisma Client queries (.ts, .js, .jsx, .tsx).

### Rest Client

REST Client allows you to send HTTP request and view the response in Visual Studio Code directly. Alternatively, you can use Postman to test the server. You can get Postman from <https://www.postman.com/downloads/>.
