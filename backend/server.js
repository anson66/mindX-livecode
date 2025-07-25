const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const corsMiddleware = require('./middleware/cors');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes

app.use('/api/students', require('./routes/students'));

// Basic route
app.get('/', (req, res) => {
  res.json({
    message: 'Todo API is running!',
    version: '1.0.0'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});