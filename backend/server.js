require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');

// Initialize the Express application
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
// Enable CORS to allow requests from your React frontend
app.use(cors()); 
// Parse incoming JSON payloads
app.use(express.json()); 

// Mount the API routes
// All routes inside api.js will now be prefixed with '/api'
app.use('/api', apiRoutes);

// Basic health check route to verify the server is running
app.get('/', (req, res) => {
  res.send('EI Assessment API is running...');
});

// Define the port, defaulting to 5000 if not specified in the environment
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});