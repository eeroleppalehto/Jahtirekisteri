# DATABASE

The project uses PostgreSQL database version 14.8.

## Database structure

The database schema has drawn in PowerArchitect.

### Tables

Insert table info here

### Function and procedures

Insert info here

### Views

The database has following views:

- **jaetut_lihat**: view for showing name of the group and the amount of meat shared for each group
- **jaetut_ruhon_osat**:  view for showing each shares of meat by portition
- **jako_kaadot**: view for showing the shots meant shared between groups
- **jakoryhma_osuus_maara**: shows group info with the amount of meat shared, the share multiplier and party id
- **jakoryhma_seurueen_nimella**: shows group info with the name of the party
- **jakoryhma_yhteenveto**: shows group info with the amount of meat shared and the share multiplier
- **jasen_tila**: shows jasen info with with first and last name joined together
- **jasenyys_nimella_ryhmalla**: shows membership info with the name of the member and name of the group
- **kaatoluettelo**: shows the list of shots with name of the shooter and nuber of usages
- **kaatoluettelo_indeksilla**: same as kaatoluettelo but with index and additional info of the shot
- **lihan_kaytto**: shows amount of meat meant each usage
- **luvat_kayttamatta_kpl_pros**: shows the amount of unused licenses for each animal type, sex and age.
- **nimivalinta**: shows the full name of the member with the id. Meant for choosing the member in the GUI.
- **ryhmat_jasenilla**: shows groups with mebership info
- **ryhmien_osuudet**: shows groud id and the share multiplier
- **sankey_elain_kasittely**: data for sankey diagram. Shows the amount of meat shared for parties and the amount of meat used for each usage.
- **seurue_lihat**: shows the amount of meat shared for each party
- **seurue_lihat_osuus**: shows the amount of meat shared for each party and the share multiplier for each party
- **seurue_ryhimilla**: shows the name of the party and the name of the group
- **seurue_sankey**: data for sankey diagram. Shows how much meat is shared for each party.
