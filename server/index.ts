// Import the required modules
import express from 'express';
import cors from 'cors';
import jasenRouter from './routers/jasenRouter';

import kaatoRouter from './routers/kaatoRouter';
import jakoryhmaRouter from './routers/jakoryhmaRouter';


// Initialize the Express application
const app = express();

// Middleware configurations
// Enable CORS (Cross-Origin Resource Sharing) to allow frontend to connect
app.use(cors());
// Enable the parsing of incoming JSON payloads in request bodies
app.use(express.json());

// Set the port to listen on
const PORT = 3000;

// Routes
app.get('/ping', (_req, res) => {
    console.log('someone pinged here');
    res.send('pong');
});

// Mount the jasenRouter, kaatoRouter to the /api/ path
app.use('/api/members', jasenRouter);
app.use('/api/jakoryhma', jakoryhmaRouter);
app.use('/api/shots', kaatoRouter);


// Start the Express server and listen for incoming requests
app.listen(PORT, () => {
  // Log to console when the server is successfully running
  console.log(`Server running on port ${PORT}`);
});