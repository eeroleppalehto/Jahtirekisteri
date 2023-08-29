// Import PostgreSQL pool for database connections
import { Pool } from "pg";

// Initialize database pool with connection string from environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Function to create a new Jakoryhma (group)
export const createJakoryhma = async (data: any) => {
  // Destructure the relevant fields from the incoming data
  const { seurue_id, ryhman_nimi } = data;
  // Execute SQL query to insert new Jakoryhma into the database
  // and return its ryhma_id
  const res = await pool.query(
    "INSERT INTO jakoryhma (seurue_id, ryhman_nimi) VALUES ($1, $2) RETURNING ryhma_id",
    [seurue_id, ryhman_nimi]
  );
  return res.rows[0];
};

// Function to get all Jakoryhma (groups)
export const getAllJakoryhma = async () => {
  // Execute SQL query to fetch all Jakoryhma from the database
  const res = await pool.query("SELECT * FROM jakoryhma");
  return res.rows;
};

// Function to read a single Jakoryhma by its ID
export const readJakoryhma = async (id: number) => {
  // Execute SQL query to fetch a specific Jakoryhma by its ryhma_id
  const res = await pool.query(
    "SELECT * FROM jakoryhma WHERE ryhma_id = $1",
    [id]
  );
  return res.rows[0];
};

// Function to update an existing Jakoryhma by its ID
export const updateJakoryhma = async (id: number, data: any) => {
  // Destructure the relevant fields from the incoming data
  const { seurue_id, ryhman_nimi } = data;
  // Execute SQL query to update specific fields of a Jakoryhma
  // by its ryhma_id and return the updated row
  const res = await pool.query(
    "UPDATE jakoryhma SET seurue_id = $1, ryhman_nimi = $2 WHERE ryhma_id = $3 RETURNING *",
    [seurue_id, ryhman_nimi, id]
  );
  return res.rows[0];
};

// Function to delete a Jakoryhma by its ID
export const deleteJakoryhma = async (id: number) => {
  // Execute SQL query to delete a specific Jakoryhma by its ryhma_id
  const res = await pool.query("DELETE FROM jakoryhma WHERE ryhma_id = $1", [
    id,
  ]);
  // Return the number of rows affected (should be 1 if successful)
  return res.rowCount;
};