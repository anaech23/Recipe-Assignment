import jwt from 'jsonwebtoken'

import {
  listAllPosts,
  listPostsByAuthor,
  listPostsByTag,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from '../services/posts.js'

export function postsRoutes(app) {
  // GET all recipes
  app.get('/api/v1/posts', async (req, res) => {
    const { sortBy, sortOrder, author, tag } = req.query
    const options = { sortBy, sortOrder }

    try {
      if (author && tag) {
        return res
          .status(400)
          .json({ error: 'query by either author or tag, not both' })
      } else if (author) {
        return res.json(await listPostsByAuthor(author, options))
      } else if (tag) {
        return res.json(await listPostsByTag(tag, options))
      } else {
        return res.json(await listAllPosts(options))
      }
    } catch (err) {
      console.error('Error listing recipes:', err)
      return res.status(500).json({ error: err.message })
    }
  })

  // GET one recipe
  app.get('/api/v1/posts/:id', async (req, res) => {
    try {
      const post = await getPostById(req.params.id)

      if (post === null) {
        return res.status(404).json({ error: 'Recipe not found' })
      }

      return res.json(post)
    } catch (err) {
      console.error('Error getting recipe:', err)
      return res.status(500).json({ error: err.message })
    }
  })

  // CREATE a recipe
  app.post('/api/v1/posts', async (req, res) => {
    try {
      const authHeader = req.headers.authorization

      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({
          error: 'Please log in first',
        })
      }

      const token = authHeader.split(' ')[1]

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'your_jwt_secret',
      )

      const post = await createPost({
        title: req.body.title,
        ingredients: req.body.ingredients,
        steps: req.body.steps,
        imageUrl: req.body.imageUrl,
        author: decoded.id,
        authorName: decoded.username,
      })

      return res.status(201).json(post)
    } catch (err) {
      console.error('RECIPE CREATION ERROR:', err)

      return res.status(500).json({
        error: err.message,
      })
    }
  })

  // UPDATE a recipe
  app.patch('/api/v1/posts/:id', async (req, res) => {
    try {
      const post = await updatePost(req.params.id, req.body)

      if (!post) {
        return res.status(404).json({ error: 'Recipe not found' })
      }

      return res.json(post)
    } catch (err) {
      console.error('Error updating recipe:', err)
      return res.status(500).json({ error: err.message })
    }
  })

  // DELETE a recipe
  app.delete('/api/v1/posts/:id', async (req, res) => {
    try {
      const { deletedCount } = await deletePost(req.params.id)

      if (deletedCount === 0) {
        return res.status(404).json({ error: 'Recipe not found' })
      }

      return res.status(204).end()
    } catch (err) {
      console.error('Error deleting recipe:', err)
      return res.status(500).json({ error: err.message })
    }
  })
}
