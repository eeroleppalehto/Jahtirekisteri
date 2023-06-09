// THIS IS THE ENTRY POINT FOR THE SERVER
// =======================================

// IMPORTS
// =======================================
import express from 'express';
import cors from 'cors';

// Initialize express app
const app = express();

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

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});