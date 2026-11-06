import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import jwt from 'jsonwebtoken'

// Import models and routes
import { Recipe } from './db/models/Recipe.js'
import authRoutes from './routes/auth.js'

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// Connect to MongoDB Database
const mongoUri =
  process.env.DATABASE_URL || 'mongodb://blog-database:27017/recipe-sharing-app'

mongoose
  .connect(mongoUri)
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch((err) => console.error('MongoDB connection error:', err))

// INLINE AUTHENTICATION MIDDLEWARE
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your_jwt_secret',
    )
    req.user = decoded // Attaches user id and username to the request
    next()
  } catch (err) {
    res.status(403).json({ error: 'Invalid or expired token' })
  }
}

// ROUTES

// Auth routes
app.use('/api/v1/auth', authRoutes)

// Recipe routes
const recipeRouter = express.Router()

// Get all recipes
recipeRouter.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 })
    res.json(recipes)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch recipes' })
  }
})

// Create recipe with automated author ID & steps
recipeRouter.post('/', verifyToken, async (req, res) => {
  try {
    const { title, ingredients, steps, imageUrl } = req.body

    const newRecipe = new Recipe({
      title,
      ingredients,
      steps,
      imageUrl,
      author: req.user.id,
      authorName: req.user.username,
    })

    const savedRecipe = await newRecipe.save()
    res.status(201).json(savedRecipe)
  } catch (err) {
    console.error('Error creating recipe:', err)
    res.status(500).json({ error: 'Failed to create recipe' })
  }
})

// Mount recipe router
app.use('/api/recipes', recipeRouter)

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running live on http://localhost:${PORT}`)
})
