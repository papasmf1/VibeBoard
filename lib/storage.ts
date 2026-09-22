import { Post, CreatePostInput, UpdatePostInput } from './types'
import { supabase, isSupabaseConfigured } from './supabase'

// Fallback in-memory storage when Supabase is not configured
let fallbackPosts: Post[] = [
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

let fallbackNextId = 3

export const storage = {
  async getAllPosts(): Promise<Post[]> {
    // Use fallback if Supabase is not configured
    if (!isSupabaseConfigured() || !supabase) {
      return fallbackPosts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    }

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching posts:', error)
      // Fall back to in-memory storage on error
      return fallbackPosts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    }

    return (data || []).map((post) => ({
      id: post.id.toString(),
      title: post.title,
      content: post.content,
      author: post.author,
      createdAt: new Date(post.created_at),
      updatedAt: new Date(post.updated_at),
      views: post.views || 0,
    }))
  },

  async getPost(id: string): Promise<Post | undefined> {
    // Use fallback if Supabase is not configured
    if (!isSupabaseConfigured() || !supabase) {
      const post = fallbackPosts.find(p => p.id === id)
      if (post) {
        post.views++
      }
      return post
    }

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', parseInt(id))
      .single()

    if (error) {
      console.error('Error fetching post:', error)
      // Fall back to in-memory storage on error
      const post = fallbackPosts.find(p => p.id === id)
      if (post) {
        post.views++
      }
      return post
    }

    if (!data) return undefined

    // Increment views
    await supabase
      .from('posts')
      .update({ views: (data.views || 0) + 1 })
      .eq('id', parseInt(id))

    return {
      id: data.id.toString(),
      title: data.title,
      content: data.content,
      author: data.author,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      views: (data.views || 0) + 1,
    }
  },

  async createPost(input: CreatePostInput): Promise<Post> {
    // Use fallback if Supabase is not configured
    if (!isSupabaseConfigured() || !supabase) {
      const post: Post = {
        id: String(fallbackNextId++),
        ...input,
        createdAt: new Date(),
        updatedAt: new Date(),
        views: 0,
      }
      fallbackPosts.push(post)
      return post
    }

    const { data, error } = await supabase
      .from('posts')
      .insert([
        {
          title: input.title,
          content: input.content,
          author: input.author,
          views: 0,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Error creating post:', error)
      // Fall back to in-memory storage on error
      const post: Post = {
        id: String(fallbackNextId++),
        ...input,
        createdAt: new Date(),
        updatedAt: new Date(),
        views: 0,
      }
      fallbackPosts.push(post)
      return post
    }

    return {
      id: data.id.toString(),
      title: data.title,
      content: data.content,
      author: data.author,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      views: data.views || 0,
    }
  },

  async updatePost(id: string, input: UpdatePostInput): Promise<Post | undefined> {
    // Use fallback if Supabase is not configured
    if (!isSupabaseConfigured() || !supabase) {
      const post = fallbackPosts.find(p => p.id === id)
      if (post) {
        Object.assign(post, input)
        post.updatedAt = new Date()
      }
      return post
    }

    const updateData: Record<string, unknown> = {}
    if (input.title) updateData.title = input.title
    if (input.content) updateData.content = input.content
    if (input.author) updateData.author = input.author

    const { data, error } = await supabase
      .from('posts')
      .update(updateData)
      .eq('id', parseInt(id))
      .select()
      .single()

    if (error) {
      console.error('Error updating post:', error)
      // Fall back to in-memory storage on error
      const post = fallbackPosts.find(p => p.id === id)
      if (post) {
        Object.assign(post, input)
        post.updatedAt = new Date()
      }
      return post
    }

    if (!data) return undefined

    return {
      id: data.id.toString(),
      title: data.title,
      content: data.content,
      author: data.author,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      views: data.views || 0,
    }
  },

  async deletePost(id: string): Promise<boolean> {
    // Use fallback if Supabase is not configured
    if (!isSupabaseConfigured() || !supabase) {
      const index = fallbackPosts.findIndex(p => p.id === id)
      if (index !== -1) {
        fallbackPosts.splice(index, 1)
        return true
      }
      return false
    }

    const { error } = await supabase.from('posts').delete().eq('id', parseInt(id))

    if (error) {
      console.error('Error deleting post:', error)
      // Fall back to in-memory storage on error
      const index = fallbackPosts.findIndex(p => p.id === id)
      if (index !== -1) {
        fallbackPosts.splice(index, 1)
        return true
      }
      return false
    }

    return true
  },
}
