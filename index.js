const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectDB } = require('./config/db');
const errorHandler = require('./middleware/error');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Route files
const auth = require('./routes/auth');
const books = require('./routes/books');
const reviews = require('./routes/reviews');

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Mount routers
app.use('/', auth);
app.use('/books', books);
app.use('/reviews', reviews);

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log('Server running in development mode on port ${PORT}')
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log('Error: ${err.message}');
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'API is working!' });
});