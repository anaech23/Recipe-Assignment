import React, { useState, useEffect } from 'react'

export function App() {
  const [recipes, setRecipes] = useState([])
  const [title, setTitle] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [ingredients, setIngredients] = useState('')
  const [steps, setSteps] = useState('')

  // Auth states
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [isLoginView, setIsLoginView] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // Fetch recipes on load
  useEffect(() => {
    fetch('/api/recipes')
      .then((res) => res.json())
      .then((data) => setRecipes(data))
      .catch((err) => console.error('Error fetching recipes:', err))
  }, [])

  // Handle Login / Signup submission
  const handleAuth = async (e) => {
    e.preventDefault()
    const endpoint = isLoginView ? '/api/v1/auth/login' : '/api/v1/auth/signup'
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Authentication failed')

      if (isLoginView) {
        localStorage.setItem('token', data.token)
        setToken(data.token)
        alert('Logged in successfully!')
      } else {
        alert('Signup successful! Please log in.')
        setIsLoginView(true)
      }
      setUsername('')
      setPassword('')
    } catch (err) {
      alert(err.message)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken('')
  }

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
      setRecipes([newRecipe, ...recipes])

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
    <div
      style={{
        padding: '20px',
        fontFamily: 'Lobster',
        color: '#0e0d0d',
        minHeight: '100vh',
        width: '100%',
        boxSizing: 'border-box',
        position: 'relative',
      }}
    >
      <img
        src='https://wallpaperaccess.com/full/680047.jpg'
        alt='Background'
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          zIndex: -1,
        }}
      />

      {/* Authentication Section */}
      <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
        {!token ? (
          <div
            style={{
              border: '2px solid #ffffff',
              padding: '12px 24px',
              borderRadius: '8px',
              display: 'inline-block',
              backgroundColor: 'rgba(255, 255, 255, 0.4)',
              color: '#080808',
              textAlign: 'center',
              marginBottom: '30px',
            }}
          >
            <h3>{isLoginView ? 'Log In' : 'Sign Up'}</h3>
            <form onSubmit={handleAuth}>
              <div style={{ marginBottom: '10px' }}>
                <label>Username:</label>
                <br />
                <input
                  type='text'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '6px',
                    boxSizing: 'border-box',
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    border: '1px solid #ccc',
                    borderRadius: '2px',
                  }}
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>Password:</label>
                <br />
                <input
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '6px',
                    boxSizing: 'border-box',
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    border: '1px solid #ccc',
                    borderRadius: '2px',
                  }}
                />
              </div>
              <button
                type='submit'
                style={{ padding: '8px 16px', cursor: 'pointer' }}
              >
                {isLoginView ? 'Log In' : 'Sign Up'}
              </button>
            </form>
            <p
              style={{ marginTop: '10px', cursor: 'pointer', color: '#0427ec' }}
              onClick={() => setIsLoginView(!isLoginView)}
            >
              {isLoginView
                ? "Don't have an account? Sign up"
                : 'Already have an account? Log in'}
            </p>
          </div>
        ) : (
          <div style={{ marginBottom: '20px' }}>
            <button
              onClick={handleLogout}
              style={{ padding: '6px 12px', cursor: 'pointer' }}
            >
              Log Out
            </button>
          </div>
        )}
      </div>

      {/* Central Content Wrapper (Centers Title, Form, and Feed) */}
      <div
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Boxed Main Title */}
        <h1
          style={{
            border: '2px solid #ffffff',
            padding: '12px 24px',
            borderRadius: '8px',
            display: 'inline-block',
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
            color: '#080808',
            textAlign: 'center',
            marginBottom: '30px',
          }}
        >
          Recipe Share!
        </h1>

        {/* Recipe Creation Form */}
        {token && (
          <form
            onSubmit={handleSubmit}
            style={{
              width: '100%',
              marginBottom: '30px',
              background: '#dbd8d8',
              padding: '20px',
              borderRadius: '8px',
            }}
          >
            <h3>Add a New Recipe</h3>
            <div style={{ marginBottom: '10px' }}>
              <label>Recipe Title:</label>
              <br />
              <input
                type='text'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={{ width: '100%', padding: '6px' }}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Image URL:</label>
              <br />
              <input
                type='text'
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                required
                style={{ width: '100%', padding: '6px' }}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Ingredients (comma-separated):</label>
              <br />
              <textarea
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder='e.g. 2 eggs, butter, salt'
                required
                style={{ width: '100%', padding: '6px' }}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Steps (one step per line):</label>
              <br />
              <textarea
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
                placeholder='1. Crack eggs&#10;2. Whisk well'
                required
                style={{ width: '100%', padding: '6px' }}
              />
            </div>
            <button
              type='submit'
              style={{ padding: '8px 16px', cursor: 'pointer' }}
            >
              Add Recipe
            </button>
          </form>
        )}

        {/* Boxed Recipe Feed Title */}
        <h2
          style={{
            border: '2px solid #ffffff',
            padding: '10px 20px',
            borderRadius: '8px',
            display: 'inline-block',
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
            color: '#080808',
            textAlign: 'center',
            marginBottom: '20px',
          }}
        >
          Recipe Feed
        </h2>

        {/* Recipe Feed List */}
        <div style={{ width: '100%' }}>
          {recipes.map((recipe) => (
            <div
              key={recipe._id}
              style={{
                border: '1px solid #444',
                padding: '15px',
                marginBottom: '15px',
                borderRadius: '8px',
                background: '#dbd8d8',
                width: '100%',
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
    </div>
  )
}

export default App
