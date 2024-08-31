# Server API Manual for Jahtirekisteri Application

## Introduction

This manual provides detailed documentation of the Jahtirekisteri application's server API. It includes functionalities of various API endpoints, their request and response formats, and general operational guidelines. Version: 1.0

### General API Instructions

As of writing this manual, the API is not yet deployed to a production environment. If you wish to test the API, you can run it locally by following the instructions in the [README](README.md) file. The current API is accessible at <http://localhost:5000/api/v1>.

- HTTP Methods: Utilize GET, POST, PUT, DELETE appropriately.
- Authentication: As of writing this manual, the API does not require authentication.
- Responses: All responses are in JSON format.

### API Endpoints

All endpoints listed below are prefixed with `/api/v1`.

#### /views

This endpoint is used to access the views of the database. The views are used to provide data for the application's front-end. The views are read-only, and cannot be modified through the API. To see the list of available views, check the [viewMap.ts](/utils/viewMap.ts) file. Trying to access a view that is not listed in the viewMap will result in a 404 error.

To access a view, use the following format: `/views/?name=<viewName>`. For example, to access the `nimivalinta` view, use `/views/?name=nimivalinta`. Additionally some views support filtering. To filter a view, use the following format: `/views/?name=<viewName>&column=<columnName>&value=<valueToFilter>`. For example, to filter the `mobiili_ryhma_sivu` view by the `jakoryhma.ryhma_id` column, use `/views/?name=mobiili_ryhma_sivu&column=jakoryhma.ryhma_id&value=1`. The allowed values for the `column` parameter are listed in the [columnValidation.ts](/zodSchemas/columnValidation.ts) file. The value parameter only supports integers.

#### /members

This endpoint is used to access the members of the database. The endpoint supports GET, POST, PUT, and DELETE methods. To get all members, use the GET method. To read, update or delete a single member, add the member's id to the end of the endpoint. For example, to get the member with id 1, use `/members/1`. When using the POST or PUT methods, the request body must contain a JSON object with the correct format.

##### Example of member JSON Format

```json
{
    "etunimi": "Matti",
    "sukunimi": "Meikäläinen",
    "jakeluosoite": "1990-01-01", // optional
    "postinumero": "12345", // optional
    "postitoimipaikka": "Helsinki", // optional
    "puhelinnumero": "0401234567", // optional
}
```

#### /groups

This endpoint is used to access the groups of the database. The endpoint supports GET, POST, PUT, and DELETE methods. To get all groups, use the GET method. To read, update or delete a single group, add the group's id to the end of the endpoint. For example, to get the group with id 1, use `/groups/1`. When using the POST or PUT methods, the request body must contain a JSON object with the correct format.

##### Example of group JSON Format

```json
{
    "ryhman_nimi": "Ryhmä 1:n kuvaus",
    "seurue_id": 1,
}
```

#### /shots

This endpoint is used to access the shots of the database. The endpoint supports GET, POST, PUT, and DELETE methods. To get all shots, use the GET method. To read, update or delete a single shot, add the shot's id to the end of the endpoint. For example, to get the shot with id 1, use `/shots/1`. When using the POST or PUT methods, the request body must contain a JSON object with the correct format.

##### Example of shot JSON Format

```json
{
    "jasen_id": 1,
    "kaatopaiva": "2021-01-01T00:00:00.000Z",
    "ruhopaino": 100,
    "paikka_teksti": "Kuvaus",
    "paikka_koordinaatti": "123.456, 123.456",
    "elaimen_nimi": "Hirvi",
    "sukupuoli": "Uros",
    "ikaluokka": "Aikuinen",
    "lisatieto": "Kuvaus", // optional
}
```

#### /shares

This endpoint is used to access the shares of the database. The endpoint supports GET, POST, PUT, and DELETE methods. To get all shares, use the GET method. To read, update or delete a single share, add the share's id to the end of the endpoint. For example, to get the share with id 1, use `/shares/1`. When using the POST or PUT methods, the request body must contain a JSON object with the correct format.

##### Example of share JSON Format

```json
{
    "paiva": "2021-01-01T00:00:00.000Z",
    "ryhma_id": 1,
    "osnimitys": "Koko",
    "kaadon_kasittely_id": 1,
    "maara": 123.5,
}
```

#### /shot-usages

This endpoint is used to access the shot usages of the database. The endpoint supports GET, POST, PUT, and DELETE methods. To get all shot usages, use the GET method. To read, update or delete a single shot usage, add the shot usage's id to the end of the endpoint. For example, to get the shot usage with id 1, use `/shot-usages/1`. When using the POST or PUT methods, the request body must contain a JSON object with the correct format.

##### Example of shot usage JSON Format

```json
{
    "kaato_id": 1,
    "kasittelyid": 1,
    "kasittelyn_maara": 100, // integer between 0 and 100
}
```

#### /licenses

This endpoint is used to access the licenses of the database. The endpoint supports GET, POST, PUT, and DELETE methods. To get all licenses, use the GET method. To read, update or delete a single license, add the license's id to the end of the endpoint. For example, to get the license with id 1, use `/licenses/1`. When using the POST or PUT methods, the request body must contain a JSON object with the correct format.

##### Example of license JSON Format

```json
{
    "seura_id": 1,
    "lupavuosi": "2021",
    "elaimen_nimi": "Hirvi",
    "sukupuoli": "Uros",
    "ikaluokka": "Aikuinen",
    "maara": 100,
}
```

#### /parties

This endpoint is used to access the parties of the database. The endpoint supports GET, POST, PUT, and DELETE methods. To get all parties, use the GET method. To read, update or delete a single party, add the party's id to the end of the endpoint. For example, to get the party with id 1, use `/parties/1`. When using the POST or PUT methods, the request body must contain a JSON object with the correct format.

##### Example of party JSON Format

```json
{
    "seura_id": 2,
    "seurueen_nimi": "Seurue 1:n kuvaus",
    "jasen_id": 1,
    "seurueen_tyyppi_id": 1,
}
```

#### /memberships

This endpoint is used to access the memberships of the database. The endpoint supports GET, POST, PUT, and DELETE methods. To get all memberships, use the GET method. To read, update or delete a single membership, add the membership's id to the end of the endpoint. For example, to get the membership with id 1, use `/memberships/1`. When using the POST or PUT methods, the request body must contain a JSON object with the correct format.

##### Example of membership JSON Format

```json
{
    "ryhma_id": 1,
    "jasen_id": 1,
    "osuus": 100, // integer between 0 and 100
    "liittyi": "2021-01-01T00:00:00.000Z",
    "poistui": "2021-01-01T00:00:00.000Z", // optional, leave out if member is still in the group
    "seurue_id": 1,
}
```

#### /member-shares

This endpoint is used to access the member shares of the database. The endpoint supports GET, POST, PUT, and DELETE methods. To get all member shares, use the GET method. To read, update or delete a single member share, add the member share's id to the end of the endpoint. For example, to get the member share with id 1, use `/member-shares/1`. When using the POST or PUT methods, the request body must contain a JSON object with the correct format.

##### Example of member share JSON Format

```json
{
    "paiva": "2021-01-01T00:00:00.000Z",
    "jasenyys_id": 1,
    "osnimitys": "Koko",
    "kaadon_kasittely_id": 1,
    "maara": 123.5,
}
```

#### /shot-with-usages

This endpoint only supports POST method. It is used to create a new shot and its usages in a single request. The request body must contain a JSON object with the correct format.

##### Example of shot with usages JSON Format

```json
{
    "shot": {
        "jasen_id": 1,
        "kaatopaiva": "2021-01-01T00:00:00.000Z",
        "ruhopaino": 100,
        "paikka_teksti": "Kuvaus",
        "paikka_koordinaatti": "123.456, 123.456",
        "elaimen_nimi": "Hirvi",
        "sukupuoli": "Uros",
        "ikaluokka": "Aikuinen",
        "lisatieto": "Kuvaus", // optional
    },
    "usages": [ // at least 1 usage must be provided
        
        {
            "kasittelyid": 1,
            "kasittelyn_maara": 50, // integer between 0 and 100, must add up to 100 with the other usages
        },
        {
            "kasittelyid": 2,
            "kasittelyn_maara": 50, // integer between 0 and 100
        }
    ]
}
```

#### /option-tables

This endpoint is used to access the option tables meant for option selection fields in the application's front-end. The endpoint supports only supports GET method. This endpoint itself does not hold any methods, but under it there are endpoints for each option table. To access an option table, use the following format: `/option-tables/<optionTableName>`. For example, to access the `animal` option table, use `/option-tables/animal`.

##### List of option tables

| endpoint | table in database |
| --- | --- |
| /option-tables/animal | elain |
| /option-tables/ages | ikaluokka |
| /option-tables/usages | kasittely |
| /option-tables/portions | ruhonosa |
| /option-tables/genders | sukupuoli |
| /option-tables/party-types | seurue_tyyppi |

## Error Cases

On error cases, the API will return status code of 4XX or 5XX, and a JSON object with the following format:

```json
{    
    "success": false, // always false on error cases, might drop this in the future
    "errorType": "Type of error, eg. 'notFound', 'zodError', 'databaseError', 'unknownError'",
    "errorMessage": "Error message",
    "errorDetails": "Error details, eg. 'Column 'jasen_id' cannot be null'"
}
```
