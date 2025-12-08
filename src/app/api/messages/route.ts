import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const convs = await prisma.conversation.findMany({
    include: { messages: { take: 1, orderBy: { timestamp: 'desc' } } },
    orderBy: { createdAt: 'desc' }
  })

  const formatted = convs.map(c => ({
    id: c.id,
    title: c.title,
    lastMessage: c.messages[0]?.content || null,
    lastMessageTime: c.messages[0]?.timestamp || c.createdAt,
    unreadCount: c.messages.length,
    type: c.type
  }))

  return NextResponse.json(formatted)
}
