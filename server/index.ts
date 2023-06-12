// THIS IS THE ENTRY POINT FOR THE SERVER
// =======================================

// IMPORTS
// =======================================
import express from 'express';
import { RequestHandler } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

// Initialize express app
const app = express();

// Initialize prisma client
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// Listen to port 3000
const PORT = 3000;

// Routes
app.get('/ping', (_req, res) => {
    console.log('someone pinged here');
    res.send('pong');
});

// Get all members
app.get('/api/members', (async (_req, res) => {
    const members = await prisma.jasen.findMany();
    res.json(members);
}) as RequestHandler);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});