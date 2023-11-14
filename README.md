# hirviporukka
Tietokanta hirven lihan jakamiseen. Suunnitellaan tietokanta ja siihen käyttöliittymä.

## Projektin Yleiskuvaus
Projekti sisältää palvelinpuolen ja käyttöliittymän toteutuksen hirven lihan jakamisen hallinnointiin. Palvelinpuoli on rakennettu Node.js:n ja PostgreSQL:n päälle, ja käyttöliittymä on toteutettu Reactilla.

## Projektin Rakenne
Tässä osiossa kuvataan projektin tärkeimmät tiedostot ja kansiot sekä niiden roolit:
- `.env`: Sisältää ympäristömuuttujat, kuten tietokannan yhteystiedot.
- `.eslintrc`: ESLint-konfiguraatio, joka auttaa koodin laadun varmistamisessa.
- `.gitignore`: Määrittelee, mitkä tiedostot ja kansiot eivät sisälly git-versionhallintaan.
- `client.ts`, `index.ts`, `singleton.ts`: Sovelluksen päälogiikan ja palvelinpuolen käynnistystiedostot.
- `jest.config.js`: Jest-testikonfiguraatio.
- `package-lock.json` ja `package.json`: Projektin riippuvuudet ja skriptit.
- `README.md`: Projektin päädokumentaatio.
- `workJournal.md`, `development.md`, `PostgreSQLYhteydet.md`: Lisäresurssit ja ohjeistukset kehitystyöhön.
- `LICENSE`: Projektin lisenssitiedot.

## Asennus ja Käyttöönotto
- Asennusohjeet ja ohjeet palvelimen käynnistämiseen löytyvät 'Server' `README.md`-tiedostosta.

## Kehityskäytännöt ja -ohjeet
- Tietoa kehitystyökaluista ja koodin laatuvaatimuksista löytyy 'Server' `README.md`-tiedostosta.

## Lisätietoja ja Viittaukset
- Lisätietoja tietokannan rakenteesta, REST API:n dokumentaatiosta ja käyttöliittymän kehityksestä löytyy vastaavista `README.md`-tiedostoista kansioissa, jotka on omistettu näille osa-alueille.

Tämä dokumentti tarjoaa perustiedot projektista ja sen rakenteesta. Lisätietoja löytyy kunkin osa-alueen omista dokumentaatioista.
