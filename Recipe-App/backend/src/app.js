import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import { postsRoutes } from './routes/posts.js'
import authRoutes from './routes/auth.js'

const app = express()

app.use(cors())
app.use(express.json())

// Register recipe routes
postsRoutes(app)
app.use('/api/v1/auth', authRoutes)

const dbUri = process.env.DATABASE_URL

mongoose
  .connect(dbUri)
  .then(() => console.log('Connected to MongoDB Atlas successfully!'))
  .catch((err) => console.error('MongoDB connection error:', err))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server is running live on http://localhost:${PORT}`)
})

export default app
