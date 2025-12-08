import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { proposalId } = await request.json()
    
    // Validation des données
    if (!proposalId) {
      return NextResponse.json(
        { error: 'ID de proposition manquant' },
        { status: 400 }
      )
    }

    // Mettre à jour le statut dans la base
    const updated = await prisma.proposal.update({
      where: { id: proposalId },
      data: { status: 'validated' }
    })

    return NextResponse.json({
      success: true,
      message: 'Proposition validée avec succès',
      proposalId,
      status: updated.status,
      nextStep: 'contract_generation'
    })
    
  } catch (error) {
    console.error('Erreur lors de la validation de la proposition:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la validation de la proposition' },
      { status: 500 }
    )
  }
}