import kayttajaService from "../services/kayttajaService";
import jasenService from "../services/jasenService";
import * as bcrypt from "bcrypt";

/**
 * Seed the 'kayttaja' table by creating a new user
 * from the records in the 'jasen' table
 **/
const seedUsers = async () => {
    const defaultPassword = "salasana";

    console.log("Start the seeding process...");
    const jasenet = await jasenService.getAllJasen();

    const users = jasenet.map(async (jasen) => {
        const { jasen_id, etunimi, sukunimi } = jasen;
        const kayttajatunnus = `${etunimi.toLowerCase()}.${sukunimi.toLowerCase()}`;
        const salasana_hash = await bcrypt.hash(defaultPassword, 10);

        return await kayttajaService.createKayttaja({
            kayttaja_id: jasen_id,
            kayttajatunnus,
            salasana_hash,
        });
    });

    console.log(`Seeded ${users.length} users to the database!`);
    users.forEach((user) => console.log(user));
};

seedUsers()
    .then(() => console.log("End"))
    .catch((error) => {
        console.error(error);
    });
