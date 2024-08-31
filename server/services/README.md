# Documentation of the `services` Folder

This folder contains service-level functionalities for the Jahtirekisteri server. The services handle the application's business logic and interact with the database as well as other external services.

## Available Services

The table below lists the available services and their corresponding files in the `services` folder. Each service addresses a specific area of functionality:

| Service                 | File                      | Description |
|-------------------------|---------------------------|-------------|
| `UserService`           | `userService.ts`          | Handles user authentication and management. |
| `SeurueService`         | `seurueService.ts`        | Manages hunting parties and their administration. |
| `KaatoService`          | `kaatoService.ts`         | Manages hunting events and related data. |
| `ApiViewService`        | `apiViewService.ts`       | Provides functions for retrieving view data from the database. |
| `JakoryhmaService`      | `jakoryhmaService.ts`     | Contains functions for managing hunting groups. |
| `JakotapahtumaService`  | `jakotapahtumaService.ts` | Handles the management and retrieval of distribution events. |
| `JasenService`          | `jasenService.ts`         | Manages the member registry and member data. |
| `JasenyysService`       | `jasenyysService.ts`      | Deals with memberships and their information. |
| `KaadonkasittelyService`| `kaadonkasittelyService.ts` | Handles the processing of hunting kills and related events. |
| `LupaService`           | `lupaService.ts`          | Manages permits and related operations. |
| `OptionTablesService`   | `optionTablesService.ts`  | Provides access to data in various option tables. |

A detailed description of each service and the functions they provide is described below.

### `UserService` - `userService.ts`
- `createUser`: Creates a new user profile in the database.

### `SeurueService` - `seurueService.ts`
- `createSeurue`: Creates a new hunting party with the provided information.
- `readSeurueById`: Returns the details of a hunting party by its identifier (ID).

### `KaatoService` - `kaatoService.ts`
- `getAllKaato`: Returns a list of all hunting events.
- `createKaato`: Creates a new hunting event record in the database.

### `ApiViewService` - `apiViewService.ts`
- `getViewData`: Retrieves the view data from the database based on the given view name.

### `JakoryhmaService` - `jakoryhmaService.ts`
- `createJakoryhma`: Creates a new hunting group with the provided information.

### `JakotapahtumaService` - `jakotapahtumaService.ts`
- `createJakotapahtuma`: Creates a new distribution event with the provided information.
- `readJakotapahtumaById`: Returns the details of a distribution event by its identifier (ID).

### `JasenService` - `jasenService.ts`
- `getAllJasen`: Returns a list of all members.
- `createJasen`: Creates a new member with the provided information.

### `JasenyysService` - `jasenyysService.ts`
- `createJasenyys`: Creates a new membership with the provided information.
- `readJasenyysById`: Returns the details of a membership by its identifier (ID).

### `KaadonkasittelyService` - `kaadonkasittelyService.ts`
- `createKaadonkasittely`: Creates a new processing event for a hunting kill with the provided information.
- `readKaadonkasittelyById`: Returns the details of a processing event for a hunting kill by its identifier (ID).

### `LupaService` - `lupaService.ts`
- `createLupa`: Creates a new permit with the provided information.

### `OptionTablesService` - `optionTablesService.ts`
- `getAllAikuinenvasa`: Returns all data from the `aikuinenvasa` table in the database.

This documentation is intended as an overview of the contents of the `services` folder and the services it provides. If additional functions are added to each service, the documentation should be updated accordingly.