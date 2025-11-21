// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser')
const path = require("path");
const app = express();

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// CORS configuration
app.use(cors({
  origin: ['https://alphadogsgame.fun'], // Include your frontend URLs
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
  credentials: true,
}));

// CORS configuration development
// app.use(cors({
//   origin: ['https://fd41a419f8e9.ngrok.app', 'http://localhost:3001', 'http://localhost:3005', 'https://4f7681720001.ngrok.app'], // Include your frontend URLs
//   methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
//   credentials: true,
// }));

app.use(express.json());
app.use(cookieParser());


// Import routes
const authRoutes = require('./routes/auth');
const activiRoute = require('./routes/activi')
const claimRoute = require('./routes/tasks');
const adminRoute = require('./routes/admin');
const manageTasksRoute = require('./routes/mangetasks');
const manageUserssRoute = require('./routes/manageusers');
const settingsRoute = require('./routes/settings');
const transactionsRoute = require('./routes/transaction');


// Use routes
app.use('/api', authRoutes, manageTasksRoute, activiRoute, claimRoute, adminRoute, manageUserssRoute, settingsRoute, transactionsRoute);

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// MongoDB Atlas connection
const MONGODB_URI = process.env.MONGODB_URI || 'your_mongodb_atlas_uri';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));


const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});