import { NextRequest, NextResponse } from 'next/server'
import { storage } from '@/lib/storage'

export async function GET() {
  const posts = storage.getAllPosts()
  return NextResponse.json(posts)
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  if (!body.title || !body.content || !body.author) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    )
  }

  const post = storage.createPost(body)
  return NextResponse.json(post, { status: 201 })
}
