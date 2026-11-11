import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json())

const dbUri = process.env.DATABASE_URL

mongoose
  .connect(dbUri)
  .then(() => console.log('Connected to MongoDB Atlas successfully!'))
  .catch((err) => console.error('MongoDB connection error:', err))

const PORT = 5000
app.listen(PORT, () => {
  console.log(`Server is running live on http://localhost:${PORT}`)
})

export default app
