import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getRecipes } from './services/api';
import { CreatePost } from './components/CreatePost.jsx';
import { PostList } from './components/PostList.jsx';
import { PostSorting } from './components/PostSorting.jsx';

export function App() {
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('descending');

  // Fetch recipes using TanStack Query with sorting options
  const { data: recipes = [], isLoading, isError } = useQuery({
    queryKey: ['posts', { sortBy, sortOrder }],
    queryFn: () => getRecipes({ sortBy, sortOrder }),
  });

  return (
    <div style={{ maxWidth: '650px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Real-Time Recipe Sharing App</h1>

      {/* Form to create a new recipe */}
      <CreatePost />

      <hr style={{ margin: '30px 0' }} />

      {/* Feed Header with Sorting */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <h2>Recipe Feed</h2>
        <PostSorting
          fields={['createdAt', 'title']}
          value={sortBy}
          onChange={setSortBy}
          orderValue={sortOrder}
          onOrderChange={setSortOrder}
        />
      </div>

      {/* Loading and Error States */}
      {isLoading && <p>Loading delicious recipes...</p>}
      {isError && <p style={{ color: 'red' }}>Error loading recipes from the server.</p>}
      
      {/* Recipe List Feed */}
      {!isLoading && !isError && <PostList posts={recipes} />}
    </div>
  );
}