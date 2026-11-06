const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import route files
const authRoutes = require('./routes/auth');     
const recipeRoutes = require('./routes/recipes'); 

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());          
app.use(express.json()); 

// Connect to MongoDB Database
mongoose.connect('mongodb://127.0.0.1:27017/recipe-sharing-app')
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Mount Routes
app.use('/api', authRoutes);
app.use('/api', recipeRoutes);

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running live on http://localhost:${PORT}`);
});