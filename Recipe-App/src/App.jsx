import React, { useState, useEffect } from 'react'

function App() {
  const [recipes, setRecipes] = useState([])
  const [title, setTitle] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [ingredients, setIngredients] = useState('')
  const [steps, setSteps] = useState('') // Added steps state

  // Simple auth state check
  const token = localStorage.getItem('token')

  // Fetch recipes on load
  useEffect(() => {
    fetch('/api/recipes')
      .then((res) => res.json())
      .then((data) => setRecipes(data))
      .catch((err) => console.error('Error fetching recipes:', err))
  }, [])

  // Handle recipe submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          imageUrl,
          ingredients: ingredients.split(',').map((i) => i.trim()),
          steps: steps.split('\n').map((s) => s.trim()),
        }),
      })

      if (!response.ok) throw new Error('Failed to create recipe')

      const newRecipe = await response.json()
      setRecipes([newRecipe, ...recipes]) // Add to feed

      // Clear form fields
      setTitle('')
      setImageUrl('')
      setIngredients('')
      setSteps('')
    } catch (err) {
      console.error(err)
      alert('Failed to create recipe. Please try again.')
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Real-Time Recipe Sharing App</h1>

      {/* Recipe Creation Form */}
      {token ? (
        <form
          onSubmit={handleSubmit}
          style={{
            marginBottom: '30px',
            background: '#f4f4f4',
            padding: '20px',
            borderRadius: '8px',
          }}
        >
          <h3>Add a New Recipe</h3>
          <div>
            <label>Recipe Title:</label>
            <br />
            <input
              type='text'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Image URL:</label>
            <br />
            <input
              type='text'
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Ingredients (comma-separated):</label>
            <br />
            <textarea
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder='e.g. 2 eggs, butter, salt'
              required
            />
          </div>
          <div>
            <label>Steps (one step per line):</label>
            <br />
            <textarea
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              placeholder='1. Crack eggs&#10;2. Whisk well&#10;3. Cook on medium heat'
              required
            />
          </div>
          <button
            type='submit'
            style={{ marginTop: '10px', padding: '8px 16px' }}
          >
            Add Recipe
          </button>
        </form>
      ) : (
        <p>Please log in to add a recipe.</p>
      )}

      {/* Recipe Feed */}
      <h2>Recipe Feed</h2>
      <div>
        {recipes.map((recipe) => (
          <div
            key={recipe._id}
            style={{
              border: '1px solid #ddd',
              padding: '15px',
              marginBottom: '15px',
              borderRadius: '8px',
            }}
          >
            <h3>{recipe.title}</h3>
            {recipe.imageUrl && (
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                style={{
                  maxWidth: '200px',
                  display: 'block',
                  marginBottom: '10px',
                }}
              />
            )}
            <p>
              <strong>Author:</strong> {recipe.authorName || 'Anonymous'}
            </p>

            <p>
              <strong>Ingredients:</strong>
            </p>
            <ul>
              {recipe.ingredients.map((ing, idx) => (
                <li key={idx}>{ing}</li>
              ))}
            </ul>

            <p>
              <strong>Steps:</strong>
            </p>
            <ol>
              {recipe.steps &&
                recipe.steps.map((step, idx) => <li key={idx}>{step}</li>)}
            </ol>
          </div>
        ))}
      </div>
    </div>
  )
}

export function App()
