import { Recipe } from '../db/models/Recipe.js'

export async function createPost({ title, author, ingredients, instructions, imageUrl, tags }) {
  const recipe = new Recipe({ 
    title, 
    author, 
    ingredients, 
    instructions, 
    imageUrl, 
    tags 
  })
  return await recipe.save()
}

async function listPosts(
  query = {},
  { sortBy = 'createdAt', sortOrder = 'descending' } = {},
) {
  return await Recipe.find(query).populate('author', 'username').sort({ [sortBy]: sortOrder })
}

export async function listAllPosts(options) {
  return await listPosts({}, options)
}

export async function listPostsByAuthor(author, options) {
  return await listPosts({ author }, options)
}

export async function listPostsByTag(tags, options) {
  return await listPosts({ tags }, options)
}

export async function getPostById(postId) {
  return await Recipe.findById(postId).populate('author', 'username')
}

export async function updatePost(postId, { title, ingredients, instructions, imageUrl, tags }) {
  return await Recipe.findOneAndUpdate(
    { _id: postId },
    { $set: { title, ingredients, instructions, imageUrl, tags } },
    { new: true },
  )
}

export async function deletePost(postId) {
  return await Recipe.deleteOne({ _id: postId })
}