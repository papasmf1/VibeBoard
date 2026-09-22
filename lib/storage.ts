import { Post, CreatePostInput, UpdatePostInput } from './types'

let posts: Post[] = [
  {
    id: '1',
    title: 'Welcome to VibeBoard',
    content: 'This is the first post on VibeBoard. Feel free to share your thoughts and ideas!',
    author: 'Admin',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    views: 42,
  },
  {
    id: '2',
    title: 'Getting Started with VibeBoard',
    content: 'Learn how to create, edit, and delete posts on our simple and elegant board platform.',
    author: 'Admin',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
    views: 28,
  },
]

let nextId = 3

export const storage = {
  getAllPosts(): Post[] {
    return posts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  },

  getPost(id: string): Post | undefined {
    const post = posts.find(p => p.id === id)
    if (post) {
      post.views++
    }
    return post
  },

  createPost(input: CreatePostInput): Post {
    const post: Post = {
      id: String(nextId++),
      ...input,
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0,
    }
    posts.push(post)
    return post
  },

  updatePost(id: string, input: UpdatePostInput): Post | undefined {
    const post = posts.find(p => p.id === id)
    if (post) {
      Object.assign(post, input)
      post.updatedAt = new Date()
    }
    return post
  },

  deletePost(id: string): boolean {
    const index = posts.findIndex(p => p.id === id)
    if (index !== -1) {
      posts.splice(index, 1)
      return true
    }
    return false
  },
}
