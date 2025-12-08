import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const body = await request.json()

    // Enregistrer la signature et mettre à jour le statut
    await prisma.contract.update({
      where: { id },
      data: {
        signature: body,
        status: 'signed'
      }
    })

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: 'Invalid payload or DB error' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
  }
}
