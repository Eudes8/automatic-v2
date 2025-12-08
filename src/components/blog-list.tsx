"use client"

import React from 'react'
import Link from 'next/link'

interface Post {
  id: string
  title: string
  excerpt: string
  date: string
  href: string
}

const BlogList: React.FC<{ posts: Post[] }> = ({ posts }) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((p) => (
        <article key={p.id} className="rounded-lg border border-border/40 p-6 bg-card">
          <h3 className="text-lg font-semibold text-foreground mb-2">{p.title}</h3>
          <p className="text-sm text-muted-foreground mb-4">{p.excerpt}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{p.date}</span>
            <Link href={p.href} className="text-sm text-primary underline">Lire</Link>
          </div>
        </article>
      ))}
    </div>
  )
}

export default BlogList
