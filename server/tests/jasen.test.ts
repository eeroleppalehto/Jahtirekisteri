import { createMember, updateMember, deleteMember, getAllMembers } from '../services/jasenHallintaService';
import { MockContext, Context, createMockContext } from '../utils/context';

let mockCtx: MockContext;
let ctx: Context;

// Initialize mock context before each test
beforeEach(() => {
    mockCtx = createMockContext();
    ctx = mockCtx as unknown as Context;
});

// Test for creating a new member
// This test simulates creating a member and expects the service to return the created member's details
test('should create new member', async () => {
    const member = {
        // Member data to be created
        etunimi: 'Testi',
        sukunimi: 'Esimerkki',
        jakeluosoite: 'Testiosoite 123',
        postinumero: '00100',
        postitoimipaikka: 'Helsinki',
        tila: 'aktiivinen'
    };

    // Mocking the response of prisma.jasen.create
    mockCtx.prisma.jasen.create.mockResolvedValue({
        jasen_id: 1, // Simulated database-generated ID
        ...member
    });

    // Expecting the createMember function to resolve with the correct member data
    await expect(createMember(member, ctx)).resolves.toEqual({
        jasen_id: 1,
        ...member
    });
});

// Test for updating a member's details
// This test checks if the updateMember service correctly updates and returns the updated member details
test('should update a member', async () => {
    const updatedMember = {
        // Updated member data
        etunimi: 'Muokattu',
        sukunimi: 'Testi',
        jakeluosoite: 'Muokattu Osoite 321',
        postinumero: '00200',
        postitoimipaikka: 'Espoo',
        tila: 'passiivinen'
    };

    const id = 1; // The ID of the member to be updated

    // Mocking the response of prisma.jasen.update
    mockCtx.prisma.jasen.update.mockResolvedValue({
        jasen_id: id,
        ...updatedMember
    });

    // Expecting the updateMember function to resolve with the updated member data
    await expect(updateMember(id, updatedMember, ctx)).resolves.toEqual({
        jasen_id: id,
        ...updatedMember
    });
});

// Test for deleting a member
// This test ensures that the deleteMember service correctly deletes and returns the details of the deleted member
test('should delete a member', async () => {
    const id = 1; // The ID of the member to be deleted

    // Mocking the response of prisma.jasen.delete
    mockCtx.prisma.jasen.delete.mockResolvedValue({
        jasen_id: id,
        // Simulated response data for the deleted member
        etunimi: 'Poistettu',
        sukunimi: 'Jäsen',
        jakeluosoite: 'Poisto Osoite 123',
        postinumero: '00300',
        postitoimipaikka: 'Vantaa',
        tila: 'poistettu'
    });

    // Expecting the deleteMember function to resolve with the details of the deleted member
    await expect(deleteMember(id, ctx)).resolves.toEqual({
        jasen_id: id,
        etunimi: 'Poistettu',
        sukunimi: 'Jäsen',
        jakeluosoite: 'Poisto Osoite 123',
        postinumero: '00300',
        postitoimipaikka: 'Vantaa',
        tila: 'poistettu'
    });
});

// Test for listing all members
// This test verifies that the getAllMembers service correctly returns a list of all members
test('should list all members', async () => {
    const members = [
        // Simulated list of members
        { jasen_id: 1, etunimi: 'Testi', sukunimi: 'Esimerkki', jakeluosoite: 'Testiosoite 123', postinumero: '00100', postitoimipaikka: 'Helsinki', tila: 'aktiivinen' },
        { jasen_id: 2, etunimi: 'Toinen', sukunimi: 'Testi', jakeluosoite: 'Testiosoite 456', postinumero: '00200', postitoimipaikka: 'Espoo', tila: 'passiivinen' }
    ];

    // Mocking the response of prisma.jasen.findMany
    mockCtx.prisma.jasen.findMany.mockResolvedValue(members);

    // Expecting the getAllMembers function to resolve with the list of members
    await expect(getAllMembers(ctx)).resolves.toEqual(members);
});
