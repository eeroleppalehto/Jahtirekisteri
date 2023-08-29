// Import the required modules
import express from 'express';
import cors from 'cors';
import jasenRouter from './routers/jasenRouter';
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

// Routing
// Mount the jasenRouter for handling member-related routes under /api/members
app.use('/api/members', jasenRouter);
// Mount the jakoryhmaRouter for handling group-related routes under /api/jakoryhma
app.use('/api/jakoryhma', jakoryhmaRouter);

// Start the Express server and listen for incoming requests
app.listen(PORT, () => {
  // Log to console when the server is successfully running
  console.log(`Server running on port ${PORT}`);
});