# Documentation of the `zodSchemas` Folder

The zodSchemas folder contains schema definitions for various entities within the Jahtirekisteri server. These schemas, created using the Zod library, are used for validating data structures and ensuring the integrity of the data before it is processed or stored in the database.

## Available Schemas

The table below lists the available schemas and their corresponding files in the zodSchemas folder. Each schema defines the structure and validation rules for a specific entity within the application:

| zodSchemas              | File                      | Description |
|-------------------------|---------------------------|-------------|
| `JakoryhmaZod`          | `jakoryhmaZod.ts`         | Defines the structure and validation for group entities. |
| `JakotapahtumaZod`      | `jakotapahtumaZod.ts`     | Outlines the schema for distribution event entities. |
| `JasenyysZod`           | `jasenyysZod.ts`          | Details the schema for membership entities. |
| `JasenZod`              | `jasenZod.ts`             | Describes the structure and rules for member entities. |
| `KaadonkasittelyZod`    | `kaadonkasittelyZod.ts`   | Provides the schema for hunting kill processing entities. |
| `KaatoZod`              | `kaatoZod.ts`             | Establishes the schema for hunting catch entities. |
| `LupaZod`               | `lupaZod.ts`              | Sets the validation rules for permit entities. |
| `SeurueZod`             | `seurueZod.ts`            | Constitutes the schema for hunting party entities. |

A detailed description of each schema and the validation rules they enforce is provided below.

### `JakoryhmaZod` - `jakoryhmaZod.ts`
- Defines mandatory numerical identifiers and optional information related to hunting groups.

### `JakotapahtumaZod` - `jakotapahtumaZod.ts`
- Specifies optional event IDs and enforces custom validation for event-related data.

### `JasenyysZod` - `jasenyysZod.ts`
- Validates membership IDs, group and member associations, share percentages, and join dates.

### `JasenZod` - `jasenZod.ts`
- Enforces data formats for names, addresses, postal information, and membership status with custom validation.

### `KaadonkasittelyZod` - `kaadonkasittelyZod.ts`
- Specifies IDs for kill processing and associated hunting events, ensuring correct data structure.

### `KaatoZod` - `kaatoZod.ts`
- Mandates member association, catch dates, and additional details about the hunting event with extended validation logic.

### `LupaZod` - `lupaZod.ts`
- Includes permit line IDs, club associations, and constraints on the animal name's character length.

### `SeurueZod` - `seurueZod.ts`
- Requires club and member IDs, hunting party names, and validates data types and character lengths.

### Schema Updates

#### Recent Changes
- `JakotapahtumaZod`: Updated to use `z.date()` for date fields to ensure consistency with Prisma schema's DateTime type. Added custom validation for the 'osnimitys' field.
- `JasenyysZod`: Adjusted to align with new date formats and validation rules.
- `JakotapahtumaJasenZod`:  Updated similarly to JakotapahtumaZod and JasenyysZod, including the use of z.date() for date fields and any custom validation functions or rules that were added or modified.

These schema files are essential for maintaining high data quality standards and preventing invalid data from entering the system. They provide a clear contract for data structures across the application, thereby facilitating reliable and consistent data handling.