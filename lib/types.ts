export interface Post {
  id: string
  title: string
  content: string
  author: string
  createdAt: Date
  updatedAt: Date
  views: number
}

export interface CreatePostInput {
  title: string
  content: string
  author: string
}

export interface UpdatePostInput {
  title?: string
  content?: string
  author?: string
}
