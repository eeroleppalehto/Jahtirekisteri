import { Jasen } from "../types";
import { BASE_URL } from "../baseUrl";

const baseUrl = BASE_URL;

async function getAll(): Promise<Jasen[]> {
    const response = await fetch(`${baseUrl}/api/members`);
    const json = await response.json();
    return json;
}

/* async function getOne(id: number): Promise<Jasen> {
    const response = await fetch(`http://localhost:3000/jasen/${id}`);
    const json = await response.json();
    return json;
} */

async function create(jasen: Jasen): Promise<Jasen> {
    // TODO: reading .env variables was not working, so I hardcoded the url here
    const response = await fetch(`${baseUrl}/api/members`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(jasen),
    });
    const json = await response.json();
    return json;
}

async function update(jasen: Jasen): Promise<Jasen> {
    const response = await fetch(`${baseUrl}/api/members/${jasen.jasen_id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(jasen),
    });
    const json = await response.json();
    return json;
}


async function remove(id: number): Promise<void> {
    await fetch(`${baseUrl}/api/members/${id}`, {
        method: 'DELETE',
    });
}

export default { getAll, create, update, remove };