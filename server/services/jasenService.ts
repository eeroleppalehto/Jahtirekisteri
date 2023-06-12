import prisma from "../client";
import { jasenInput } from "../zodSchemas/jasenZod";

const getAllJasen = async () => {
    const jasenet = await prisma.jasen.findMany();
    return jasenet;
};

const createJasen = async (object: unknown) => {
    const data = jasenInput.parse(object);
    const { etunimi, sukunimi, jakeluosoite, postinumero, postitoimipaikka, tila } = data;
    const jasen = await prisma.jasen.create({
        data: {
            etunimi,
            sukunimi,
            jakeluosoite,
            postinumero,
            postitoimipaikka,
            tila,
        }
    });

    return jasen;
};

const updateJasen = async (id: number, object: unknown) => {
    const data = jasenInput.parse(object);

    const { etunimi, sukunimi, jakeluosoite, postinumero, postitoimipaikka, tila } = data;

    const jasen = await prisma.jasen.update({
        where: 
            { jasen_id: id },
        data: {
            etunimi,
            sukunimi,
            jakeluosoite,
            postinumero,
            postitoimipaikka,
            tila,
        }
    });

    return jasen;
};

const deleteJasen = async (id: number) => {
    const jasen = await prisma.jasen.delete({
        where: { jasen_id: id }
    });

    return jasen;
};

export default { getAllJasen, createJasen, updateJasen, deleteJasen };