import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { createPost } from '../api/posts.js' 

export function CreatePost() {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [ingredientsInput, setIngredientsInput] = useState('')
  
  const queryClient = useQueryClient()
  
  const createPostMutation = useMutation({
    mutationFn: () => {
      const ingredients = ingredientsInput.split(',').map((item) => item.trim()).filter(Boolean)
      return createPost({ title, author, ingredients, imageUrl })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['posts'])
      setTitle('')
      setAuthor('')
      setImageUrl('')
      setIngredientsInput('')
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    createPostMutation.mutate()
  }

  return (
    <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
      <h3>🍳 Add a New Recipe</h3>
      
      <div>
        <label htmlFor='create-title'>Recipe Title: </label>
        <br />
        <input
          type='text'
          name='create-title'
          id='create-title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <br />

      <div>
        <label htmlFor='create-author'>Author ID / Username: </label>
        <br />
        <input
          type='text'
          name='create-author'
          id='create-author'
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
      </div>
      <br />

      <div>
        <label htmlFor='create-image'>Image URL: </label>
        <br />
        <input
          type='url'
          name='create-image'
          id='create-image'
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder='https://example.com/recipe.jpg'
          required
        />
      </div>
      <br />

      <div>
        <label htmlFor='create-ingredients'>Ingredients (comma-separated): </label>
        <br />
        <textarea
          id='create-ingredients'
          value={ingredientsInput}
          onChange={(e) => setIngredientsInput(e.target.value)}
          placeholder='e.g., 2 cups flour, 1 tsp salt, 3 eggs'
          rows='3'
          required
        />
      </div>
      <br />

      <input
        type='submit'
        value={createPostMutation.isPending ? 'Creating Recipe...' : 'Add Recipe'}
        disabled={!title || !ingredientsInput || !imageUrl || createPostMutation.isPending}
      />

      {createPostMutation.isSuccess ? (
        <p style={{ color: 'green', marginTop: '10px' }}>Recipe created successfully!</p>
      ) : null}

      {createPostMutation.isError ? (
        <p style={{ color: 'red', marginTop: '10px' }}>Failed to create recipe. Please try again.</p>
      ) : null}
    </form>
  )
}