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
            kayttajatunnus,
            jasen_id,
            salasana_hash,
            roolin_nimi: "luku",
        });
    });

    return users;
};

seedUsers()
    .then((result) => console.log(Promise.resolve(result)))
    .catch((error) => {
        console.error(error);
    });
