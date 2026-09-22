import { Post, CreatePostInput, UpdatePostInput } from './types'
import { supabase } from './supabase'

export const storage = {
  async getAllPosts(): Promise<Post[]> {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching posts:', error)
      return []
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
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', parseInt(id))
      .single()

    if (error) {
      console.error('Error fetching post:', error)
      return undefined
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
      throw new Error(`Failed to create post: ${error.message}`)
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
      return undefined
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
    const { error } = await supabase.from('posts').delete().eq('id', parseInt(id))

    if (error) {
      console.error('Error deleting post:', error)
      return false
    }

    return true
  },
}
