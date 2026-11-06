import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  ingredients: { 
    type: [String], 
    required: true 
  },
  imageUrl: { 
    type: String, 
    required: true 
  },
  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
});

export const Recipe = mongoose.model('Recipe', recipeSchema);