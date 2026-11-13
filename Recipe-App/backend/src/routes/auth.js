import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../db/models/User.js'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'

router.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body
    const newUser = new User({ username, password })
    await newUser.save()
    res.status(201).json({ message: 'User created successfully!' })
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Username might already be taken or server error.' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body
    const user = await User.findOne({ username })

    if (!user || user.password !== password) {
      return res.status(400).json({ error: 'Invalid username or password' })
    }

    // Generate JWT token containing user id and username
    const token = jwt.sign(
      { id: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: '1h' },
    )

    // Return the token in response object
    res.status(200).json({ message: 'Logged in successfully!', token, user })
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
