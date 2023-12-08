# Server API Manual for Jahtirekisteri Application

## Introduction

This manual provides detailed documentation of the Jahtirekisteri application's server API. It includes functionalities of various API endpoints, their request and response formats, and general operational guidelines. Version: 1.0

### General API Instructions

- HTTP Methods: Utilize GET, POST, PUT, DELETE appropriately.
- Authentication: Ensure proper authentication for secured endpoints. Use Bearer tokens in the Authorization header for authenticated requests.
- Responses: Typically returned in JSON format.

### API Endpoints

API View Service **apiViewRouter.ts**
- Endpoint: GET /apiView
- Description: Retrieves data from specific database views.
- Request Parameters: name, column (optional), value (optional).
- Request Example: GET /apiView?name=viewName&column=columnName&value=filterValue
- Response Example: { "data": [ ... ] }

Shot Usage Creation **createShotUsageRouter.ts**
- Endpoint: POST /shotUsage
- Description: Records shot usage details.
- Request Example: POST /shotUsage with JSON body { "shotData": {...} }
- Response Example: { "shotUsage": {...} }

Hunting Groups Management **groupsRouter.ts**
Endpoints:
- GET /groups - Retrieve all groups.
- POST /groups - Create a new group.
- PUT /groups/:id - Update a specific group.
- DELETE /groups/:id - Delete a specific group.
- Response Example: { "groups": [ ... ] } or { "group": {...} }

Licenses Management **licensesRouter.ts**
- Endpoints: Similar structure as Hunting Groups Management.
- Response Example: { "license": {...} } or { "message": "License updated successfully" }

Member Shares Management **memberSharesRouter.ts**
- Endpoints: Similar structure as Hunting Groups Management.
- Response Example: { "memberShares": [ ... ] } or { "message": "Share deleted successfully" }

Memberships Management **membershipsRouter.ts**
Endpoints:
- GET /memberships - Retrieve all memberships.
- POST /memberships - Create a new membership.
- PUT /memberships/:id - Update a specific membership.
- DELETE /memberships/:id - Delete a specific membership.
- Response Example: { "memberships": [ ... ] } or { "membership": {...} }

Members Management **membersRouter.ts**
Endpoints:
- GET /members - Retrieve all members.
- POST /members - Create a new member.
- PUT /members/:id - Update a specific member.
- DELETE /members/:id - Delete a specific member.
- Response Example: { "members": [ ... ] } or { "member": {...} }

Option Tables Access **optionTablesRouter.ts**
Endpoints:
- GET /optionTables/ages - Fetch age options.
- GET /optionTables/animals - Fetch animal options.
- GET /optionTables/usages - Fetch usage options.
- GET /optionTables/portions - Fetch portion options.
- GET /optionTables/genders - Fetch gender options.
- GET /optionTables/party-types - Fetch party type options.
- Response Example: { "options": [ ... ] }

Hunting Parties Management **partiesRouter.ts**
Endpoints:
- GET /parties - Retrieve all parties.
- POST /parties - Create a new party.
- PUT /parties/:id - Update a specific party.
- DELETE /parties/:id - Delete a specific party.
- Response Example: { "parties": [ ... ] } or { "party": {...} }

Share Events Management **sharesRouter.ts**
Endpoints:
- GET /shares - Retrieve all share events.
- POST /shares - Create a new share event.
- PUT /shares/:id - Update a specific share event.
- DELETE /shares/:id - Delete a specific share event.
- Response Example: { "shares": [ ... ] } or { "shareEvent": {...} }

Hunting Catches Management **shotsRouter.ts**
Endpoints:
- GET /shots - Retrieve all hunting catches.
- POST /shots - Create a new hunting catch.
- PUT /shots/:id - Update a specific hunting catch.
- DELETE /shots/:id - Delete a specific hunting catch.
- Response Example: { "catches": [ ... ] } or { "catch": {...} }

Shot Usages Management **shotUsagesRouter.ts**
Endpoints:
- GET /shotUsages - Retrieve all shot usage entries.
- POST /shotUsages - Create a new shot usage entry.
- PUT /shotUsages/:id - Update a specific shot usage entry.
- DELETE /shotUsages/:id - Delete a specific shot usage entry.
- Response Example: { "shotUsages": [ ... ] } or { "shotUsage": {...} }

### Error Handling

Overview: The API provides error responses with appropriate HTTP status codes and error messages.

Error Response Examples:
- 400 Bad Request: { "error": "Invalid request data" }
- 401 Unauthorized: { "error": "Authentication required" }
- 404 Not Found: { "error": "Resource not found" }
- 500 Internal Server Error: { "error": "Internal server error" }