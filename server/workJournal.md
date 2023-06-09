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
