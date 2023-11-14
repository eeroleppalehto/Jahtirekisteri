import { Context } from '../utils/context';

// Type definition for creating a new member
// This includes all required fields for a new member record
export type JasenCreateInput = {
    etunimi: string;
    sukunimi: string;
    jakeluosoite: string;
    postinumero: string;
    postitoimipaikka: string;
    tila?: string | null;  // Optional field for member status
};

// Type definition for updating an existing member
// Fields are optional, allowing partial updates
export type JasenUpdateInput = {
    etunimi?: string;
    sukunimi?: string;
    jakeluosoite?: string;
    postinumero?: string;
    postitoimipaikka?: string;
    tila?: string | null;  // Optional field for member status
};

// Function to create a new member in the database
// This takes a JasenCreateInput object and the Prisma context
export async function createMember(member: JasenCreateInput, context: Context) {
    return await context.prisma.jasen.create({
        data: member  // The member data to be inserted
    });
}

// Function to update an existing member
// Requires the member's ID and the updated data
export async function updateMember(id: number, member: JasenUpdateInput, context: Context) {
    return await context.prisma.jasen.update({
        where: { jasen_id: id },  // Identifies the member to update
        data: member  // The new data for the member
    });
}

// Function to delete a member from the database
// Requires the member's ID
export async function deleteMember(id: number, context: Context) {
    return await context.prisma.jasen.delete({
        where: { jasen_id: id }  // Identifies the member to delete
    });
}

// Function to retrieve all members from the database
export async function getAllMembers(context: Context) {
    return await context.prisma.jasen.findMany();  // Returns a list of all members
}
