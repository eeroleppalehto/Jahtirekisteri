import kayttajaService from "../services/kayttajaService";
import jasenService from "../services/jasenService";
import * as bcrypt from "bcrypt";
import { jasen } from "@prisma/client";

/**
 * Seed the 'kayttaja' table by creating a new user
 * from the records in the 'jasen' table
 **/
export const seedUsers = async () => {
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

const addUsers = async () => {
    // const defaultPassword = "salasana";
    const jasenet = await jasenService.getAllJasen();
    const kayttajat = await kayttajaService.getAllKayttaja();

    const resultArray: jasen[] = [];

    kayttajat.forEach((kayttaja) => {
        const jasen = jasenet.find(
            (jasen) => jasen.jasen_id === kayttaja.jasen_id
        );

        if (!jasen) {
            console.log("No member found for user: ", kayttaja.kayttajatunnus);
            return;
        }

        console.log("Member found for user: ", kayttaja.kayttajatunnus);
        resultArray.push(jasen);
    });
    resultArray;
};

// seedUsers()
//     .then((result) => console.log(Promise.resolve(result)))
//     .catch((error) => {
//         console.error(error);
//     });

addUsers()
    .then(() => console.log("asd"))
    .catch((error) => {
        console.error(error);
    });
