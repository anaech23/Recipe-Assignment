import PropTypes from 'prop-types'

export function Post({ title, imageUrl, ingredients, author }) {
  return (
    <article style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '15px', backgroundColor: '#fff' }}>
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt={title} 
          style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '4px' }} 
        />
      )}
      
      <h3 style={{ marginTop: '10px', marginBottom: '10px' }}>{title}</h3>
      
      <div>
        <strong>Ingredients:</strong>
        <ul style={{ paddingLeft: '20px', marginTop: '5px' }}>
          {ingredients && ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
      </div>

      {author && (
        <em>
          <br />
          Written by <strong>{typeof author === 'object' ? author.username : author}</strong>
        </em>
      )}
    </article>
  )
}

Post.propTypes = {
  title: PropTypes.string.isRequired,
  imageUrl: PropTypes.string,
  ingredients: PropTypes.arrayOf(PropTypes.string).isRequired,
  author: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      username: PropTypes.string.isRequired,
    }),
  ]),
}