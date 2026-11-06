export const getPosts = async (queryParams) => {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/posts?` +
      new URLSearchParams(queryParams),
  )
  if (!res.ok) throw new Error('Failed to fetch posts');
  return await res.json()
}

export const createPost = async (post) => {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/posts`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post),
    },
  )
  if (!res.ok) throw new Error('Failed to create post');
  return await res.json()
}