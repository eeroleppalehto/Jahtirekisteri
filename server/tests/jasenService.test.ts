import jasenService from "../services/jasenService";
import { prismaMock } from "../singleton";

// Test for creating a new member
// This test simulates creating a member and expects the service to return the created member's details
test("should create new member", async () => {
    const member = {
        etunimi: "Testi",
        sukunimi: "Esimerkki",
        jakeluosoite: "Testiosoite 123",
        postinumero: "00100",
        postitoimipaikka: "Helsinki",
        puhelinnumero: "0401234567",
        tila: "aktiivinen",
    };

    // Mocking the response of prisma.jasen.create
    prismaMock.jasen.create.mockResolvedValue({ ...member, jasen_id: 1 });

    // Expecting the createMember function to resolve with the correct member data
    await expect(jasenService.createJasen(member)).resolves.toEqual({
        ...member,
        jasen_id: 1,
    });
});

// Test for updating a member's details
// This test checks if the updateMember service correctly updates and returns the updated member details
test("should update a member", async () => {
    const updatedMember = {
        etunimi: "Muokattu",
        sukunimi: "Testi",
        jakeluosoite: "Muokattu Osoite 321",
        postinumero: "00200",
        postitoimipaikka: "Espoo",
        puhelinnumero: "0401234567",
        tila: "poistunut",
    };

    const id = 1; // The ID of the member to be updated

    // Mocking the response of prisma.jasen.update
    prismaMock.jasen.update.mockResolvedValue({
        jasen_id: id,
        ...updatedMember,
    });

    // Expecting the updateMember function to resolve with the updated member data
    await expect(jasenService.updateJasen(id, updatedMember)).resolves.toEqual({
        jasen_id: id,
        ...updatedMember,
    });
});

// Test for deleting a member
// This test checks if the deleteMember service correctly deletes a member
test("should delete a member", async () => {
    const id = 1; // The ID of the member to be deleted

    // Mocking the response of prisma.jasen.delete
    prismaMock.jasen.delete.mockResolvedValue({
        jasen_id: id,
        etunimi: "Poistettu",
        sukunimi: "Jäsen",
        jakeluosoite: "Poisto Osoite 123",
        postinumero: "00300",
        postitoimipaikka: "Vantaa",
        puhelinnumero: "0401234567",
        tila: "poistunut",
    });

    // Expecting the deleteMember function to resolve with the deleted member data
    await expect(jasenService.deleteJasen(id)).resolves.toEqual({
        jasen_id: id,
        etunimi: "Poistettu",
        sukunimi: "Jäsen",
        jakeluosoite: "Poisto Osoite 123",
        postinumero: "00300",
        postitoimipaikka: "Vantaa",
        puhelinnumero: "0401234567",
        tila: "poistunut",
    });
});

// Test for getting all members
// This test checks if the getAllMembers service correctly returns all members
test("should get all members", async () => {
    const members = [
        {
            jasen_id: 1,
            etunimi: "Testi",
            sukunimi: "Esimerkki",
            jakeluosoite: "Testiosoite 123",
            postinumero: "00100",
            postitoimipaikka: "Helsinki",
            puhelinnumero: "0401234567",
            tila: "aktiivinen",
        },
        {
            jasen_id: 2,
            etunimi: "Toinen",
            sukunimi: "Jäsen",
            jakeluosoite: "Toinen Osoite 321",
            postinumero: "00200",
            postitoimipaikka: "Espoo",
            puhelinnumero: "0407654321",
            tila: "poistunut",
        },
    ];

    // Mocking the response of prisma.jasen.findMany
    prismaMock.jasen.findMany.mockResolvedValue(members);

    await expect(jasenService.getAllJasen()).resolves.toEqual(members);
});
