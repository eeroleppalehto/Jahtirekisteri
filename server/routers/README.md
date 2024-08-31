# Documentation of the routers Folder
The routers folder contains router definitions for various functionalities within the Jahtirekisteri server. These routers define the URL endpoints and their respective handlers, managing tasks such as member management, harvest processing, and permit management.

## Prerequisites
Before you can use these routers, make sure you have the following software and their versions installed:

Node.js: 18.16.x
Python: 3.10.x
PostgreSQL: 14.8

You can find more information about the installation and configuration of the development environment in the README.md file in the server folder.

### Installation instructions
More detailed installation instructions and starting the server can be found in the README.md file in the server folder.

### Environment Variables
When configuring the .env file under the server folder, replace the placeholder values with your actual database credentials. It's crucial to keep your database credentials secure and never share them publicly or commit them to version control. Always follow your organization's security policies and best practices for handling sensitive information.

### Example requests

To make requests to the server, you can use `curl` command in the terminal or any HTTP client of your choice. Below are examples of using `curl` to make requests to the server.

```sh
# Retrieves all harvest processing information
curl -X GET http://localhost:3000/api/shot-usages

# Retrieves individual harvest processing information based on ID
curl -X GET http://localhost:3000/api/shot-usages/{id}

Replace {id} with the actual ID of the harvest processing entry you wish to retrieve. Ensure that you have installed and configured all necessary dependencies and that your server is running.


### Available Routers

The table below lists the available routers and their corresponding files in the routers folder:

| Router                  | File                        | Description |
|-------------------------|-----------------------------|-------------|
| `ApiViewRouter`         | `apiViewRouter.ts`          | Manages the retrieval of view data. |
| `GroupsRouter`          | `groupsRouter.ts`           | Provides functionalities for managing groups. |
| `SharesRouter`          | `sharesRouter.ts`           | Handles the management of distribution events. |
| `MembersRouter`         | `membersRouter.ts`          | Manages member information. |
| `MembershipsRouter`     | `membershipsRouter.ts`      | Handles membership information. |
| `ShotUsagesRouter`      | `shotUsagesRouter.ts`       | Manages harvest processing information. |
| `ShotsRouter`           | `shotsRouter.ts`            | Manages harvest data. |
| `LicensesRouter`        | `licensesRouter.ts`         | Handles permit information. |
| `OptionTablesRouter`    | `optionTablesRouter.ts`     | Offers listings from helper option tables. |
| `PartiesRouter`         | `partiesRouter.ts`          | Manages hunting party information. |


### `ShotUsagesRouter - shotUsagesRouter.ts`
- GET /: Returns all the harvest processing entries.
- GET /:id: Retrieves a single harvest processing entry by its ID.
- POST /: Creates a new harvest processing entry.
- PUT /:id: Updates an existing harvest processing entry.
- DELETE /:id: Deletes a harvest processing entry.

### `ShotsRouter - shotsRouter.ts`
- GET /: Retrieves all harvest entries.
- POST /: Creates a new harvest entry.
- PUT /:id: Updates an existing harvest entry.
- DELETE /:id: Deletes a harvest entry.

### `LicensesRouter - licensesRouter.ts`
- GET /: Lists all permits.
- GET /:id: Retrieves a permit entry by its ID.
- POST /: Creates a new permit.
- PUT /:id: Updates an existing permit.
- DELETE /:id: Deletes a permit.

### `OptionTablesRouter` - `optionTablesRouter.ts`
- GET /aikuinenvasa: Fetches all records from the 'aikuinenvasa' table.
- GET /elain: Fetches all records from the 'elain' table.
- GET /kasittely: Fetches all records from the 'kasittely' table.
- GET /ruhonosa: Fetches all records from the 'ruhonosa' table.
- GET /sukupuoli: Fetches all records from the 'sukupuoli' table.

### `PartiesRouter - partiesRouter.ts`
- GET /: Lists all hunting parties.
- GET /:id: Retrieves a hunting party by its ID.
- POST /: Creates a new hunting party.
- PUT /:id: Updates a hunting party's details.
- DELETE /:id: Deletes a hunting party.

This documentation provides a comprehensive overview of the routers in the routers folder and the endpoints they offer. Each router is designed to facilitate the management of certain resources in accordance with REST architecture principles.