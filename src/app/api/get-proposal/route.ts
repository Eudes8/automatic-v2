import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const proposalId = searchParams.get('proposalId')
    
    if (!proposalId) {
      return NextResponse.json(
        { error: 'ID de proposition manquant' },
        { status: 400 }
      )
    }

    const proposal = await prisma.proposal.findUnique({ where: { id: proposalId } })

    if (!proposal) {
      return NextResponse.json({ error: 'Proposition non trouvée' }, { status: 404 })
    }

    return NextResponse.json({ success: true, proposal })
    
  } catch (error) {
    console.error('Erreur lors de la récupération de la proposition:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la proposition' },
      { status: 500 }
    )
  }
}