'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Post } from '@/lib/types'
import { useRouter } from 'next/navigation'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function PostPage({ params }: PageProps) {
  const router = useRouter()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [id, setId] = useState<string>('')

  useEffect(() => {
    const getParams = async () => {
      const { id: postId } = await params
      setId(postId)
    }
    getParams()
  }, [params])

  useEffect(() => {
    if (!id) return

    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${id}`)
        if (!response.ok) {
          setError('Post not found')
          return
        }
        const data = await response.json()
        setPost(data)
      } catch (error) {
        console.error('Failed to fetch post:', error)
        setError('Failed to load post')
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [id])

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return
    }

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.push('/')
      } else {
        alert('Failed to delete post')
      }
    } catch (error) {
      console.error('Failed to delete post:', error)
      alert('Failed to delete post')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6">
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-destructive mb-4">{error || 'Post not found'}</p>
            <Link href="/">
              <Button>Back to Posts</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4">&larr; Back to Posts</Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">{post.title}</CardTitle>
            <CardDescription>
              By {post.author} · {new Date(post.createdAt).toLocaleDateString()} · {post.views} views
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none mb-6">
              <p className="whitespace-pre-wrap text-foreground">{post.content}</p>
            </div>

            <div className="flex gap-2 pt-6 border-t">
              <Link href={`/posts/${post.id}/edit`}>
                <Button variant="outline">Edit</Button>
              </Link>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
